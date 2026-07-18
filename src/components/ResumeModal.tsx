"use client";

import { useEffect, useState } from "react";
import {
  ResumeDocument,
  type ResumeArticle,
} from "@/components/ResumeDocument";

type ResumeModalProps = {
  href: string;
  label: string;
  articles: ResumeArticle[];
};

export function ResumeModal({ href, label, articles }: ResumeModalProps) {
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
      <button className="text-link" type="button" onClick={() => setIsOpen(true)}>
        {label} <span aria-hidden="true">→</span>
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
                <a className="button secondary" href={href} download>
                  Download PDF
                </a>
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
