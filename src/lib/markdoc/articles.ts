import fs from "node:fs";
import path from "node:path";
import Markdoc from "@markdoc/markdoc";
import yaml from "yaml";

export type ArticleCollection = "work" | "blog";

export type Article = {
  slug: string;
  collection: ArticleCollection;
  eyebrow: string;
  title: string;
  summary: string;
  impact?: string;
  tags: string[];
  href: string;
  content: string;
};

const contentRoot = path.join(process.cwd(), "src/content");

export function getArticles(collection?: ArticleCollection): Article[] {
  return getMarkdownFiles(contentRoot)
    .map(readArticle)
    .filter((article) => !collection || article.collection === collection)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getArticle(collection: ArticleCollection, slug: string) {
  return getArticles(collection).find((article) => article.slug === slug);
}

function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath);
    }

    return entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function readArticle(filePath: string): Article {
  const content = fs.readFileSync(filePath, "utf8");
  const ast = Markdoc.parse(content);
  const frontmatter = ast.attributes.frontmatter
    ? yaml.parse(ast.attributes.frontmatter)
    : {};

  return {
    ...frontmatter,
    href: `/${frontmatter.collection}/${frontmatter.slug}`,
    content,
  } as Article;
}
