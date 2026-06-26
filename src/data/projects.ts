export type FeaturedProject = {
  variant: "featured";
  org: string;
  category: string;
  title: string;
  summary: string;
  built: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  stack: string[];
  href: string;
};

export type CompactProject = {
  variant: "compact";
  org: string;
  category: string;
  title: string;
  summary: string;
  impactValue: string;
  impactCopy: string;
  stack: string[];
};

export type Project = FeaturedProject | CompactProject;

export const projects: Project[] = [
  {
    variant: "featured",
    org: "Wayfair",
    category: "Commerce systems",
    title: "Rewards & Checkout",
    summary:
      "High-traffic commerce systems across checkout, cart, browse, and loyalty acquisition.",
    built:
      "GraphQL preloading flows, A/B-tested acquisition experiences, checkout performance improvements, and production monitoring across critical purchase paths.",
    metrics: [
      { value: "43%", label: "Lower checkout P75 page latency." },
      {
        value: "3.8s → 0.5s",
        label: "Modal load improvement through GraphQL preloading.",
      },
      {
        value: "A/B",
        label: "Experimentation work on loyalty acquisition flows.",
      },
    ],
    stack: ["React", "Next.js", "TypeScript", "Java", "GraphQL", "Datadog"],
    href: "#resume",
  },
  {
    variant: "compact",
    org: "Lacuna Mentors",
    category: "Marketplace",
    title: "Mentorship marketplace",
    summary:
      "Co-founded and built a mentorship marketplace from zero to one, owning the product and engineering path from early requirements to live scheduling workflows.",
    impactValue: "60+ mentors",
    impactCopy:
      "Custom scheduling system saved $900/month while supporting marketplace operations.",
    stack: ["Marketplace", "Scheduling", "0 → 1"],
  },
  {
    variant: "compact",
    org: "Developer Tools",
    category: "AI workflow",
    title: "Agentic Developer Toolchain",
    summary:
      "Built AI-assisted developer tooling for PR generation and CI/CD debugging, focused on turning failing build feedback into concrete repair loops.",
    impactValue: "Fix loops",
    impactCopy:
      "Detected build failures and applied formatting and TypeScript fixes through Claude Code workflows.",
    stack: ["AI tooling", "CI/CD", "TypeScript"],
  },
];
