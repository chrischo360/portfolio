import Image from "next/image";

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
          {project.image && (
            <Image
              className="project-image"
              src={project.image.src}
              alt={project.image.alt}
              width={640}
              height={360}
            />
          )}
          <h3>{project.title}</h3>
          <div className="case-study-body">
            <div className="case-block">
              <span className="case-label">Description</span>
              <div className="case-copy">{project.summary}</div>
            </div>
            <div className="case-block">
              <span className="case-label">Built</span>
              <div className="case-copy">{project.built}</div>
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
        {project.image && (
          <Image
            className="project-image compact"
            src={project.image.src}
            alt={project.image.alt}
            width={480}
            height={240}
          />
        )}
        <h3>{project.title}</h3>
        <div className="case-study-body compact">
          <div className="case-block compact">
            <span className="case-label">Description</span>
            <div className="case-copy">{project.summary}</div>
          </div>
          <div className="case-block compact">
            <span className="case-label">Built</span>
            <div className="case-copy">{project.built}</div>
          </div>
        </div>
      </div>
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

