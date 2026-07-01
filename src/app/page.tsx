import Image from "next/image";
import Link from "next/link";
import { ResumeModal } from "@/components/ResumeModal";
import { SectionHeading } from "@/components/SectionHeading";
import { homeContent } from "@/data/content";
import { siteConfig } from "@/data/site";
import { getArticles } from "@/lib/markdoc/articles";

export default function Home() {
  const resumeActionHref = siteConfig.resumeHref;
  const resumeActionLabel = homeContent.resume.actions.open;
  const workArticles = getArticles("work");

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <p className="eyebrow">{homeContent.hero.kicker}</p>
          <h1 id="hero-title">{homeContent.hero.heading}</h1>
          <p className="lead">{homeContent.hero.lead}</p>
          <div className="cta-row" aria-label="Primary actions">
            <Link className="text-link" href="#work">
              Read selected work <span aria-hidden="true">→</span>
            </Link>
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
        <ul className="work-list">
          {workArticles.map((article) => (
            <li key={article.slug}>
              <Link className="work-item" href={article.href}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="work-item-cta">
                  Read story <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className="section-pad" aria-labelledby="about-title">
        <SectionHeading id="about-title" title={homeContent.about.heading.title} />
        <ul className="about-list">
          {homeContent.about.items.map((item) => (
            <li className="about-item" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-title">
        <div className="contact-card">
          <h2 id="contact-title" className="contact-label">
            Contact
          </h2>
          <div className="contact-links" aria-label="Contact links">
            <a className="contact-pill" href={`mailto:${siteConfig.email}`}>
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              Email
            </a>
            <a
              className="contact-pill"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.4 8.05h4.15V24H.4V8.05Zm7.2 0h3.98v2.18h.06c.55-1.05 1.9-2.16 3.9-2.16 4.17 0 4.94 2.74 4.94 6.31V24h-4.14v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.81-2.68 3.68V24H7.6V8.05Z" />
              </svg>
              LinkedIn
            </a>
            <a
              className="contact-pill"
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
