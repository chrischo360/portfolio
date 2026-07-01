---
slug: sale-rate-limit-incident
collection: work
eyebrow: Wayfair · Production incident
title: Keeping a Sale's Signature Feature Alive Under Load
summary: I launched savings badges on product cards, then watched them fail hours into a big members-only sale. The cause was too many redundant API calls; the fix was to reuse data the page already had. Badges were back within ~18 hours.
impact: Restored a live sale's signature feature within ~18 hours by removing redundant per-card API calls — a root-cause fix, not a band-aid.
hero:
  src: /work/sale-rate-limit-incident/rate_limit_dataflow.svg
  alt: Redundant per-card price calls versus reusing existing pricing data
tags:
  - Incident response
  - Performance
  - React
  - Production safety
  - GraphQL
---

# Keeping a Sale's Signature Feature Alive Under Load

I shipped savings badges for a members-only sale, then watched them stop rendering under real traffic. The bug was thousands of redundant price lookups; the fix was to reuse data the page already had — and the deeper lesson was about understanding a surface before adding calls to it.

## The short version

I built "member savings badges" — small labels on product cards showing non-members how much they'd save during a members-only sale. We launched them alongside a new members-only pricing event for kitchen appliances. Within hours, under sale traffic, the badges stopped showing up.

- the feature was the visible hook of a live sale, so failing quietly still hurt
- I had to find the cause fast, during real traffic
- the fix had to be safe, not just quick
- and I had to understand why I'd missed it in the first place

{% callout title="Helpful references" %}
- [Rate limiting](https://developer.mozilla.org/en-US/docs/Glossary/Rate_limit)
- [Passing data down in React](https://react.dev/learn/passing-data-deeply-with-context)
- [GraphQL](https://graphql.org/learn/)
- [Thundering herd problem](https://en.wikipedia.org/wiki/Thundering_herd_problem)
{% /callout %}

## Why this existed

The badges were the point of the sale — the thing that tells a shopper "you'd save this much as a member" right where they're browsing. If they don't render, the sale loses its most persuasive signal exactly when traffic is highest.

So this wasn't a cosmetic bug. It was the launch feature going dark during its own launch.

{% callout tone="warning" title="The goal" %}
Restore the badges safely during a live, high-traffic sale — the smallest change that fixes the real cause, not a band-aid that might make things worse.
{% /callout %}

## The problem: every card asked the same question

Each product card on a browse page fetched its own savings data with a separate call to the pricing service. Fine in testing. Under sale traffic, a single page could render dozens of cards, each firing its own request.

- one browse page = many product cards
- each card made its own client-side call to the pricing service
- sale traffic multiplied that into a flood of requests
- the volume blew past the pricing service's rate limit, so calls started failing — and badges vanished

The reason I missed it: product cards were new to me and my team. I hadn't realized the cards **already** fetched pricing data for their existing price display. I was fetching the same information a second time.

## Before vs. after

The fix wasn't to raise the rate limit or add retries. It was to stop making the redundant calls entirely.

```text
// Before: every badge fetches its own price
browse page (many cards)
  card 1 → pricing service call
  card 2 → pricing service call
  card 3 → pricing service call
  ...dozens per page...
under sale traffic → rate limit exceeded → badges fail
```

```text
// After: reuse the price the card already has
browse page (many cards)
  card already fetched pricing for its price display
  badge reads that same data ← no new call
0 extra requests to the pricing service
```

![Redundant per-card calls vs. reusing existing pricing data](/work/sale-rate-limit-incident/rate_limit_dataflow.svg)

```md
Key shift:
Data source → the card's existing pricing data, not a new call
Network load → dozens of calls per page down to zero extra
Failure mode → removed at the root, not patched around
```

## The architecture: read what's already there

The whole fix is one idea: the data was already in the component tree. I just had to thread it to the badge instead of re-fetching it.

- **Find the real cause, not the symptom:** the symptom was "badges missing." The cause was request volume hitting a rate limit. Traces and the failing calls pointed straight at the redundant per-card fetches.
- **Reuse, don't re-fetch:** the card's existing price component already had the pricing data. I passed that down to the savings badge so it read from data in hand instead of making its own request.
- **Ship the smallest safe change:** no rate-limit bump, no caching layer, no retries — those add complexity and risk during a live incident. Removing the redundant calls fixed the root cause with the least surface area.

{% callout title="Key idea" %}
The best hotfix is usually the smallest safe change that restores the user path. Here that meant deleting work, not adding infrastructure.
{% /callout %}

## Safety rails / production behavior

This was an active incident on a revenue event, so restraint mattered.

- **Root-cause fix:** eliminated the redundant calls instead of masking the failure with retries.
- **No new moving parts:** avoided adding caches or limits under time pressure.
- **Fast, controlled recovery:** diagnosed the same day, deployed the fix the next morning — badges back within ~18 hours.
- **Process change:** afterward I made a point of getting review from the teams who own a surface's traffic patterns, not just the nearest code owners.

## Evidence I'd show

- **Data-flow before/after:** dozens of per-card calls collapsing to zero extra requests.
- **Incident timeline:** launch → badges fail under load → diagnosis → fix deployed (~18h).
- **The one-line lesson:** understand a surface's existing data flow before adding network calls to it.

## What this demonstrates

- I diagnose production failures to root cause under time pressure.
- I prefer the smallest safe fix over adding risky infrastructure mid-incident.
- I understand how frontend data flow drives backend load.
- I turn a mistake into a durable process improvement.
