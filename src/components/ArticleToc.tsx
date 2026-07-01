"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/markdoc/toc";

type ArticleTocProps = {
  headings: TocItem[];
};

export function ArticleToc({ headings }: ArticleTocProps) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) {
    return null;
  }

  return (
    <nav className="article-toc" aria-label="On this page">
      <p className="article-toc-title">On this page</p>
      <ul>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "article-toc-sub" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className={activeId === heading.id ? "is-active" : undefined}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
