"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ArticleMermaidProps = {
  chart: string;
};

export function ArticleMermaid({ chart }: ArticleMermaidProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [modalScale, setModalScale] = useState(1.25);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const renderedChart = useRef<string>("");

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      if (renderedChart.current === chart) {
        return;
      }

      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "#fffefa",
            primaryColor: "#f7efe4",
            primaryTextColor: "#1f231f",
            primaryBorderColor: "#d8cfc2",
            lineColor: "#776b5f",
            secondaryColor: "#eef0e7",
            tertiaryColor: "#fffefa",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          },
        });

        const result = await mermaid.render(`mermaid-${id}`, chart);

        if (!cancelled) {
          renderedChart.current = chart;
          setSvg(result.svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to render diagram");
        }
      }
    }

    renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const canRenderControls = Boolean(svg && !error);

  return (
    <>
      <figure className="my-[34px] w-full overflow-hidden rounded-card border border-border bg-surface shadow-[0_18px_46px_rgba(30,35,32,0.08)]">
        <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-[11px] font-ui text-xs font-[750] uppercase tracking-[0.06em] text-muted">
          <span>mermaid</span>
          {canRenderControls && (
            <DiagramControls
              scale={scale}
              min={0.75}
              max={2.5}
              resetValue={1}
              onScaleChange={setScale}
              onOpen={() => setIsModalOpen(true)}
            />
          )}
        </figcaption>
        <div className="overflow-auto p-5">
          {error ? (
            <pre className="m-0 whitespace-pre-wrap font-mono text-sm text-muted">{chart}</pre>
          ) : svg ? (
            <ScaledSvg svg={svg} scale={scale} minWidth={680} />
          ) : (
            <pre className="m-0 whitespace-pre-wrap font-mono text-sm text-muted">{chart}</pre>
          )}
        </div>
      </figure>

      {typeof document !== "undefined" && isModalOpen && canRenderControls
        ? createPortal(
            <div
              className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label="Expanded Mermaid diagram"
              onMouseDown={() => setIsModalOpen(false)}
            >
              <div
                className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 font-ui text-xs font-[750] text-muted">
                  <span className="uppercase tracking-[0.06em]">Expanded diagram</span>
                  <DiagramControls
                    scale={modalScale}
                    min={0.75}
                    max={3}
                    resetValue={1.25}
                    onScaleChange={setModalScale}
                    onClose={() => setIsModalOpen(false)}
                  />
                </div>
                <div className="flex-1 overflow-auto p-6">
                  <ScaledSvg svg={svg} scale={modalScale} minWidth={920} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

type DiagramControlsProps = {
  scale: number;
  min: number;
  max: number;
  resetValue: number;
  onScaleChange: (updater: (value: number) => number) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

function DiagramControls({
  scale,
  min,
  max,
  resetValue,
  onScaleChange,
  onOpen,
  onClose,
}: DiagramControlsProps) {
  return (
    <span className="flex items-center gap-2 normal-case tracking-normal">
      <button
        className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-bold text-muted transition hover:text-fg"
        type="button"
        onClick={() => onScaleChange((value) => Math.max(min, value - 0.25))}
      >
        −
      </button>
      <span className="min-w-10 text-center text-[11px]">{Math.round(scale * 100)}%</span>
      <button
        className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-bold text-muted transition hover:text-fg"
        type="button"
        onClick={() => onScaleChange((value) => Math.min(max, value + 0.25))}
      >
        +
      </button>
      <button
        className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-bold text-muted transition hover:text-fg"
        type="button"
        onClick={() => onScaleChange(() => resetValue)}
      >
        Reset
      </button>
      {onOpen && (
        <button
          className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-bold text-muted transition hover:text-fg"
          type="button"
          onClick={onOpen}
        >
          Open
        </button>
      )}
      {onClose && (
        <button
          className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-bold text-muted transition hover:text-fg"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      )}
    </span>
  );
}

function ScaledSvg({ svg, scale, minWidth }: { svg: string; scale: number; minWidth: number }) {
  return (
    <div
      className="origin-top-left [&_svg]:h-auto [&_svg]:max-w-none"
      style={{ transform: `scale(${scale})`, width: `${100 / scale}%` }}
    >
      <div style={{ minWidth }} dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
