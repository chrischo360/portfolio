import type { ReactNode } from "react";

type ArticleCalloutProps = {
  tone?: "neutral" | "warning" | "success";
  title: string;
  children: ReactNode;
};

export function ArticleCallout({
  tone = "neutral",
  title,
  children,
}: ArticleCalloutProps) {
  return (
    <aside className={`article-callout ${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
