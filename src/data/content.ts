const currentRoleTitle =
  "Software Engineer, Fintech & Loyalty Rewards";

export const homeContent = {
  hero: {
    heading: "Hey, I'm Chris!",
    lead: "Read about the projects I’ve worked on, the decisions behind them, and a few things that shape how I think.",
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
        role: "Software Engineer",
        href: "https://www.wayfair.com/wayfair-rewards",
        logo: { src: "/logos/wayfair-gem.webp", width: 256, height: 256 },
      },
      {
        org: "Lacuna Mentors",
        period: "2025",
        role: "Co-founder",
        href: "https://lacuna-six.vercel.app/",
        logo: { src: "/logos/lacuna.png", width: 3130, height: 1565 },
      },
      {
        org: "Boston University",
        period: "2020 — 2024",
        role: "B.S. Computer Science",
        href: null,
        logo: { src: "/logos/bu.png", width: 225, height: 225 },
      },
    ],
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
      "Cut checkout P75 page latency by 43% by removing legacy bottlenecks in high-traffic purchase flows.",
      "Built a GraphQL preloading flow for a rewards checkout modal, dropping load time from 3.8s to 0.5s.",
      "Prevented revenue loss on-call with a hotfix that unblocked checkout for all non-US stores.",
      "Decomposed legacy checkout flows into federated GraphQL services across purchase surfaces.",
    ],
    prompt: {
      heading: "Or don’t.",
      description:
        "If you don’t have time to read allat, open my interactive resume, pick whatever catches your eye, and jump straight to the story behind it.",
    },
    actions: {
      open: "Fine, show me the resume",
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
        link: {
          text: "Poor Charlie's Almanack",
          href: "https://en.wikipedia.org/wiki/Poor_Charlie%27s_Almanack",
        },
      },
      {
        question: "Favorite non-business book?",
        answer:
          "The Inner Game of Tennis. It changed how I think about performance: improvement often comes less from forcing perfection and more from quieting self-judgment, paying attention, and letting learning happen through feedback.",
        link: {
          text: "The Inner Game of Tennis",
          href: "https://www.amazon.com/dp/0679778314?lv=shuf&channelId=500&plpRedirect=mhFallback",
        },
      },
      {
        question: "Advice to your younger self?",
        answer:
          "Be less black-and-white with myself. Not every mistake is a verdict. Growth comes from small steps and feedback, not from getting each decision perfect.",
        hidden: true,
      },
    ],
  },
} as const;

export const blogContent = {
  eyebrow: "Case studies",
  heading: "Deeper write-ups behind selected work.",
  lead: "Config-driven articles that can support styled text, diagrams, images, GIFs, video, embeds, and draft media placeholders.",
} as const;
