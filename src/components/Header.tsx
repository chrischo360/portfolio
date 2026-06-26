import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Header() {
  const navigation = siteConfig.navigation.filter((item) => item.enabled);

  return (
    <header className="site-header">
      <div className="shell nav">
        <nav className="nav-links" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
