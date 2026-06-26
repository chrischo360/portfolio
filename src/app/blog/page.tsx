import type { Metadata } from "next";
import { blogContent } from "@/data/content";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <section className="section-pad" aria-labelledby="blog-title">
      <div className="eyebrow">{blogContent.eyebrow}</div>
      <h1 id="blog-title">{blogContent.heading}</h1>
      <p className="lead">{blogContent.lead}</p>
    </section>
  );
}
