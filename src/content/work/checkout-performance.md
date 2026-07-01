---
slug: checkout-performance
collection: work
eyebrow: Wayfair · Checkout performance
title: Cutting Checkout Latency 43% by Deleting Code, Not Adding It
summary: A checkout page had quietly gotten slower every month for a year. I traced the regression to accumulated feature flags, then removed them in measured phases to cut P75 latency 43% without a risky rewrite.
impact: Cut checkout P75 page latency by 43% with a phased, measured cleanup — no rewrite, small blast radius on a revenue-critical flow.
hero:
  src: /work/checkout-performance/checkout_latency_timeline.svg
  alt: Checkout latency climbing over a year, then dropping after the fix
tags:
  - Performance
  - Checkout
  - Observability
  - Feature flags
  - Production metrics
---

# Cutting Checkout Latency 43% by Deleting Code, Not Adding It

A checkout page had quietly gotten slower every month for a year. I found the cause — leftover feature flags — and removed them in careful phases to cut P75 latency by 43%, without rewriting anything.

## The short version

Another team noticed that checkout was getting slower. Not from any single change — it had crept up steadily over about nine months. My team owned a lot of the loyalty features on that page, so the investigation landed with me.

- the slowdown was gradual, so there was no obvious "bad commit" to revert
- checkout is revenue-critical, so a big rewrite was too risky
- I needed to prove the cause with data, not guesses
- and prove the fix worked without introducing new risk

{% callout title="Helpful references" %}
- [Feature flags / feature toggles](https://martinfowler.com/articles/feature-toggles.html)
- [Percentile latency (P75/P95)](https://en.wikipedia.org/wiki/Percentile)
- [Distributed tracing](https://opentelemetry.io/docs/concepts/observability-primer/#distributed-traces)
- [First Contentful Paint](https://web.dev/articles/fcp)
{% /callout %}

## Why this existed

Checkout latency is not a vanity metric. It directly affects conversion and trust: a slower purchase page means more abandoned carts and less revenue. A steady year-long climb meant the page was getting worse for real customers every month.

{% callout title="The goal" %}
Find why checkout had regressed, fix it, and do it in a way that was measurable and low-risk — because the blast radius of a checkout mistake is real money.
{% /callout %}

## The problem: a slow leak, not a burst pipe

Sudden regressions are easy — you find the commit and revert. This was the opposite: a slow leak where dozens of small, individually reasonable changes added up.

My team had shipped several loyalty features onto checkout over the year (an enrollment modal, an enrollment banner, an auto-pop flow). Each one shipped behind a feature flag — a runtime switch that lets you turn a feature on or off without deploying. The catch: nobody removed the flags after they stopped being useful.

- flags for A/B tests that had long since concluded
- flags gating features that were now live for 100% of users
- flags that could be replaced with a simple code check
- every one of them still called the flag service on every checkout load

Reading the traces (a timeline of where the server spends its time on a request), the flag-evaluation service was eating roughly a third of the server-side time on the checkout controller. That was the leak.

## Before vs. after

The fix was not to make the flag service faster. It was to stop asking it so many pointless questions.

```text
// Before: every load re-checks stale flags
checkout request
  → evaluate flag: old A/B test (already concluded)
  → evaluate flag: feature at 100% rollout
  → evaluate flag: could be a constant
  → ...dozens more...
  → flag service ≈ a third of server-side time
```

```text
// After: only flags that still earn their place
checkout request
  → concluded tests: removed
  → fully-rolled-out features: inlined
  → kill switches: kept (they still matter)
  → flag service time cut sharply
P75 latency down 43%
```

![Server-side time breakdown before and after removing stale flags](/work/checkout-performance/checkout_latency_breakdown.svg)

```md
Key shift:
Concluded A/B tests → deleted
Fully-launched features → replaced flag with plain code
Real kill switches → kept intentionally
```

## The architecture: audit, categorize, phase

The work was less about clever code and more about disciplined judgment: which flags are safe to remove, and how do I prove each step helped?

- **Categorize every flag:** I audited each loyalty-related flag and sorted it — safe to delete (concluded tests), safe to inline (fully rolled out), or keep (genuine kill switches we'd want in an emergency).
- **Ship in measured phases:** three phased PRs instead of one big change, each covering one feature's flags. Smaller changes are easier to validate and safer to roll back.
- **Measure against a matched window:** after each deploy I compared latency to the same window from the prior week, not just "before vs. after the deploy," to control for normal traffic variance.

{% callout title="Key idea" %}
The most effective performance work here was deletion. Removing unnecessary work beat adding new abstractions, and it kept the blast radius tiny on a revenue-critical page.
{% /callout %}

## Safety rails / production behavior

Because this was checkout, "faster" could never mean "riskier."

- **Kept kill switches:** flags that still served as emergency off-switches stayed, on purpose.
- **Phased rollout:** three separate PRs so any regression had a small, obvious source.
- **Matched-window measurement:** validated each phase against the prior week to avoid false wins from traffic noise.
- **Observability:** tracked P75/P95 latency and mobile First Contentful Paint in dashboards after every deploy.

## Evidence I'd show

- **Latency dashboard:** the year-long climb, then the step-downs after each phase, on P75/P95.
- **Trace comparison:** the flag service's share of server-side time before and after.
- **Investigation write-up:** methodology, data tables, and the phased plan — which became a team practice.

## What this demonstrates

- I can diagnose a gradual regression with tracing and production data, not guesswork.
- I know when deleting code beats adding it.
- I de-risk changes to revenue-critical paths by phasing and measuring.
- I turn a one-off fix into a repeatable team practice.
