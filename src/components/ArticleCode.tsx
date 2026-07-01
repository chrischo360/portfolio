import { codeToHtml } from "shiki";

type ArticleCodeProps = {
  content: string;
  language?: string;
};

export async function ArticleCode({ content, language }: ArticleCodeProps) {
  const html = await highlightCode(content, language);

  return (
    <figure className="article-code-block">
      {language && <figcaption>{language}</figcaption>}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

async function highlightCode(content: string, language = "text") {
  try {
    return await codeToHtml(content.trimEnd(), {
      lang: language,
      theme: "github-dark-default",
    });
  } catch {
    return await codeToHtml(content.trimEnd(), {
      lang: "text",
      theme: "github-dark-default",
    });
  }
}
