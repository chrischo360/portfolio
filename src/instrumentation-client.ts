import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  // Reverse proxy: requests go through this domain (see next.config.ts rewrites).
  api_host: "/ingest",
  // Used for links to the PostHog app (e.g. in the toolbar).
  ui_host: "https://us.posthog.com",
  // Capture pageviews on history changes for App Router client navigation.
  capture_pageview: "history_change",
  defaults: "2025-05-24",
});
