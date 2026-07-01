export const siteConfig = {
  name: "Chris Cho",
  initials: "CC",
  title: "Chris Cho - Software Engineer",
  description:
    "Chris Cho is a full-stack engineer working on high-traffic checkout and loyalty systems at Wayfair — frontend performance, production reliability, and clearer product systems.",
  role: "Full-Stack Engineer · High-Traffic Checkout & Loyalty Systems",
  location: "New York, NY",
  email: "christopher.cho.dev@gmail.com",
  resumeHref: "/resume.pdf",
  blog: {
    enabled: false,
  },
  navigation: [
    { label: "Work", href: "/#work", enabled: true },
    { label: "Resume", href: "/#resume", enabled: true },
    { label: "About", href: "/#about", enabled: true },
    { label: "Contact", href: "/#contact", enabled: true },
    { label: "Blog", href: "/blog", enabled: false },
  ],
  links: {
    github: "https://github.com/chrischo360",
    linkedin: "https://linkedin.com/in/chrischo360",
  },
} as const;
