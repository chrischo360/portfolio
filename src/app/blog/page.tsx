import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return (
    <section className="section-pad" aria-labelledby="blog-title">
      <div className="eyebrow">Blog</div>
      <h1 id="blog-title">Writing coming soon.</h1>
      <p className="lead">
        This route is scaffolded but hidden from the main navigation for now.
      </p>
    </section>
  );
}
