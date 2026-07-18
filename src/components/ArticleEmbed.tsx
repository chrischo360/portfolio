"use client";

import { useEffect, useId, useRef, useState } from "react";

type ArticleEmbedProps = {
  src: string;
  title: string;
  openLabel?: string;
  description?: string;
};

export function ArticleEmbed({
  src,
  title,
  openLabel = "Open interactive demo",
  description = "Explore the demo in a larger view.",
}: ArticleEmbedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <div className="article-demo-preview">
        <iframe
          aria-hidden="true"
          className="article-demo-preview-frame"
          loading="lazy"
          src={src}
          tabIndex={-1}
          title={`${title} preview`}
        />
        <div className="article-demo-preview-veil" aria-hidden="true" />
        <button
          ref={triggerRef}
          className="article-demo-open"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <span className="article-demo-expand" aria-hidden="true">↗</span>
          <span className="article-demo-open-card">
            <span className="article-demo-kicker">Interactive demo</span>
            <strong>{openLabel}</strong>
            <span>{description}</span>
          </span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="article-demo-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          setIsOpen(false);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="article-demo-modal">
          <header className="article-demo-modal-header">
            <div>
              <span className="article-demo-kicker">Interactive demo</span>
              <h2 id={titleId}>{title}</h2>
              <p>{description}</p>
            </div>
            <div className="article-demo-modal-actions">
              <a href={src} target="_blank" rel="noopener noreferrer">
                Open in new tab
              </a>
              <button type="button" aria-label="Close demo" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
          </header>
          {isOpen && <iframe className="article-demo-modal-frame" src={src} title={title} />}
        </div>
      </dialog>
    </>
  );
}
