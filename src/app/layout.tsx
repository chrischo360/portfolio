import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteConfig } from "@/data/site";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <body>
        <a className="skip-link" href="#resume">
          Skip to resume
        </a>
        <Header />
        <main id="top" className="shell">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
