---
slug: checkout-performance
collection: work
eyebrow: Wayfair · Checkout performance
title: Improving checkout performance in a high-traffic purchase flow
summary: A focused performance improvement in a critical checkout path, centered on removing legacy bottlenecks and validating the impact through production metrics.
impact: Cut checkout P75 page latency by 43%.
tags:
  - Checkout
  - Performance
  - Production metrics
---

# Improving checkout performance in a high-traffic purchase flow

A focused performance improvement in a critical checkout path, centered on removing legacy bottlenecks and validating the impact through production metrics.

## History

The checkout experience had accumulated legacy behavior over time, making it harder to reason about which work was still necessary and which work was slowing down the page.

The useful framing was not to ask how to make the codebase cleaner in general, but which unnecessary work affected real users in a high-traffic path.

## Problem

{% callout tone="warning" title="Latency affects trust" %}
Checkout latency directly affects user experience, conversion, and trust. The goal was to improve a high-traffic purchase flow without introducing unnecessary risk.
{% /callout %}

## Key decisions

- Focused on P75 page latency as the user-facing performance signal.
- Audited the checkout path for legacy behavior that no longer needed to run.
- Shipped targeted changes instead of attempting a broad rewrite.
- Verified the result against production performance data.

## Tradeoffs

- Chose low-risk bottleneck removal over a larger architectural rewrite.
- Prioritized measurable user-facing latency instead of internal-only cleanup.
- Kept the scope narrow because checkout is a revenue-critical flow.

## Outcome

{% callout tone="success" title="43% improvement" %}
Checkout P75 page latency improved by 43%.
{% /callout %}

The most important part of the work was restraint. A rewrite would have created more risk than the problem required. A targeted removal let the team improve the customer experience while keeping the blast radius small.

## What I learned

- Performance work is most valuable when tied to a product-critical path.
- Removing unnecessary work can be more effective than adding new abstractions.
- Good performance improvements need both technical investigation and production validation.
