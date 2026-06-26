export const siteConfig = {
  name: "Chris Cho",
  initials: "CC",
  title: "Chris Cho - Software Engineer",
  description:
    "Chris Cho is a full-stack software engineer building reliable software, tools, and systems across checkout, loyalty, developer tooling, and production infrastructure.",
  role: "Full-stack software engineer",
  location: "New York, NY",
  email: "christopher.cho.dev@gmail.com",
  resumeHref: "/resume.pdf",
  blog: {
    enabled: false,
  },
  navigation: [
    { label: "Resume", href: "/#resume", enabled: true },
    { label: "Projects", href: "/#projects", enabled: false },
    { label: "Contact", href: "/#contact", enabled: true },
    { label: "Blog", href: "/blog", enabled: false },
  ],
  links: {
    github: "https://github.com/chrischo360",
    linkedin: "https://linkedin.com/in/chrischo360",
  },
} as const;
