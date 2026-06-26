import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
};

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "default",
}: ButtonLinkProps) {
  const className = ["button", variant, size === "large" ? "large" : ""]
    .filter(Boolean)
    .join(" ");

  if (href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}
