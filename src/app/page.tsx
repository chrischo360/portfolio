export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6 py-16 sm:py-24">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Personal portfolio
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-6xl">
          Portfolio site scaffold.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Resume, projects, and writing will live here.
        </p>
      </section>

      <section id="projects" className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
      </section>

      <section id="resume" className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight">Resume</h2>
      </section>

      <section id="contact" className="border-t border-zinc-200 pt-10 dark:border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
      </section>
    </div>
  );
}
