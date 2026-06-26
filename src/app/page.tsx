import { ButtonLink } from "@/components/ButtonLink";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";

const snapshotItems = [
  { value: "43%", label: "Checkout P75 latency reduction" },
  { value: "3.8s → 0.5s", label: "GraphQL preloading modal improvement" },
  { value: "60+", label: "Mentors onboarded at Lacuna Mentors" },
];

const resumeHighlights = [
  "Reduced checkout P75 page latency by 43% while working across high-traffic purchase flows.",
  "Built a GraphQL preloading flow that reduced modal load time from 3.8s to 0.5s.",
  "Shipped production systems across React, Next.js, TypeScript, Java, Spring Boot, GraphQL, SQL, monitoring, and experimentation.",
];

export default function Home() {
  const resumeActionHref = siteConfig.resumeHref || `mailto:${siteConfig.email}`;
  const resumeActionLabel = siteConfig.resumeHref
    ? "Download full resume"
    : "Request full resume";

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div>
          <div className="eyebrow">{siteConfig.role}</div>
          <h1 id="hero-title">I build reliable software, tools, and systems.</h1>
          <p className="lead">
            Chris is a full-stack software engineer focused on product-minded
            systems, performance, developer tools, and clean user experiences.
            He currently builds checkout, loyalty, and rewards acquisition
            experiences at Wayfair, with experience shipping across React,
            Next.js, TypeScript, Java, GraphQL, and production infrastructure.
          </p>
          <div className="cta-row" aria-label="Primary actions">
            <ButtonLink variant="primary" size="large" href="#resume">
              View Resume <span aria-hidden="true">→</span>
            </ButtonLink>
            <ButtonLink variant="secondary" size="large" href="#projects">
              View Projects
            </ButtonLink>
          </div>
        </div>
        <aside className="resume-card" aria-label="Chris profile summary">
          <div className="profile-row">
            <div className="headshot" aria-hidden="true">
              {siteConfig.initials}
            </div>
            <div>
              <h2>{siteConfig.name}</h2>
              <p>Software Engineer, Fintech & Loyalty Rewards at Wayfair</p>
            </div>
          </div>
          <div className="snapshot-list">
            {snapshotItems.map((item) => (
              <div className="snapshot-item" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="snapshot-note">
            Product engineering, performance work, zero-to-one building, and
            developer tooling.
          </div>
        </aside>
      </section>

      <section id="resume" className="section-pad" aria-labelledby="resume-title">
        <SectionHeading id="resume-title" title="Resume preview">
          A systems-minded engineer comfortable moving from product requirements
          to shipped production software.
        </SectionHeading>
        <div className="resume-panel">
          <aside className="role-card">
            <div>
              <div className="label">Current role</div>
              <h3>Software Engineer, Fintech & Loyalty Rewards at Wayfair</h3>
              <p>
                Building checkout, cart, browse, and loyalty acquisition
                experiences with a focus on measurable performance and reliable
                production behavior.
              </p>
            </div>
            <ButtonLink variant="secondary" href={resumeActionHref}>
              {resumeActionLabel}
            </ButtonLink>
          </aside>
          <div className="resume-detail">
            <div className="resume-items">
              {resumeHighlights.map((highlight, index) => (
                <div className="resume-item" key={highlight}>
                  <span className="num">{String(index + 1).padStart(2, "0")}</span>
                  <p>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="section-pad"
        aria-labelledby="projects-title"
      >
        <SectionHeading id="projects-title" title="Featured projects">
          Selected work across commerce infrastructure, zero-to-one marketplace
          building, and AI-assisted developer workflows.
        </SectionHeading>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
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
