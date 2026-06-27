export const siteConfig = {
  name: "Chris Cho",
  initials: "CC",
  title: "Chris Cho - Software Engineer",
  description:
    "Chris Cho is a product-minded software engineer focused on reliable user-facing systems, frontend performance, checkout experiences, and developer workflows.",
  role: "Product-minded software engineer",
  location: "New York, NY",
  email: "christopher.cho.dev@gmail.com",
  resumeHref: "/resume.pdf",
  blog: {
    enabled: false,
  },
  navigation: [
    { label: "Work", href: "/work", enabled: true },
    { label: "Resume", href: "/#resume", enabled: true },
    { label: "Contact", href: "/#contact", enabled: true },
    { label: "Blog", href: "/blog", enabled: false },
  ],
  links: {
    github: "https://github.com/chrischo360",
    linkedin: "https://linkedin.com/in/chrischo360",
  },
} as const;
