import { resumeData, type RelatedWork, type ResumeEntry } from "@/data/resume";

export type ResumeArticle = {
  slug: string;
  title: string;
  summary: string;
  href: string;
};

function RelatedWorkLink({
  work,
  articles,
}: {
  work: RelatedWork;
  articles: ResumeArticle[];
}) {
  const article = articles.find(({ slug }) => slug === work.slug);

  if (!article) return null;

  const tooltipId = `resume-related-${work.slug}`;

  return (
    <span className="resume-related">
      <a
        className="resume-related-link"
        href={article.href}
        aria-label={`${work.label ?? "Related work"}: ${article.title}`}
        aria-describedby={tooltipId}
      >
        {work.label ?? "Related work"} <span aria-hidden="true">↗</span>
      </a>
      <span className="resume-related-preview" id={tooltipId} role="tooltip">
        <span className="resume-related-eyebrow">
          {work.label ?? "Related work"}
        </span>
        <strong>{article.title}</strong>
        <span>{article.summary}</span>
        <span className="resume-related-cta">Read case study →</span>
      </span>
    </span>
  );
}

function ResumeEntryBlock({
  entry,
  articles,
}: {
  entry: ResumeEntry;
  articles: ResumeArticle[];
}) {
  return (
    <div className="resume-entry">
      <div className="resume-entry-line">
        <strong>{entry.organization}</strong>
        {entry.location && <span>{entry.location}</span>}
      </div>
      <div className="resume-entry-line resume-entry-meta">
        {entry.roleHref ? (
          <a href={entry.roleHref} target="_blank" rel="noreferrer">
            {entry.role}
          </a>
        ) : (
          <span>{entry.role}</span>
        )}
        {entry.period && <span>{entry.period}</span>}
      </div>
      <ul className="resume-bullets">
        {entry.bullets.map((bullet) => (
          <li key={bullet.text}>
            {bullet.text}
            {bullet.relatedWork && (
              <>
                {" "}
                <RelatedWorkLink
                  work={bullet.relatedWork}
                  articles={articles}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="resume-document-section">
      <h2>{title}</h2>
      <div className="resume-section-body">{children}</div>
    </section>
  );
}

export function ResumeDocument({ articles }: { articles: ResumeArticle[] }) {
  return (
    <div className="resume-document-scroll">
      <article className="resume-sheet" aria-label="Christopher Cho resume">
        <header className="resume-document-header">
          <h1>{resumeData.name}</h1>
          <div className="resume-contact">
            {resumeData.contact.map((item, index) => (
              <span key={item.label}>
                {index > 0 && <span aria-hidden="true"> | </span>}
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </span>
            ))}
          </div>
        </header>

        <ResumeSection title="Experience">
          {resumeData.experience.map((entry) => (
            <ResumeEntryBlock
              key={entry.organization}
              entry={entry}
              articles={articles}
            />
          ))}
        </ResumeSection>

        <ResumeSection title="Projects">
          {resumeData.projects.map((entry) => (
            <ResumeEntryBlock
              key={entry.organization}
              entry={entry}
              articles={articles}
            />
          ))}
        </ResumeSection>

        <ResumeSection title="Education">
          <div className="resume-education">
            <strong>{resumeData.education.school}</strong>
            <em>{resumeData.education.degree}</em>
            <span>Honors: {resumeData.education.honors}</span>
          </div>
        </ResumeSection>

        <ResumeSection title="Skills">
          <dl className="resume-skills">
            {resumeData.skills.map((skill) => (
              <div key={skill.label}>
                <dt>{skill.label}:</dt>
                <dd>{skill.value}</dd>
              </div>
            ))}
          </dl>
          {resumeData.howIWork && (
            <div className="resume-how-i-work">
              <RelatedWorkLink
                work={resumeData.howIWork}
                articles={articles}
              />
            </div>
          )}
        </ResumeSection>
      </article>
    </div>
  );
}
