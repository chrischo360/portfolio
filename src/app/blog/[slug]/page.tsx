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

      <header className="mx-auto mt-[54px] max-w-[860px] border-b border-border pt-[58px] pb-[42px]">
        <p className="mb-[18px] font-ui text-[13px] font-[750] uppercase tracking-[0.08em] text-accent-ink">
          {article.eyebrow}
        </p>
        <h1 className="m-0 max-w-[780px] font-heading text-[clamp(46px,8vw,82px)] font-medium leading-[0.95] tracking-[-0.065em]">
          {article.title}
        </h1>
        <p className="mt-[26px] max-w-[680px] text-[clamp(21px,2.5vw,28px)] leading-[1.35] text-fg">
          {article.summary}
        </p>
        {article.tags.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-[10px]" aria-label="Article topics">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-[rgba(255,254,250,0.72)] px-[11px] py-[7px] font-ui text-xs font-bold text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mx-auto mt-[54px] max-w-[860px]">
        <div className="prose prose-neutral max-w-none prose-headings:max-w-[680px] prose-p:max-w-[680px] prose-ul:max-w-[680px] prose-ol:max-w-[680px] prose-blockquote:max-w-[780px] prose-pre:m-0 prose-pre:rounded-none prose-pre:p-[22px] prose-pre:!bg-transparent">
          {renderArticle(article.content, {
            title: article.title,
            summary: article.summary,
          })}
        </div>
      </div>
    </article>
  );
}
