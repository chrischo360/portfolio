"use client";

import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";

type ArticleVideoComparisonProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  status?: "ready" | "planned";
};

type ActiveVideo = "before" | "after" | "complete";

function isElementInViewport(element: HTMLElement | null) {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return rect.bottom > 0 && rect.top < window.innerHeight;
}

function scrollElementIntoView(
  element: HTMLElement | null,
  block: ScrollLogicalPosition = "center",
) {
  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const scrollPaddingTop = Number.parseFloat(
    window.getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  const targetTop =
    block === "start"
      ? window.scrollY + rect.top - scrollPaddingTop
      : window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
  const maxScrollTop =
    document.documentElement.scrollHeight - window.innerHeight;
  const targetScrollTop = Math.min(Math.max(targetTop, 0), maxScrollTop);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: targetScrollTop, behavior: "auto" });
    return;
  }

  const startScrollTop = window.scrollY;
  const distance = targetScrollTop - startScrollTop;
  const duration = 300;
  const startTime = performance.now();

  function animateScroll(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startScrollTop + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

function scrollNextSectionIntoView(container: HTMLElement | null) {
  const nextElement = container?.nextElementSibling;

  if (nextElement instanceof HTMLElement) {
    scrollElementIntoView(nextElement, "start");
  }
}

export function ArticleVideoComparison({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  status = "ready",
}: ArticleVideoComparisonProps) {
  const containerRef = useRef<HTMLElement>(null);
  const beforePanelRef = useRef<HTMLDivElement>(null);
  const afterPanelRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLVideoElement>(null);
  const afterRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo>("before");

  useEffect(() => {
    if (status === "planned" || !beforeSrc || !afterSrc) {
      return;
    }

    const container = containerRef.current;
    const beforeVideo = beforeRef.current;

    if (!container || !beforeVideo) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) {
          return;
        }

        startedRef.current = true;
        void beforeVideo.play();
        observer.disconnect();
      },
      { threshold: 0.55 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [afterSrc, beforeSrc, status]);

  function playAfter() {
    const afterVideo = afterRef.current;

    if (!afterVideo) {
      return;
    }

    const shouldAutoScroll = isElementInViewport(beforePanelRef.current);

    setActiveVideo("after");

    if (shouldAutoScroll) {
      scrollElementIntoView(afterPanelRef.current);
    }

    afterVideo.currentTime = 0;
    void afterVideo.play();
  }

  function finishComparison() {
    setActiveVideo("complete");
  }

  const isPlanned = status === "planned" || !beforeSrc || !afterSrc;

  useEffect(() => {
    if (activeVideo !== "complete" || isPlanned) {
      return;
    }

    const shouldAutoScroll = isElementInViewport(afterPanelRef.current);

    for (const video of [beforeRef.current, afterRef.current]) {
      if (!video) {
        continue;
      }

      video.currentTime = 0;
      void video.play();
    }

    if (shouldAutoScroll) {
      scrollNextSectionIntoView(containerRef.current);
    }  }, [activeVideo, isPlanned]);

  return (
    <figure ref={containerRef} className="not-prose my-[38px] w-full">
      <div className="grid gap-4">
        <ComparisonPanel
          panelRef={beforePanelRef}
          label={beforeLabel}
          active={activeVideo === "before" || activeVideo === "complete"}
        >
          {isPlanned ? (
            <PlannedVideo />
          ) : (
            <video
              ref={beforeRef}
              className="m-0 block aspect-video h-auto w-full bg-[#101418] object-cover"
              muted
              playsInline
              preload="metadata"
              controls
              loop={activeVideo === "complete"}
              onEnded={playAfter}
            >
              <source src={beforeSrc} type="video/mp4" />
            </video>
          )}
        </ComparisonPanel>

        <ComparisonPanel
          panelRef={afterPanelRef}
          label={afterLabel}
          active={activeVideo === "after" || activeVideo === "complete"}
        >
          {isPlanned ? (
            <PlannedVideo />
          ) : (
            <video
              ref={afterRef}
              className="m-0 block aspect-video h-auto w-full bg-[#101418] object-cover"
              muted
              playsInline
              preload="metadata"
              controls
              loop={activeVideo === "complete"}
              onEnded={finishComparison}
            >
              <source src={afterSrc} type="video/mp4" />
            </video>
          )}
        </ComparisonPanel>
      </div>
      {caption && (
        <figcaption className="mt-[10px] font-ui text-[13px] text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function ComparisonPanel({
  panelRef,
  label,
  active,
  children,
}: {
  panelRef: Ref<HTMLDivElement>;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      className={`overflow-hidden rounded-card border bg-surface transition-all ${
        active
          ? "border-accent-line shadow-[0_0_44px_rgba(106,81,59,0.28)]"
          : "border-border opacity-55 grayscale-[35%]"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.08em] text-muted">
        <span>{label}</span>
        {active && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold text-accent-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Playing
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function PlannedVideo() {
  return (
    <div className="grid aspect-video place-content-center bg-[#101418] font-ui text-sm font-semibold text-white/70">
      Recording coming soon
    </div>
  );
}
