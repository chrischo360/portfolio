import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { ResumeModal } from "@/components/ResumeModal";
import { SectionHeading } from "@/components/SectionHeading";
import { homeContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { workCaseStudies } from "@/data/work";

export default function Home() {
  const resumeActionHref = siteConfig.resumeHref;
  const resumeActionLabel = homeContent.resume.actions.open;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <h1 id="hero-title">{homeContent.hero.heading}</h1>
          <p className="lead">{homeContent.hero.lead}</p>
          <div className="cta-row" aria-label="Primary actions">
            <ButtonLink variant="primary" size="large" href="/work">
              Read selected work <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink variant="secondary" size="large" href="#resume">
              View Resume
            </ButtonLink>
          </div>
        </div>
        <aside className="resume-card" aria-label="Chris profile summary">
          <div className="profile-row">
            <Image
              className="headshot"
              src={homeContent.profile.image.src}
              alt={homeContent.profile.image.alt}
              width={82}
              height={82}
              priority
            />
            <div>
              <h2>{siteConfig.name}</h2>
              <p>{homeContent.profile.subtitle}</p>
            </div>
          </div>
          <ol className="timeline">
            {homeContent.timeline.items.map((item) => (
              <li className="timeline-item" key={item.org}>
                <Image
                  className="timeline-logo"
                  src={item.logo.src}
                  alt={`${item.org} logo`}
                  width={item.logo.width}
                  height={item.logo.height}
                  unoptimized
                />
                <span className="timeline-detail">
                  <strong>{item.org}</strong>
                  <span className="timeline-role">{item.role}</span>
                  <span className="timeline-period">{item.period}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="snapshot-note">{homeContent.timeline.tagline}</div>
        </aside>
      </section>

      <section id="resume" className="section-pad" aria-labelledby="resume-title">
        <SectionHeading
          id="resume-title"
          title={homeContent.resume.heading.title}
        />
        <div className="resume-panel">
          <aside className="role-card">
            <div>
              <div className="label">{homeContent.resume.role.label}</div>
              <h3>{homeContent.resume.role.title}</h3>
              <p>{homeContent.resume.role.description}</p>
            </div>
            <ResumeModal href={resumeActionHref} label={resumeActionLabel} />
          </aside>
          <div className="resume-detail">
            <div className="resume-items">
              {homeContent.resume.highlights.map((highlight, index) => (
                <div className="resume-item" key={highlight}>
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section-pad" aria-labelledby="work-title">
        <SectionHeading id="work-title" title="Selected work">
          Write-ups behind selected resume points: the problem, approach,
          tradeoffs, and outcome behind each claim.
        </SectionHeading>
        <div className="work-grid">
          {workCaseStudies.map((caseStudy) => (
            <article className="work-card" key={caseStudy.slug}>
              <div>
                <p className="work-card-eyebrow">{caseStudy.eyebrow}</p>
                <h3>{caseStudy.title}</h3>
                <p>{caseStudy.summary}</p>
              </div>
              <div className="resume-claim">
                <span>Resume point</span>
                <p>{caseStudy.resumeBullet}</p>
              </div>
              <ButtonLink href={`/work/${caseStudy.slug}`}>
                Read write-up <span aria-hidden="true">→</span>
              </ButtonLink>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact-card">
          <h2 id="contact-title" className="contact-label">
            Contact
          </h2>
          <div className="contact-links" aria-label="Contact links">
            <a
              className="contact-action primary"
              href={`mailto:${siteConfig.email}`}
            >
              Email
            </a>
            <a
              className="contact-action"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="contact-action"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
