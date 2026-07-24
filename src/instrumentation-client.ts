import posthog from "posthog-js";

const analyticsOptOutKey = "portfolio:analytics-opt-out";
const portfolioLinkLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  resume: "Resume",
  email: "Email",
};

function getLocalStorageValue(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setAnalyticsPreference(value: "on" | "off") {
  try {
    if (value === "off") {
      window.localStorage.setItem(analyticsOptOutKey, "1");
      return;
    }

    window.localStorage.removeItem(analyticsOptOutKey);
  } catch {}
}

function applyAnalyticsPreference(url: URL) {
  const preference = url.searchParams.get("analytics");

  if (preference !== "on" && preference !== "off") {
    return;
  }

  setAnalyticsPreference(preference);
  url.searchParams.delete("analytics");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function getAndCleanUtmSource(url: URL) {
  const source = url.searchParams.get("utm_source") || undefined;

  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((p) =>
    url.searchParams.delete(p),
  );

  if (source) {
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return source;
}

function getLinkLabel(source: string) {
  return portfolioLinkLabels[source];
}

const url = new URL(window.location.href);
applyAnalyticsPreference(url);

const utmSource = getAndCleanUtmSource(url);

const isProductionHost = window.location.hostname === "www.christopher-cho.dev";
const analyticsEnvironment = isProductionHost ? "production" : "development";
const isAnalyticsDebug =
  !isProductionHost && process.env.NEXT_PUBLIC_POSTHOG_DEBUG === "true";

const shouldCapture =
  (isProductionHost || isAnalyticsDebug) &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) &&
  getLocalStorageValue(analyticsOptOutKey) !== "1";

if (shouldCapture) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: "history_change",
    autocapture: {
      dom_event_allowlist: ["click"],
      element_allowlist: ["a", "button"],
    },
    person_profiles: "identified_only",
    before_send: (event) => ({
      ...event,
      properties: {
        ...event.properties,
        analytics_environment: analyticsEnvironment,
      },
    }),
    disable_session_recording: isAnalyticsDebug,
    capture_dead_clicks: isAnalyticsDebug ? false : undefined,
    session_recording: {
      maskAllInputs: true,
    },
    defaults: "2025-05-24",
    loaded: (ph) => {
      ph.register({ analytics_environment: analyticsEnvironment });

      if (!utmSource) {
        return;
      }

      const linkLabel = getLinkLabel(utmSource);
      const linkProperties = {
        utm_source: utmSource,
        ...(linkLabel ? { portfolio_link_label: linkLabel } : {}),
      };

      ph.register_for_session(linkProperties);

      ph.capture("portfolio_link_opened", {
        ...linkProperties,
        landing_path: `${url.pathname}${url.search}${url.hash}`,
      });
    },
  });
}
