import posthog from "posthog-js";

export type PortfolioEvent =
  | "article_read_time_30s"
  | "article_scroll_50"
  | "article_scroll_90"
  | "case_study_cta_clicked"
  | "contact_cta_clicked"
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
