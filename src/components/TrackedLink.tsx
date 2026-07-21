"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import {
  capturePortfolioEvent,
  type PortfolioEvent,
  type PortfolioEventProperties,
} from "@/lib/analytics";

type TrackingProps = {
  eventName: PortfolioEvent;
  eventProperties?: PortfolioEventProperties;
};

type TrackedLinkProps = ComponentProps<typeof Link> & TrackingProps;
type TrackedAnchorProps = ComponentProps<"a"> & TrackingProps;

export function TrackedLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    capturePortfolioEvent(eventName, eventProperties);
    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}

export function TrackedAnchor({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedAnchorProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    capturePortfolioEvent(eventName, eventProperties);
    onClick?.(event);
  };

  return <a {...props} onClick={handleClick} />;
}
