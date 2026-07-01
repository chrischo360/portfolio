import type { Metadata } from "next";
import { ArticlePreviewCard } from "@/components/ArticlePreviewCard";
import { blogContent } from "@/data/content";
import { getArticles } from "@/lib/markdoc/articles";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const articles = getArticles("blog");

  return (
    <section className="section-pad blog-index" aria-labelledby="blog-title">
      <div className="eyebrow">{blogContent.eyebrow}</div>
      <h1 id="blog-title">{blogContent.heading}</h1>
      <p className="lead">{blogContent.lead}</p>

      {articles.length > 0 && (
        <div className="article-preview-grid">
          {articles.map((article) => (
            <ArticlePreviewCard article={article} key={article.slug} />
          ))}
        </div>
      )}
    </section>
  );
}
