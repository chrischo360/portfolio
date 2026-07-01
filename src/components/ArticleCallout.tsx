import type { ReactNode } from "react";

type Tone = "neutral" | "warning" | "success";

type ArticleCalloutProps = {
  tone?: Tone;
  title: string;
  children: ReactNode;
};

const toneBorder: Record<Tone, string> = {
  neutral: "border-l-[color:var(--accent-line)]",
  warning: "border-l-[#b88242]",
  success: "border-l-success",
};

export function ArticleCallout({
  tone = "neutral",
  title,
  children,
}: ArticleCalloutProps) {
  return (
    <aside
      className={`my-[34px] max-w-[780px] rounded-card border border-border border-l-4 bg-surface p-6 shadow-[0_18px_46px_rgba(30,35,32,0.06)] ${toneBorder[tone]}`}
    >
      <strong className="mb-2 block font-ui text-[13px] font-bold uppercase tracking-[0.04em]">
        {title}
      </strong>
      <div className="[&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
