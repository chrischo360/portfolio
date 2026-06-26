import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="shell footer">
      <span>
        © {new Date().getFullYear()} {siteConfig.name}
      </span>
      <span>
        {siteConfig.email} · {siteConfig.location}
      </span>
    </footer>
  );
}
