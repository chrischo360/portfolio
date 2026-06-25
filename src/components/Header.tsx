import Link from "next/link";
import { siteConfig } from "@/data/site";

export function Header() {
  const navigation = siteConfig.navigation.filter((item) => item.enabled);

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-300">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-zinc-950 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
