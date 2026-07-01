const currentRoleTitle =
  "Software Engineer, Fintech & Loyalty Rewards at Wayfair";

export const homeContent = {
  hero: {
    kicker: "Full-Stack Engineer · High-Traffic Checkout & Loyalty Systems",
    heading: "Product-minded software engineer focused on reliable user-facing systems.",
    lead: "I'm currently at Wayfair working on checkout, loyalty, and rewards. I like problems where technical quality directly affects user experience, business outcomes, and team velocity — especially performance, production reliability, and clearer product systems.",
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
      title: "Resume points",
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
      "Cut checkout P75 page latency by 43% by removing legacy bottlenecks in high-traffic purchase flows.",
      "Built a GraphQL preloading flow for a rewards checkout modal, dropping load time from 3.8s to 0.5s.",
      "Prevented revenue loss on-call with a hotfix that unblocked checkout for all non-US stores.",
      "Decomposed legacy checkout flows into federated GraphQL services across purchase surfaces.",
    ],
    actions: {
      open: "View full resume",
      download: "Download PDF",
    },
  },
  projects: {
    enabled: false,
    heading: {
      title: "Projects",
      description:
        "Write-ups behind selected resume points, focused on the problem, tradeoffs, outcome, and what I learned.",
    },
  },
  about: {
    heading: {
      title: "A few things about me",
    },
    items: [
      {
        question: "Most useful business-related book you've read?",
        answer:
          "Poor Charlie's Almanack. It changed how I think about problems: instead of judging behavior as simply good or bad, I look for the incentives, constraints, and feedback loops shaping the outcome — especially in product and team decisions.",
      },
      {
        question: "Favorite non-business book?",
        answer:
          "The Inner Game of Tennis. It changed how I think about performance: improvement often comes less from forcing perfection and more from quieting self-judgment, paying attention, and letting learning happen through feedback.",
      },
      {
        question: "Advice to your younger self?",
        answer:
          "Be less black-and-white with myself. Not every mistake is a verdict. Growth comes from small steps and feedback, not from getting each decision perfect.",
      },
    ],
  },
} as const;

export const blogContent = {
  eyebrow: "Case studies",
  heading: "Deeper write-ups behind selected work.",
  lead: "Config-driven articles that can support styled text, diagrams, images, GIFs, video, embeds, and draft media placeholders.",
} as const;
