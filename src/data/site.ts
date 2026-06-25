export const siteConfig = {
  name: "Chris",
  title: "Chris — Portfolio",
  description: "Personal portfolio, resume, projects, and writing.",
  blog: {
    enabled: false,
  },
  navigation: [
    { label: "Projects", href: "/#projects", enabled: true },
    { label: "Resume", href: "/#resume", enabled: true },
    { label: "Contact", href: "/#contact", enabled: true },
    { label: "Blog", href: "/blog", enabled: false },
  ],
  links: {
    email: "",
    github: "",
    linkedin: "",
  },
} as const;
