import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  if (project.variant === "featured") {
    return (
      <article className="project-card featured">
        <div>
          <ProjectMeta org={project.org} category={project.category} />
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="case-study-body">
            <div className="case-block">
              <span className="case-label">Built</span>
              <div className="case-copy">{project.built}</div>
            </div>
            <div className="case-block">
              <span className="case-label">Impact</span>
              <div className="impact-list">
                {project.metrics.map((metric) => (
                  <div className="case-metric" key={metric.value}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="case-block">
              <span className="case-label">Stack</span>
              <ChipList items={project.stack} />
            </div>
          </div>
        </div>
        <div className="project-actions">
          <a className="case-link" href={project.href}>
            View related experience <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="project-card">
      <div>
        <ProjectMeta org={project.org} category={project.category} />
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <div className="compact-impact">
          <span>Impact</span>
          <strong>{project.impactValue}</strong>
          <p>{project.impactCopy}</p>
        </div>
      </div>
      <ChipList items={project.stack} />
    </article>
  );
}

function ProjectMeta({ org, category }: { org: string; category: string }) {
  return (
    <div className="project-meta">
      <span>{org}</span>
      <span>{category}</span>
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="chips">
      {items.map((item) => (
        <span className="chip" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}
