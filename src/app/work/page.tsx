import type { Metadata } from "next";
import Link from "next/link";
import { workCaseStudies } from "@/data/work";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Short case studies behind selected resume points from Chris Cho.",
};

export default function WorkPage() {
  return (
    <section className="section-pad work-index" aria-labelledby="work-title">
      <div className="eyebrow">Selected work</div>
      <h1 id="work-title">Write-ups behind selected resume points.</h1>
      <p className="lead">
        A few examples of how I approach product engineering work: understanding
        the problem, making tradeoffs, shipping changes, and measuring impact.
      </p>

      <div className="work-list">
        {workCaseStudies.map((caseStudy) => (
          <article className="work-card" key={caseStudy.slug}>
            <div>
              <p className="work-card-eyebrow">{caseStudy.eyebrow}</p>
              <h2>{caseStudy.title}</h2>
              <p>{caseStudy.summary}</p>
            </div>
            <div className="resume-claim">
              <span>Resume point</span>
              <p>{caseStudy.resumeBullet}</p>
            </div>
            <Link className="case-link" href={`/work/${caseStudy.slug}`}>
              Read write-up <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
