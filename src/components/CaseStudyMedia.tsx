import Image from "next/image";
import type { CaseStudyMedia as CaseStudyMediaType } from "@/data/work";

type CaseStudyMediaProps = {
  media: CaseStudyMediaType;
};

export function CaseStudyMedia({ media }: CaseStudyMediaProps) {
  if (media.type === "image") {
    return (
      <figure className="case-media">
        <Image src={media.src} alt={media.alt} width={1200} height={700} />
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>
    );
  }

  if (media.type === "video") {
    return (
      <figure className="case-media">
        <video controls poster={media.poster}>
          <source src={media.src} />
        </video>
        {media.caption && <figcaption>{media.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="case-media">
      <iframe src={media.src} title={media.title} />
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}
