import posthog from "posthog-js";

export type PortfolioEvent =
  | "contact_clicked"
  | "resume_downloaded"
  | "resume_opened"
  | "work_article_clicked";

export type PortfolioEventProperties = Record<
  string,
  string | number | boolean
>;

export function capturePortfolioEvent(
  event: PortfolioEvent,
  properties?: PortfolioEventProperties,
) {
  posthog.capture(event, properties);
}
