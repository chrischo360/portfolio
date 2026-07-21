"use client";

import { useEffect } from "react";
import { capturePortfolioEvent } from "@/lib/analytics";

type ArticleEngagementTrackerProps = {
  slug: string;
  title: string;
  type: "work" | "blog";
};

export function ArticleEngagementTracker({
  slug,
  title,
  type,
}: ArticleEngagementTrackerProps) {
  useEffect(() => {
    const baseProperties = {
      article_slug: slug,
      article_title: title,
      article_type: type,
      path: window.location.pathname,
    };
    const trackedScrollDepths = new Set<number>();
    let activeSeconds = 0;
    let trackedReadTime = false;

    const getScrollPercent = () => {
      const { documentElement } = document;
      const scrollableHeight = documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) return 100;

      return Math.min(
        100,
        Math.round((window.scrollY / scrollableHeight) * 100),
      );
    };

    const trackScrollDepth = () => {
      const scrollPercent = getScrollPercent();

      for (const threshold of [50, 90]) {
        if (scrollPercent < threshold || trackedScrollDepths.has(threshold)) {
          continue;
        }

        trackedScrollDepths.add(threshold);
        capturePortfolioEvent(
          threshold === 50 ? "article_scroll_50" : "article_scroll_90",
          {
            ...baseProperties,
            scroll_percent: threshold,
          },
        );
      }
    };

    const readTimer = window.setInterval(() => {
      if (document.hidden || trackedReadTime) return;

      activeSeconds += 1;

      if (activeSeconds < 30) return;

      trackedReadTime = true;
      window.clearInterval(readTimer);
      capturePortfolioEvent("article_read_time_30s", {
        ...baseProperties,
        active_seconds: activeSeconds,
      });
    }, 1000);

    trackScrollDepth();
    window.addEventListener("scroll", trackScrollDepth, { passive: true });

    return () => {
      window.clearInterval(readTimer);
      window.removeEventListener("scroll", trackScrollDepth);
    };
  }, [slug, title, type]);

  return null;
}
