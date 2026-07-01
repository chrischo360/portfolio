import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/markdoc/articles";
import { renderArticle } from "@/lib/markdoc/render";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getArticles("blog").map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("blog", slug);

  if (!article) {
    return {
      title: "Blog",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = getArticle("blog", slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="section-pad article-page">
      <Link className="case-link" href="/blog">
        ← Back to blog
      </Link>

      <header className="article-hero">
        <p className="article-eyebrow">{article.eyebrow}</p>
        <h1>{article.title}</h1>
        <p className="article-dek">{article.summary}</p>
        {article.tags.length > 0 && (
          <div className="article-tags" aria-label="Article topics">
            {article.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </header>

      <div className="article-content">
        {renderArticle(article.content, {
          title: article.title,
          summary: article.summary,
        })}
      </div>
    </article>
  );
}
