import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/markdoc/articles";

type ArticlePreviewCardProps = {
  article: Article;
};

export function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <article className="article-preview-card">
      {article.hero && (
        <figure className="article-preview-media">
          <Image
            src={article.hero.src}
            alt={article.hero.alt ?? ""}
            width={900}
            height={480}
            sizes="(max-width: 900px) 100vw, 460px"
          />
        </figure>
      )}

      <div>
        <p className="work-card-eyebrow">{article.eyebrow}</p>
        <h2>{article.title}</h2>
        <p>{article.summary}</p>
      </div>

      {article.impact && (
        <div className="resume-claim">
          <span>Why it matters</span>
          <p>{article.impact}</p>
        </div>
      )}

      <Link className="case-link" href={article.href}>
        Read story <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
