import Markdoc, { type Node } from "@markdoc/markdoc";

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getNodeText(node: Node): string {
  let text = "";

  for (const child of node.walk()) {
    if (child.type === "text" && typeof child.attributes.content === "string") {
      text += child.attributes.content;
    }
  }

  return text;
}

export function getHeadings(content: string): TocItem[] {
  const ast = Markdoc.parse(content);
  const headings: TocItem[] = [];

  for (const node of ast.walk()) {
    if (node.type !== "heading") {
      continue;
    }

    const level = Number(node.attributes.level);

    if (level !== 2 && level !== 3) {
      continue;
    }

    const title = getNodeText(node).trim();

    if (title) {
      headings.push({ id: slugify(title), title, level });
    }
  }

  return headings;
}
