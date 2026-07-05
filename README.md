# [christopher-cho.dev](https://www.christopher-cho.dev/)

<img width="1240" height="632" alt="Screenshot 2026-07-05 at 5 14 25 PM" src="https://github.com/user-attachments/assets/bce663b2-6729-4d54-a38e-64b214ff170a" />
<img width="1251" height="936" alt="Screenshot 2026-07-05 at 5 13 17 PM" src="https://github.com/user-attachments/assets/3effb7cc-a0ec-4261-ab71-1242591d34b4" />


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

## Project structure

```
src/
├── app/                # App Router routes, layout, and global styles
│   ├── page.tsx        # Home page
│   ├── work/[slug]/    # Case-study article pages
│   └── blog/           # Blog (currently disabled via site config)
├── components/         # Reusable UI components
├── content/work/       # Markdoc case-study source files
├── data/               # Site config, home content, and project data
└── lib/markdoc/        # Markdoc schema, parsing, and rendering helpers
```

## Content & configuration

Most of the site is data-driven. Update these files to change what's shown:

- `src/data/site.ts` — site metadata, navigation, and external links
- `src/data/content.ts` — home page copy (hero, timeline, resume, about)
- `src/data/projects.ts` — featured and compact project cards
- `src/content/work/*.md` — Markdoc case studies rendered at `/work/[slug]`

## Analytics

PostHog is reverse-proxied through this domain (see `rewrites` in `next.config.ts`) to reduce ad-blocker loss. Configure the PostHog key via environment variables in `.env.local`.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to the default branch trigger a production build.
