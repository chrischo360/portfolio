"use client";

import { useEffect, useState } from "react";

type ArticleFileLinkProps = {
  src: string;
  label: string;
  lang?: string;
};

function toGithubUrl(rawUrl: string): string {
  return rawUrl
    .replace("raw.githubusercontent.com", "github.com")
    .replace(/github\.com\/([^/]+\/[^/]+)\//, "github.com/$1/blob/");
}

export function ArticleFileLink({ src, label, lang = "bash" }: ArticleFileLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  async function handleOpen() {
    setIsOpen(true);
    if (highlighted) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ src, lang: lang ?? "bash" });
      const res = await fetch(`/api/file-preview?${params}`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHighlighted(data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
    } finally {
      setLoading(false);
    }
  }

  const filename = src.split("/").pop() ?? label;
  const githubUrl = toGithubUrl(src);

  return (
    <>
      <button className="filelink-trigger" type="button" onClick={handleOpen}>
        <code>{label}</code>
      </button>
      {isOpen && (
        <div
          className="filelink-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`File: ${filename}`}
        >
          <div className="filelink-backdrop" onClick={() => setIsOpen(false)} />
          <div className="filelink-panel">
            <div className="filelink-header">
              <code className="filelink-filename">{filename}</code>
              <a
                className="filelink-github-link"
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub ↗
              </a>
            </div>
            <div className="filelink-content">
              {loading && <p className="filelink-status">Loading…</p>}
              {error && <p className="filelink-status filelink-error">{error}</p>}
              {highlighted && (
                <div
                  className="filelink-code"
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
