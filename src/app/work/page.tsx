import type { Metadata } from "next";
import { ArticlePreviewCard } from "@/components/ArticlePreviewCard";
import { getArticles } from "@/lib/markdoc/articles";

export const metadata: Metadata = {
  title: "Selected Work",
  description: "Narrative case studies behind selected work from Chris Cho.",
};

export default function WorkPage() {
  const articles = getArticles("work");

  return (
    <section className="section-pad work-index" aria-labelledby="work-title">
      <div className="eyebrow">Selected work</div>
      <h1 id="work-title">Stories behind shipped product work.</h1>
      <p className="lead">
        Narrative case studies about technical decisions, product constraints,
        tradeoffs, production safety, and the systems behind user-facing work.
      </p>

      <div className="article-preview-grid">
        {articles.map((article) => (
          <ArticlePreviewCard article={article} key={article.slug} />
        ))}
      </div>
    </section>
  );
}
