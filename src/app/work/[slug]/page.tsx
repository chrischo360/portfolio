import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyMedia } from "@/components/CaseStudyMedia";
import { workCaseStudies } from "@/data/work";

type WorkCaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return workCaseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkCaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = workCaseStudies.find((item) => item.slug === slug);

  if (!caseStudy) {
    return {
      title: "Work",
    };
  }

  return {
    title: caseStudy.title,
    description: caseStudy.summary,
  };
}

export default async function WorkCaseStudyPage({
  params,
}: WorkCaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = workCaseStudies.find((item) => item.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <article className="section-pad case-study">
      <Link className="case-link" href="/work">
        ← Back to selected work
      </Link>

      <header className="case-hero">
        <div className="eyebrow">{caseStudy.eyebrow}</div>
        <h1>{caseStudy.title}</h1>
        <p className="lead">{caseStudy.summary}</p>
      </header>

      {caseStudy.heroMedia && <CaseStudyMedia media={caseStudy.heroMedia} />}

      <section className="case-section resume-claim" aria-labelledby="resume-point">
        <span id="resume-point">Resume point</span>
        <p>{caseStudy.resumeBullet}</p>
      </section>

      <div className="case-body">
        <CaseSection title="Problem">
          <p>{caseStudy.problem}</p>
        </CaseSection>

        <CaseSection title="Context">
          <p>{caseStudy.context}</p>
        </CaseSection>

        <CaseSection title="My role">
          <p>{caseStudy.role}</p>
        </CaseSection>

        <CaseSection title="Approach">
          <CaseList items={caseStudy.approach} />
        </CaseSection>

        <CaseSection title="Tradeoffs">
          <CaseList items={caseStudy.tradeoffs} />
        </CaseSection>

        <CaseSection title="Outcome">
          <p>{caseStudy.outcome}</p>
        </CaseSection>

        {caseStudy.details.map((section) => (
          <CaseSection key={section.heading} title={section.heading}>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </CaseSection>
        ))}

        <CaseSection title="What I learned">
          <CaseList items={caseStudy.whatILearned} />
        </CaseSection>
      </div>

      {caseStudy.media?.map((media) => (
        <CaseStudyMedia key={media.src} media={media} />
      ))}
    </article>
  );
}

function CaseSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-section" aria-labelledby={sectionId(title)}>
      <h2 id={sectionId(title)}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function CaseList({ items }: { items: string[] }) {
  return (
    <ul className="case-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function sectionId(title: string) {
  return title.toLowerCase().replaceAll(" ", "-");
}
