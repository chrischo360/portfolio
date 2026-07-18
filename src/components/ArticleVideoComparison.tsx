"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ArticleVideoComparisonProps = {
  beforeSrc?: string;
  afterSrc?: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  status?: "ready" | "planned";
};

type ActiveVideo = "before" | "after" | "complete";

export function ArticleVideoComparison({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  status = "ready",
}: ArticleVideoComparisonProps) {
  const containerRef = useRef<HTMLElement>(null);
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

    setActiveVideo("after");
    afterVideo.currentTime = 0;
    void afterVideo.play();
  }

  function finishComparison() {
    setActiveVideo("complete");
  }

  const isPlanned = status === "planned" || !beforeSrc || !afterSrc;

  return (
    <figure ref={containerRef} className="my-[38px] w-full">
      <div className="grid gap-4 md:grid-cols-2">
        <ComparisonPanel label={beforeLabel} active={activeVideo === "before"}>
          {isPlanned ? (
            <PlannedVideo />
          ) : (
            <video
              ref={beforeRef}
              className="block aspect-video h-auto w-full bg-[#101418] object-cover"
              muted
              playsInline
              preload="metadata"
              onEnded={playAfter}
            >
              <source src={beforeSrc} type="video/mp4" />
            </video>
          )}
        </ComparisonPanel>

        <ComparisonPanel label={afterLabel} active={activeVideo === "after"}>
          {isPlanned ? (
            <PlannedVideo />
          ) : (
            <video
              ref={afterRef}
              className="block aspect-video h-auto w-full bg-[#101418] object-cover"
              muted
              playsInline
              preload="metadata"
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
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-card border bg-surface transition-colors ${
        active ? "border-accent-line" : "border-border"
      }`}
    >
      <div className="border-b border-border px-4 py-2 font-ui text-xs font-bold uppercase tracking-[0.08em] text-muted">
        {label}
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
