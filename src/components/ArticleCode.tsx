import { codeToHtml } from "shiki";
import { ArticleMermaid } from "./ArticleMermaid";

type ArticleCodeProps = {
  content: string;
  language?: string;
};

export async function ArticleCode({ content, language }: ArticleCodeProps) {
  if (language === "mermaid") {
    return <ArticleMermaid chart={content.trimEnd()} />;
  }

  const html = await highlightCode(content, language);

  return (
    <figure className="my-[34px] w-full overflow-hidden rounded-card border border-white/[0.08] bg-[#0d1117] shadow-[0_22px_60px_rgba(30,35,32,0.12)]">
      {language && (
        <figcaption className="border-b border-white/[0.12] px-4 py-[11px] font-ui text-xs font-[750] uppercase tracking-[0.06em] text-[#d8d1c5]">
          {language}
        </figcaption>
      )}
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
