import Link from "next/link";
import type { Article } from "@/lib/markdoc/articles";

type ArticlePreviewCardProps = {
  article: Article;
};

export function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <article className="article-preview-card">
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

      <div className="chips">
        {article.tags.map((tag) => (
          <span className="chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <Link className="case-link" href={article.href}>
        Read story <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
