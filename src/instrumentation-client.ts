import posthog from "posthog-js";

const analyticsOptOutKey = "portfolio:analytics-opt-out";
const linkIdPattern = /^[a-zA-Z0-9_-]{3,64}$/;
const portfolioLinkLabels: Record<string, string> = {
  bf0a8a959a54: "LinkedIn profile",
  "004f19de1149": "LinkedIn DM",
  ea84bb9e3c46: "Resume PDF",
  "4522a9d43d7d": "Email signature",
  "273d988bb070": "GitHub profile",
  "2147b7f5dde9": "Personal outreach",
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

function getLinkId(url: URL) {
  const linkId = url.searchParams.get("lid");

  if (!linkId || !linkIdPattern.test(linkId)) {
    return undefined;
  }

  return linkId;
}

function cleanLinkIdFromUrl(url: URL) {
  if (!url.searchParams.has("lid")) {
    return;
  }

  url.searchParams.delete("lid");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function getOptionalSearchParam(url: URL, name: string) {
  return url.searchParams.get(name) || undefined;
}

function getLinkLabel(linkId: string) {
  return portfolioLinkLabels[linkId];
}

const url = new URL(window.location.href);
applyAnalyticsPreference(url);

const linkId = getLinkId(url);
cleanLinkIdFromUrl(url);

const shouldCapture =
  process.env.NODE_ENV === "production" &&
  Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY) &&
  getLocalStorageValue(analyticsOptOutKey) !== "1";

if (shouldCapture) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    capture_pageview: "history_change",
    autocapture: false,
    person_profiles: "identified_only",
    session_recording: {
      maskAllInputs: true,
    },
    defaults: "2025-05-24",
    loaded: (ph) => {
      if (!linkId) {
        return;
      }

      const linkLabel = getLinkLabel(linkId);
      const linkProperties = {
        portfolio_link_id: linkId,
        ...(linkLabel ? { portfolio_link_label: linkLabel } : {}),
      };

      ph.register(linkProperties);

      ph.identify(`portfolio:${linkId}`, linkProperties);

      ph.capture("portfolio_link_opened", {
        ...linkProperties,
        landing_path: `${url.pathname}${url.search}${url.hash}`,
        utm_source: getOptionalSearchParam(url, "utm_source"),
        utm_medium: getOptionalSearchParam(url, "utm_medium"),
        utm_campaign: getOptionalSearchParam(url, "utm_campaign"),
        utm_content: getOptionalSearchParam(url, "utm_content"),
      });
    },
  });
}
