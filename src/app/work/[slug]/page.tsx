import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/markdoc/articles";
import { renderArticle } from "@/lib/markdoc/render";
import { getHeadings } from "@/lib/markdoc/toc";
import { ArticleToc } from "@/components/ArticleToc";

type WorkArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getArticles("work").map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("work", slug);

  if (!article) {
    return {
      title: "Work",
    };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function WorkArticlePage({ params }: WorkArticlePageProps) {
  const { slug } = await params;
  const article = getArticle("work", slug);

  if (!article) {
    notFound();
  }

  const headings = getHeadings(article.content);

  return (
    <article className="section-pad article-page">
      <Link className="case-link" href="/work">
        ← Back to selected work
      </Link>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start lg:gap-16">
        <div className="min-w-0">
          <header className="mx-auto mt-[54px] max-w-[860px] border-b border-border pt-[58px] pb-[42px]">
            <p className="mb-[18px] font-ui text-[13px] font-[750] uppercase tracking-[0.08em] text-accent-ink">
              {article.eyebrow}
            </p>
            <h1 className="m-0 max-w-[780px] font-heading text-[clamp(46px,8vw,82px)] font-medium leading-[0.95] tracking-[-0.065em]">
              {article.title}
            </h1>
            {article.hero && (
              <figure className="mt-[34px] overflow-hidden rounded-card border border-border bg-surface shadow-[0_18px_46px_rgba(30,35,32,0.08)]">
                <Image
                  className="block h-auto max-h-[460px] w-full object-cover"
                  src={article.hero.src}
                  alt={article.hero.alt ?? ""}
                  width={1200}
                  height={720}
                  priority
                  sizes="(max-width: 900px) 100vw, 720px"
                />
              </figure>
            )}
            <p
              className={`max-w-[680px] text-[clamp(21px,2.5vw,28px)] leading-[1.35] text-fg ${
                article.hero ? "mt-[34px]" : "mt-[26px]"
              }`}
            >
              {article.summary}
            </p>
            {article.impact && (
              <p className="mt-[18px] max-w-[680px] text-[17px] leading-[1.6] text-muted">
                {article.impact}
              </p>
            )}
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
          </header>

          <div className="mt-[54px]">
            <div className="prose prose-neutral max-w-none prose-headings:max-w-[680px] prose-p:max-w-[680px] prose-ul:max-w-[680px] prose-ol:max-w-[680px] prose-blockquote:max-w-[780px] prose-pre:m-0 prose-pre:rounded-none prose-pre:p-[22px] prose-pre:!bg-transparent">
              {renderArticle(article.content, {
                title: article.title,
                summary: article.summary,
              })}
            </div>
          </div>
        </div>

        <aside className="mt-[54px] hidden lg:block lg:sticky lg:top-[96px] lg:self-start">
          <ArticleToc headings={headings} />
        </aside>
      </div>
    </article>
  );
}
