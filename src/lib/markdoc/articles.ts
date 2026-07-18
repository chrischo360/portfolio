import fs from "node:fs";
import path from "node:path";
import Markdoc from "@markdoc/markdoc";
import yaml from "yaml";

export type ArticleCollection = "work" | "blog";

type ArticleImage = {
  type?: "image" | "gif";
  src: string;
  alt?: string;
};

export type Article = {
  slug: string;
  collection: ArticleCollection;
  eyebrow: string;
  title: string;
  summary: string;
  impact?: string;
  hidden?: boolean;
  order?: number;
  hero?: ArticleImage;
  cardImage?: ArticleImage;
  tags: string[];
  href: string;
  content: string;
};

const contentRoot = path.join(process.cwd(), "src/content");

export function getArticles(collection?: ArticleCollection): Article[] {
  return getMarkdownFiles(contentRoot)
    .map(readArticle)
    .filter((article) => !article.hidden)
    .filter((article) => !collection || article.collection === collection)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      return orderA - orderB || a.title.localeCompare(b.title);
    });
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
    cardImage: frontmatter.cardImage ?? frontmatter.hero,
    href: `/${frontmatter.collection}/${frontmatter.slug}`,
    content,
  } as Article;
}
