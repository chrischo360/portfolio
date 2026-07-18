import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const sourcePath = path.resolve(process.argv[2] ?? path.join(rootDir, "resume/resume.tex"));
const resumeDir = path.join(rootDir, "resume");
const classPath = path.join(resumeDir, "resume.cls");
const generatedDataPath = path.join(rootDir, "src/data/resume.generated.json");
const publicPdfPath = path.join(rootDir, "public/resume.pdf");
const relatedWorkPattern = /\\relatedwork(?:\[([^\]]+)\])?\{([^}]+)\}/g;

function decodeLatex(value) {
  return value
    .replace(/\\href\{[^}]+\}\{([^}]+)\}/g, "$1")
    .replace(/\\texttt\{([^}]+)\}/g, "$1")
    .replace(/\{\\(?:bf|em)\s+([^}]+)\}/g, "$1")
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\\_/g, "_")
    .replace(/---/g, "—")
    .replace(/--/g, "—")
    .replace(/~/g, " ")
    .replace(/\\(?:smallskip|medskip|bigskip)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArguments(source, start, count) {
  const values = [];
  let cursor = start;

  while (values.length < count) {
    while (/\s/.test(source[cursor] ?? "")) cursor += 1;
    if (source[cursor] !== "{") {
      throw new Error(`Expected argument ${values.length + 1} near: ${source.slice(cursor, cursor + 80)}`);
    }

    let depth = 0;
    let value = "";

    for (; cursor < source.length; cursor += 1) {
      const character = source[cursor];

      if (character === "{") {
        depth += 1;
        if (depth > 1) value += character;
        continue;
      }

      if (character === "}") {
        depth -= 1;
        if (depth === 0) {
          cursor += 1;
          break;
        }
      }

      if (depth > 0) value += character;
    }

    if (depth !== 0) throw new Error("Unclosed LaTeX argument");
    values.push(value);
  }

  return { values, end: cursor };
}

function extractEnvironment(source, name) {
  const startMarker = `\\begin{${name}}`;
  const endMarker = `\\end{${name}}`;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);

  if (start === -1 || end === -1) {
    throw new Error(`Missing ${name} environment`);
  }

  return source.slice(start + startMarker.length, end);
}

function extractSections(source) {
  const sections = new Map();
  const pattern = /\\begin\{rSection\}\{([^}]+)\}/g;
  let match;

  while ((match = pattern.exec(source))) {
    const end = source.indexOf("\\end{rSection}", pattern.lastIndex);
    if (end === -1) throw new Error(`Unclosed ${match[1]} section`);
    sections.set(decodeLatex(match[1]), source.slice(pattern.lastIndex, end));
    pattern.lastIndex = end + "\\end{rSection}".length;
  }

  return sections;
}

function parseRelatedWork(source) {
  const macroMatch = [...source.matchAll(relatedWorkPattern)][0];

  if (macroMatch) {
    return {
      slug: macroMatch[2],
      ...(macroMatch[1] ? { label: decodeLatex(macroMatch[1]) } : {}),
    };
  }

  const hrefMatch = source.match(
    /\\href\{https?:\/\/(?:www\.)?christopher-cho\.dev\/work\/([^}]+)\}\{[^}]+\}/,
  );

  return hrefMatch ? { slug: hrefMatch[1] } : undefined;
}

function parseBullet(source) {
  const relatedWork = parseRelatedWork(source);
  const text = decodeLatex(
    source
      .replace(relatedWorkPattern, "")
      .replace(
        /\(?\\href\{https?:\/\/(?:www\.)?christopher-cho\.dev\/work\/[^}]+\}\{[^}]+\}\)?/g,
        "",
      ),
  );

  return {
    text,
    ...(relatedWork ? { relatedWork } : {}),
  };
}

function parseLinkedValue(source) {
  const match = source.trim().match(/^\\href\{([^}]+)\}\{([^}]+)\}$/);

  if (!match) return { value: decodeLatex(source) };

  return {
    value: decodeLatex(match[2]),
    href: match[1],
  };
}

function parseEntries(source) {
  const entries = [];
  const marker = "\\begin{rSubsection}";
  let start = source.indexOf(marker);

  while (start !== -1) {
    const { values, end: argumentsEnd } = parseArguments(
      source,
      start + marker.length,
      4,
    );
    const subsectionEnd = source.indexOf("\\end{rSubsection}", argumentsEnd);
    if (subsectionEnd === -1) throw new Error("Unclosed rSubsection environment");

    const body = source.slice(argumentsEnd, subsectionEnd);
    const bullets = [];
    const bulletPattern = /\\item\s+([\s\S]*?)(?=\n\s*\\item\s+|$)/g;
    let bulletMatch;

    while ((bulletMatch = bulletPattern.exec(body))) {
      bullets.push(parseBullet(bulletMatch[1]));
    }

    const role = parseLinkedValue(values[2]);
    entries.push({
      organization: decodeLatex(values[0]),
      ...(values[1].trim() ? { location: decodeLatex(values[1]) } : {}),
      role: role.value,
      ...(role.href ? { roleHref: role.href } : {}),
      ...(values[3].trim() ? { period: decodeLatex(values[3]) } : {}),
      bullets,
    });

    start = source.indexOf(marker, subsectionEnd + "\\end{rSubsection}".length);
  }

  return entries;
}

function parseContact(source) {
  const center = extractEnvironment(source, "center");
  const nameMatch = center.match(/\{\\huge\s+\\scshape\s+([^}]+)\}/);
  if (!nameMatch) throw new Error("Could not parse resume name");

  const contactSource = center.split("\\small")[1];
  if (!contactSource) throw new Error("Could not parse resume contact information");

  const contact = contactSource.split("$|$").map((item) => {
    const value = item.replace(/\\\\/g, "").trim();
    const link = value.match(/^\\href\{([^}]+)\}\{([^}]+)\}$/);

    if (!link) {
      const label = decodeLatex(value);
      const phoneNumber = label.replace(/\D/g, "");

      return {
        label,
        ...(phoneNumber.length === 10 ? { href: `tel:+1${phoneNumber}` } : {}),
      };
    }

    return {
      label: decodeLatex(link[2]),
      href: link[1],
    };
  });

  return { name: decodeLatex(nameMatch[1]), contact };
}

function parseEducation(source) {
  const school = source.match(/\{\\bf\s+([^}]+)\}/);
  const degree = source.match(/\{\\em\s+([^}]+)\}/);
  const honors = source.match(/Honors:\s*([^\n]+)/);

  if (!school || !degree || !honors) {
    throw new Error("Could not parse Education section");
  }

  return {
    school: decodeLatex(school[1]),
    degree: decodeLatex(degree[1]),
    honors: decodeLatex(honors[1]),
  };
}

function parseSkills(source) {
  const skills = [];
  const rowPattern = /\\textbf\{([^}]+)\}\s*&\s*([\s\S]*?)\\\\/g;
  let match;

  while ((match = rowPattern.exec(source))) {
    skills.push({
      label: decodeLatex(match[1]).replace(/:$/, ""),
      value: decodeLatex(match[2]),
    });
  }

  if (skills.length === 0) throw new Error("Could not parse Skills section");
  return skills;
}

function parseResume(source) {
  const header = parseContact(source);
  const sections = extractSections(source);
  const experience = sections.get("Experience");
  const projects = sections.get("Projects");
  const education = sections.get("Education");
  const skills = sections.get("Skills");

  if (!experience || !projects || !education || !skills) {
    throw new Error("Resume must include Experience, Projects, Education, and Skills sections");
  }

  const howIWork = parseRelatedWork(skills);

  return {
    ...header,
    experience: parseEntries(experience),
    projects: parseEntries(projects),
    education: parseEducation(education),
    skills: parseSkills(skills),
    ...(howIWork ? { howIWork } : {}),
  };
}

function getMarkdownFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const filePath = path.join(directory, name);
    return statSync(filePath).isDirectory()
      ? getMarkdownFiles(filePath)
      : filePath.endsWith(".md")
        ? [filePath]
        : [];
  });
}

function getVisibleWorkSlugs() {
  const workDir = path.join(rootDir, "src/content/work");
  const slugs = new Set();

  for (const filePath of getMarkdownFiles(workDir)) {
    const source = readFileSync(filePath, "utf8");
    const frontmatterMatch = source.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;

    const frontmatter = YAML.parse(frontmatterMatch[1]);
    if (frontmatter.slug && !frontmatter.hidden) slugs.add(frontmatter.slug);
  }

  return slugs;
}

function filterHiddenRelatedWork(source, visibleSlugs) {
  return source.replace(relatedWorkPattern, (macro, _label, slug) =>
    visibleSlugs.has(slug) ? macro : "",
  );
}

function compilePdf(source, visibleSlugs) {
  const temporaryDirectory = mkdtempSync(path.join(tmpdir(), "portfolio-resume-"));

  try {
    writeFileSync(
      path.join(temporaryDirectory, "resume.tex"),
      filterHiddenRelatedWork(source, visibleSlugs),
    );
    copyFileSync(classPath, path.join(temporaryDirectory, "resume.cls"));

    const result = spawnSync(
      "pdflatex",
      ["-interaction=nonstopmode", "-halt-on-error", "resume.tex"],
      {
        cwd: temporaryDirectory,
        encoding: "utf8",
      },
    );

    if (result.error) {
      throw new Error(`Could not run pdflatex: ${result.error.message}`);
    }

    if (result.status !== 0) {
      throw new Error(result.stdout.trim().split("\n").slice(-20).join("\n"));
    }

    return readFileSync(path.join(temporaryDirectory, "resume.pdf"));
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}

function syncResume() {
  if (!existsSync(sourcePath)) throw new Error(`Resume source not found: ${sourcePath}`);
  if (!existsSync(classPath)) throw new Error(`Resume class not found: ${classPath}`);

  const source = readFileSync(sourcePath, "utf8");
  const resumeData = parseResume(source);
  const pdf = compilePdf(source, getVisibleWorkSlugs());
  const canonicalSourcePath = path.join(resumeDir, "resume.tex");

  if (sourcePath !== canonicalSourcePath) copyFileSync(sourcePath, canonicalSourcePath);
  writeFileSync(generatedDataPath, `${JSON.stringify(resumeData, null, 2)}\n`);
  writeFileSync(publicPdfPath, pdf);

  console.log(`Synced ${path.relative(rootDir, sourcePath) || "resume/resume.tex"}`);
  console.log("Updated resume/resume.tex, src/data/resume.generated.json, and public/resume.pdf");
}

try {
  syncResume();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
