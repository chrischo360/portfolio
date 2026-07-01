import Image from "next/image";

type ArticleMediaProps =
  | {
      type: "image" | "gif";
      status?: "ready" | "planned";
      src?: string;
      alt?: string;
      caption?: string;
    }
  | {
      type: "video" | "embed";
      status?: "ready" | "planned";
      src?: string;
      title?: string;
      caption?: string;
      poster?: string;
    };

export function ArticleMedia(props: ArticleMediaProps) {
  if (props.status === "planned" || !props.src) {
    return (
      <figure className="article-media planned">
        <div className="article-media-placeholder">
          <span>{props.type}</span>
          <strong>{getMediaLabel(props)}</strong>
        </div>
        {props.caption && <figcaption>{props.caption}</figcaption>}
      </figure>
    );
  }

  switch (props.type) {
    case "image":
    case "gif":
      return (
        <figure className="article-media">
          <Image src={props.src} alt={props.alt ?? ""} width={1200} height={720} />
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
      );
    case "video":
      return (
        <figure className="article-media">
          <video controls poster={props.poster}>
            <source src={props.src} />
          </video>
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
      );
    case "embed":
      return (
        <figure className="article-media">
          <iframe src={props.src} title={props.title} />
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
      );
  }
}

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
