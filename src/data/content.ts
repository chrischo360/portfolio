const currentRoleTitle =
  "Software Engineer, Fintech & Loyalty Rewards at Wayfair";

export const homeContent = {
  hero: {
    heading: "Christopher Cho",
    lead: "I'm a full-stack engineer currently at Wayfair, where I work on checkout, loyalty, and rewards. Lately I've been focused on making high-traffic flows faster and more reliable — and building tools that help the team ship quicker. Mostly working with React, Next.js, TypeScript, Java, and GraphQL.",
  },
  profile: {
    subtitle: currentRoleTitle,
    image: {
      src: "/headshot.jpeg",
      alt: "Headshot of Chris Cho",
    },
  },
  timeline: {
    // TODO: confirm titles and dates. Swap the placeholder logos in public/logos/.
    items: [
      {
        org: "Wayfair",
        period: "2025 — Present",
        role: "Software Engineer — checkout, loyalty & rewards",
        logo: { src: "/logos/wayfair-gem.webp", width: 256, height: 256 },
      },
      {
        org: "Lacuna Mentors",
        period: "2025",
        role: "Co-founder — mentorship marketplace",
        logo: { src: "/logos/lacuna.png", width: 3130, height: 1565 },
      },
      {
        org: "Boston University",
        period: "2020 — 2024",
        role: "B.S. Computer Science",
        logo: { src: "/logos/bu.png", width: 225, height: 225 },
      },
    ],
    tagline:
      "From zero-to-one products to high-traffic systems — I like building things people actually use.",
  },
  resume: {
    heading: {
      title: "Resume",
      description:
        "A systems-minded engineer comfortable moving from product requirements to shipped production software.",
    },
    role: {
      label: "Current role",
      title: currentRoleTitle,
      description:
        "Building checkout, cart, browse, and loyalty acquisition experiences with a focus on measurable performance and reliable production behavior.",
    },
    highlights: [
      "Reduced checkout P75 page latency by 43% while working across high-traffic purchase flows.",
      "Built a GraphQL preloading flow that reduced modal load time from 3.8s to 0.5s.",
      "Shipped production systems across React, Next.js, TypeScript, Java, Spring Boot, GraphQL, SQL, monitoring, and experimentation.",
    ],
    actions: {
      open: "View full resume",
      download: "Download PDF",
    },
  },
  projects: {
    heading: {
      title: "Projects",
      description:
        "Selected work across commerce infrastructure, zero-to-one marketplace building, and AI-assisted developer workflows.",
    },
  },
} as const;

export const blogContent = {
  eyebrow: "Blog",
  heading: "Writing coming soon.",
  lead: "This route is scaffolded but hidden from the main navigation for now.",
} as const;
