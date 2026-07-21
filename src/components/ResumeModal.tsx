"use client";

import { useEffect, useState } from "react";
import {
  ResumeDocument,
  type ResumeArticle,
} from "@/components/ResumeDocument";
import { TrackedAnchor } from "@/components/TrackedLink";
import { capturePortfolioEvent } from "@/lib/analytics";

type ResumeModalProps = {
  href: string;
  label: string;
  articles: ResumeArticle[];
  className?: string;
  icon?: string;
  icons?: string[];
};

export function ResumeModal({
  href,
  label,
  articles,
  className = "text-link",
  icon,
  icons,
}: ResumeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          capturePortfolioEvent("resume_opened", { source: "homepage" });
          setIsOpen(true);
        }}
      >
        {(icon || icons?.length) && (
          <span className="resume-link-icon" aria-hidden="true">
            {icons?.length
              ? icons.map((symbol) => (
                  <span className="resume-link-icon-symbol" key={symbol}>
                    {symbol}
                  </span>
                ))
              : icon}
          </span>
        )}
        {label} <span className="text-link-arrow" aria-hidden="true">→</span>
      </button>
      {isOpen && (
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          <div className="resume-modal-backdrop" onClick={() => setIsOpen(false)} />
          <div className="resume-modal-panel">
            <div className="resume-modal-header">
              <div>
                <h2 id="resume-modal-title">Resume</h2>
              </div>
              <div className="resume-modal-actions">
                <TrackedAnchor
                  className="button secondary"
                  href={href}
                  download
                  eventName="resume_downloaded"
                  eventProperties={{ source: "resume_modal" }}
                >
                  Download PDF
                </TrackedAnchor>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Close resume"
                  autoFocus
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <ResumeDocument articles={articles} />
          </div>
        </div>
      )}
    </>
  );
}
