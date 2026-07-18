import React from "react";
import Markdoc from "@markdoc/markdoc";
import { ArticleCallout } from "@/components/ArticleCallout";
import { ArticleCode } from "@/components/ArticleCode";
import { ArticleFileLink } from "@/components/ArticleFileLink";
import { ArticleMedia } from "@/components/ArticleMedia";
import { ArticleVideoComparison } from "@/components/ArticleVideoComparison";
import { markdocConfig } from "./schema";

const components = {
  ArticleCallout,
  ArticleCode,
  ArticleFileLink,
  ArticleMedia,
  ArticleVideoComparison,
};

type RenderArticleOptions = {
  title?: string;
  summary?: string;
};

export function renderArticle(content: string, options: RenderArticleOptions = {}) {
  const ast = Markdoc.parse(getArticleBody(content, options));
  const transformed = Markdoc.transform(ast, markdocConfig);

  return Markdoc.renderers.react(transformed, React, {
    components,
  });
}

function getArticleBody(content: string, { title, summary }: RenderArticleOptions) {
  let body = content.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const lines = body.split("\n");

  while (lines[0] === "") {
    lines.shift();
  }

  if (title && lines[0] === `# ${title}`) {
    lines.shift();
  }

  while (lines[0] === "") {
    lines.shift();
  }

  if (summary && isMatchingSummary(lines[0], summary)) {
    lines.shift();
  }

  body = lines.join("\n").trimStart();

  return body;
}

function isMatchingSummary(line: string | undefined, summary: string) {
  if (!line) {
    return false;
  }

  return normalizeSummary(line) === normalizeSummary(summary);
}

function normalizeSummary(value: string) {
  return value
    .trim()
    .replace(/^I\s+/i, "")
    .toLowerCase();
}
