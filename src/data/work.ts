export type CaseStudyMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "video";
      src: string;
      title: string;
      caption?: string;
      poster?: string;
    }
  | {
      type: "embed";
      src: string;
      title: string;
      caption?: string;
    };

export type WorkCaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  resumeBullet: string;
  summary: string;
  problem: string;
  context: string;
  role: string;
  approach: string[];
  tradeoffs: string[];
  outcome: string;
  whatILearned: string[];
  details: Array<{
    heading: string;
    body: string[];
  }>;
  heroMedia?: CaseStudyMedia;
  media?: CaseStudyMedia[];
};

export const workCaseStudies: WorkCaseStudy[] = [
  {
    slug: "checkout-performance",
    title: "Improving checkout performance in a high-traffic purchase flow",
    eyebrow: "Wayfair · Checkout performance",
    resumeBullet:
      "Cut checkout P75 page latency by 43% by removing legacy bottlenecks in high-traffic purchase flows.",
    summary:
      "A focused performance improvement in a critical checkout path, centered on removing legacy bottlenecks and validating the impact through production metrics.",
    problem:
      "Checkout latency directly affects user experience, conversion, and trust. The goal was to improve a high-traffic purchase flow without introducing unnecessary risk.",
    context:
      "The checkout experience had accumulated legacy behavior over time, making it harder to reason about which work was still necessary and which work was slowing down the page.",
    role:
      "I investigated the flow, identified legacy bottlenecks, shipped targeted removals, and validated the impact using production latency metrics.",
    approach: [
      "Focused on P75 page latency as the user-facing performance signal.",
      "Audited the checkout path for legacy behavior that no longer needed to run.",
      "Shipped targeted changes instead of attempting a broad rewrite.",
      "Verified the result against production performance data.",
    ],
    tradeoffs: [
      "Chose low-risk bottleneck removal over a larger architectural rewrite.",
      "Prioritized measurable user-facing latency instead of internal-only cleanup.",
      "Kept the scope narrow because checkout is a revenue-critical flow.",
    ],
    outcome: "Checkout P75 page latency improved by 43%.",
    whatILearned: [
      "Performance work is most valuable when tied to a product-critical path.",
      "Removing unnecessary work can be more effective than adding new abstractions.",
      "Good performance improvements need both technical investigation and production validation.",
    ],
    details: [
      {
        heading: "Why this mattered",
        body: [
          "Checkout is one of the places where performance is closest to product quality. Slow pages are not just a technical issue; they create hesitation at the moment a customer is trying to complete a purchase.",
          "The useful framing was not to ask how to make the codebase cleaner in general, but which unnecessary work affected real users in a high-traffic path.",
        ],
      },
      {
        heading: "How I approached it",
        body: [
          "I treated P75 page latency as the primary signal because it represented a meaningful user-facing experience without being dominated by only the slowest edge cases.",
          "From there, I narrowed the investigation to legacy behavior that still ran in the checkout path but no longer contributed enough value to justify its cost.",
        ],
      },
      {
        heading: "The product engineering lesson",
        body: [
          "The most important part of the work was restraint. A rewrite would have created more risk than the problem required. A targeted removal let the team improve the customer experience while keeping the blast radius small.",
        ],
      },
    ],
  },
  {
    slug: "rewards-modal-preloading",
    title: "Reducing rewards modal load time with GraphQL preloading",
    eyebrow: "Wayfair · Rewards checkout",
    resumeBullet:
      "Built a GraphQL preloading flow for a rewards checkout modal, dropping load time from 3.8s to 0.5s.",
    summary:
      "Moved data fetching earlier in the checkout flow so a rewards modal could open quickly when the user needed it.",
    problem:
      "The rewards modal loaded too slowly at the moment of interaction, creating friction in a checkout-adjacent experience.",
    context:
      "The experience depended on data that was only fetched when the modal opened, which made the interaction feel slower than it needed to.",
    role:
      "I implemented a GraphQL preloading flow, adjusted the data-loading path, and measured the before-and-after modal load time.",
    approach: [
      "Identified the modal open as the user-visible delay.",
      "Moved required GraphQL data fetching earlier in the flow.",
      "Preserved the existing product behavior while improving perceived speed.",
      "Measured the load-time improvement after the change.",
    ],
    tradeoffs: [
      "Accepted earlier data fetching to improve the later interaction.",
      "Kept the change focused on loading behavior instead of redesigning the modal.",
      "Balanced performance improvement with checkout flow stability.",
    ],
    outcome: "Modal load time dropped from 3.8 seconds to 0.5 seconds.",
    whatILearned: [
      "Perceived performance often depends on when work happens, not just how much work happens.",
      "Preloading is useful when the next user interaction is predictable.",
      "Small data-loading changes can meaningfully improve product feel.",
    ],
    details: [
      {
        heading: "Why this mattered",
        body: [
          "The modal was part of a checkout-adjacent rewards experience. When the user opened it, the interface needed to feel immediate because they were already in a purchase flow.",
          "The issue was not only the absolute data-fetch time. It was that the fetch happened at the exact moment the user expected the modal to be ready.",
        ],
      },
      {
        heading: "How I approached it",
        body: [
          "I moved the required GraphQL data loading earlier in the flow so the modal could rely on data that was already in progress or available by the time it opened.",
          "The goal was to improve the interaction without changing the product surface more than necessary.",
        ],
      },
      {
        heading: "The product engineering lesson",
        body: [
          "Perceived performance often comes from scheduling work at the right time. If the next user action is predictable, preloading can make a feature feel dramatically better without changing what the feature does.",
        ],
      },
    ],
  },
  {
    slug: "checkout-incident-response",
    title: "Unblocking checkout during a production incident",
    eyebrow: "Wayfair · Production support",
    resumeBullet:
      "Prevented revenue loss on-call with a hotfix that unblocked checkout for all non-US stores.",
    summary:
      "Responded to a production checkout issue affecting non-US stores by isolating the failure path and shipping a focused hotfix.",
    problem:
      "A checkout issue was blocking purchases for non-US stores, creating immediate user and business impact.",
    context:
      "Checkout incidents require fast diagnosis, careful risk assessment, and fixes that minimize additional production risk.",
    role:
      "I diagnosed the issue while on call, identified the affected path, shipped a targeted hotfix, and helped restore checkout behavior.",
    approach: [
      "Confirmed the affected surface and user segment.",
      "Narrowed the issue to the failing checkout behavior.",
      "Prepared a focused hotfix instead of a broad change.",
      "Validated that checkout was unblocked for affected stores.",
    ],
    tradeoffs: [
      "Prioritized restoration of checkout over a larger cleanup.",
      "Kept the fix narrow to reduce risk during an active incident.",
      "Balanced speed with production safety.",
    ],
    outcome:
      "Checkout was unblocked for all non-US stores, preventing further revenue loss.",
    whatILearned: [
      "Incident response is product work when the failure blocks users from completing key actions.",
      "The best hotfix is usually the smallest safe change that restores the user path.",
      "Production ownership requires both technical debugging and clear judgment under pressure.",
    ],
    details: [
      {
        heading: "Why this mattered",
        body: [
          "The issue affected checkout for non-US stores, which made it both a user experience problem and a business-critical production issue.",
          "In that context, the priority was not to produce the most elegant long-term fix first. The priority was to restore the purchase path safely.",
        ],
      },
      {
        heading: "How I approached it",
        body: [
          "I narrowed the affected segment, isolated the failing behavior, and focused the fix on the specific path that was blocking users.",
          "During an incident, reducing uncertainty is part of the work: understand who is affected, what changed, what is safe to ship, and how to validate recovery.",
        ],
      },
      {
        heading: "The product engineering lesson",
        body: [
          "Production support is not separate from product engineering. When a core user path is broken, debugging, risk management, and communication all become part of delivering the product.",
        ],
      },
    ],
  },
  {
    slug: "federated-checkout-graphql",
    title: "Decomposing legacy checkout flows into federated GraphQL services",
    eyebrow: "Wayfair · Checkout architecture",
    resumeBullet:
      "Decomposed legacy checkout flows into federated GraphQL services across purchase surfaces.",
    summary:
      "Helped move legacy checkout behavior into federated GraphQL services so purchase-related surfaces could evolve with clearer boundaries.",
    problem:
      "Legacy checkout flows were difficult to evolve because behavior was spread across older systems and multiple purchase surfaces.",
    context:
      "Checkout-related product surfaces need shared behavior, but tight coupling makes changes slower and riskier.",
    role:
      "I worked on decomposing parts of the legacy flow into federated GraphQL services and supporting reuse across purchase surfaces.",
    approach: [
      "Identified checkout behavior that belonged behind clearer service boundaries.",
      "Moved selected logic into federated GraphQL services.",
      "Supported multiple purchase surfaces through shared service behavior.",
      "Kept the migration incremental to reduce delivery risk.",
    ],
    tradeoffs: [
      "Used incremental decomposition instead of a full rewrite.",
      "Balanced service ownership boundaries with product flow needs.",
      "Preserved existing checkout behavior while moving implementation details behind GraphQL.",
    ],
    outcome:
      "Legacy checkout behavior became easier to reuse and evolve across purchase surfaces.",
    whatILearned: [
      "Good service boundaries come from understanding product flows, not just technical layers.",
      "Incremental migration is often safer than rewriting critical commerce paths.",
      "Architecture work is strongest when it improves product delivery speed.",
    ],
    details: [
      {
        heading: "Why this mattered",
        body: [
          "Legacy checkout behavior becomes expensive when multiple product surfaces need to evolve around it. The cost shows up as slower delivery, more coordination, and higher risk for each change.",
          "The goal was to move behavior toward clearer GraphQL service boundaries without disrupting critical purchase paths.",
        ],
      },
      {
        heading: "How I approached it",
        body: [
          "I worked within an incremental migration path, identifying behavior that could move behind federated GraphQL services while preserving existing checkout behavior.",
          "The important constraint was that architecture improvements had to support product delivery rather than pause it.",
        ],
      },
      {
        heading: "The product engineering lesson",
        body: [
          "Good architecture is grounded in real product flows. A service boundary is useful when it makes the system easier to evolve in the places the product actually changes.",
        ],
      },
    ],
  },
];
