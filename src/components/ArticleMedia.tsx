import Image from "next/image";
import { ArticleEmbed } from "@/components/ArticleEmbed";

type ArticleMediaProps =
  | {
      type: "image" | "gif";
      status?: "ready" | "planned";
      src?: string;
      alt?: string;
      caption?: string;
    }
  | {
      type: "video";
      status?: "ready" | "planned";
      src?: string;
      title?: string;
      caption?: string;
      poster?: string;
    }
  | {
      type: "embed";
      status?: "ready" | "planned";
      src?: string;
      title?: string;
      caption?: string;
      expandable?: boolean;
      openLabel?: string;
      description?: string;
    };

export function ArticleMedia(props: ArticleMediaProps) {
  if (props.status === "planned" || !props.src) {
    return (
      <figure className="my-[38px] w-full">
        <div className="grid min-h-[260px] place-content-center gap-[10px] rounded-card border border-border bg-[linear-gradient(135deg,var(--surface),var(--surface-2))] p-7 text-center">
          <span className="font-ui text-xs font-[750] uppercase tracking-[0.08em] text-accent-ink">
            {props.type}
          </span>
          <strong className="font-heading text-[28px] font-medium tracking-[-0.03em]">
            {getMediaLabel(props)}
          </strong>
        </div>
        {props.caption && <figcaption className={captionClass}>{props.caption}</figcaption>}
      </figure>
    );
  }

  switch (props.type) {
    case "image":
    case "gif":
      return (
        <figure className="my-[38px] w-full">
          <Image
            className="block h-auto w-full rounded-card border border-border bg-surface"
            src={props.src}
            alt={props.alt ?? ""}
            width={1200}
            height={720}
          />
          {props.caption && <figcaption className={captionClass}>{props.caption}</figcaption>}
        </figure>
      );
    case "video":
      return (
        <figure className="my-[38px] w-full">
          <video
            className="block h-auto w-full rounded-card border border-border bg-surface"
            controls
            playsInline
            preload="metadata"
            poster={props.poster}
          >
            <source src={props.src} type="video/mp4" />
          </video>
          {props.caption && <figcaption className={captionClass}>{props.caption}</figcaption>}
        </figure>
      );
    case "embed":
      return (
        <figure className="my-[38px] w-full">
          {props.expandable ? (
            <ArticleEmbed
              src={props.src}
              title={props.title ?? "Interactive demo"}
              openLabel={props.openLabel}
              description={props.description}
            />
          ) : (
            <iframe
              className="aspect-[16/9] w-full rounded-card border-0 bg-surface"
              src={props.src}
              title={props.title}
            />
          )}
          {props.caption && <figcaption className={captionClass}>{props.caption}</figcaption>}
        </figure>
      );
  }
}

const captionClass = "mt-[10px] font-ui text-[13px] text-muted";

function getMediaLabel(props: ArticleMediaProps) {
  switch (props.type) {
    case "video":
    case "embed":
      return props.title ?? "Planned media";
    case "image":
    case "gif":
      return props.alt ?? "Planned media";
  }
}
