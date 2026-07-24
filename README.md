# [christopher-cho.dev](https://www.christopher-cho.dev/?utm_source=github)

<img width="1317" height="864" alt="Screenshot 2026-07-24 at 10 36 43 AM" src="https://github.com/user-attachments/assets/f5f849e3-f9ce-4fff-a91a-335c8742500a" />

## Tech stack

- **[Next.js 16](https://nextjs.org)** (App Router) with Turbopack
- **React 19** + **TypeScript**
- **[Tailwind CSS 4](https://tailwindcss.com)** with the typography plugin
- **[Markdoc](https://markdoc.dev)** for config-driven case-study articles
- **[Shiki](https://shiki.style)** for syntax-highlighted code blocks
- **[PostHog](https://posthog.com)** + **[Vercel Analytics](https://vercel.com/analytics)** for product analytics

## Getting started

Install dependencies and run the dev server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Scripts

| Command      | Description                        |
| ------------ | ---------------------------------- |
| `yarn dev`   | Start the development server       |
| `yarn build` | Create a production build          |
| `yarn start` | Serve the production build         |
| `yarn lint`  | Run ESLint                         |
| `yarn resume:sync [file]` | Generate the HTML resume and PDF from LaTeX |

## Project structure

```
resume/                 # Canonical LaTeX resume and class
scripts/                # Content generation scripts
src/
├── app/                # App Router routes, layout, and global styles
│   ├── page.tsx        # Home page
│   ├── work/[slug]/    # Case-study article pages
│   └── blog/           # Blog (currently disabled via site config)
├── components/         # Reusable UI components
├── content/work/       # Markdoc case-study source files
├── data/               # Site config, home content, and generated resume data
└── lib/markdoc/        # Markdoc schema, parsing, and rendering helpers
```

## Content & configuration

Most of the site is data-driven. Update these files to change what's shown:

- `src/data/site.ts` — site metadata, navigation, and external links
- `src/data/content.ts` — home page copy (hero, timeline, resume, about)
- `src/data/projects.ts` — featured and compact project cards
- `src/content/work/*.md` — Markdoc case studies rendered at `/work/[slug]`

## Resume sync

`resume/resume.tex` is the canonical resume source. After editing it, generate the interactive HTML data and public PDF:

```bash
yarn resume:sync
```

To import another resume, pass its path. The source is copied to `resume/resume.tex` only after parsing and PDF compilation succeed:

```bash
yarn resume:sync ~/notes/resumes/resume-product-fullstack.tex
```

The command requires `pdflatex` and updates:

- `resume/resume.tex`
- `src/data/resume.generated.json`
- `public/resume.pdf`

The parser supports the `rSection` and `rSubsection` structure in `resume/resume.cls`. Keep the `Experience`, `Projects`, `Education`, and `Skills` sections.

Associate a bullet with a portfolio article using its slug:

```tex
\item Decoupled CMS preview from checkout creation \relatedwork{rewards-modal-preloading}
```

Use an optional label outside a bullet:

```tex
\relatedwork[How I work]{dev-environment}
```

Related-work links are included only when the matching article does not have `hidden: true` in its frontmatter.

## Analytics

PostHog is reverse-proxied through this domain (see `rewrites` in `next.config.ts`) to reduce ad-blocker loss. Configure the PostHog key via environment variables in `.env.local`.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to the default branch trigger a production build.
