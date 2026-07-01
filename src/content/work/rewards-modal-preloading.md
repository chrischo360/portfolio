---
slug: rewards-modal-preloading
collection: work
order: 2
eyebrow: Wayfair · Checkout performance
title: Making a Checkout Rewards Modal Feel Instant
summary: I made a slow checkout rewards modal feel instant by preparing its data ahead of time, without loading everything upfront or triggering a purchase before the user asked for one.
impact: Cut modal load time from ~3.8s to ~0.5s with no added cost to the checkout page render, and no premature purchase side effects.
hero:
  src: /work/rewards-modal-preloading/rewards-modal-hero.png
  alt: Wayfair Rewards checkout modal — "Earn 5% in rewards on every item, always"
tags:
  - Performance
  - React
  - GraphQL
  - Checkout
  - Prefetching
---

# Making a Checkout Rewards Modal Feel Instant

I made a slow checkout rewards modal feel instant by preparing its data ahead of time, without loading everything upfront or triggering a purchase before the user asked for one.

## The short version

A customer in checkout could open a rewards modal — a pop-up that let them join Wayfair Rewards as a standalone purchase. It worked, but it was slow: about 3.8 seconds from click to usable modal.

The obvious fix is "just load it earlier." In checkout, that is a trap.

- the modal needed live checkout data and its own code bundle
- loading all of it on page render would slow down the whole checkout page
- some of that data creates purchase-related side effects if you fetch it too early
- so I needed the modal to feel instant without paying for it upfront or acting too soon

{% callout title="Helpful references" %}
- [Prefetching](https://developer.mozilla.org/en-US/docs/Glossary/Prefetch)
- [Code splitting / lazy loading](https://react.dev/reference/react/lazy)
- [GraphQL](https://graphql.org/learn/)
- [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
{% /callout %}

## Why this existed

Wayfair wanted more customers to enroll in Rewards during checkout. The rewards modal was an activation-critical surface: a slow, janky modal at the moment of decision costs enrollments.

A 3.8-second wait after a click is long enough that many users lose momentum or assume something broke. On a revenue-adjacent flow, that latency is a conversion problem, not just a polish problem.

{% callout title="The goal" %}
Make the modal open near-instantly, while keeping the checkout page itself light and never doing purchase-y things before the user actually commits.
{% /callout %}

## The problem: fast, cheap, and safe — pick all three

The modal was slow because the two expensive things it needed — its **data** (a GraphQL query) and its **code** (a separate UI bundle) — were only requested *after* the user clicked.

There were three tempting fixes, each with a catch:

- **Fetch everything on page load** → the checkout page gets heavier and slower for everyone, including users who never open the modal.
- **Create purchase state early** → some of the modal's setup touches purchase/cart data; doing it too early can create invalid or premature side effects.
- **Leave it lazy** → correct and safe, but the user eats the full ~3.8s every time.

So the real constraint was: prepare the *readiness* of the modal without triggering the *consequences* of opening it.

## Before vs. after

The win came from moving work off the click and onto idle time, and from separating "get the data ready" from "commit to a purchase."

```text
// Before: everything happens on click
user clicks
  → request modal code bundle
  → fire GraphQL query
  → wait for both
  → render
≈ 3.8s until usable
```

```text
// After: readiness precomputed, commit deferred
page renders (light)
  → idle: prefetch GraphQL data
  → idle: lazy-load modal code
user clicks
  → render from preloaded data/code
≈ 0.5s until usable
(purchase creation still deferred until confirm)
```

![Before/after timeline of the modal load](/work/rewards-modal-preloading/prefetch_timeline.svg)

```md
Key shift:
Data fetch → moved from click-time to a preload before intent
Code bundle → lazy-loaded, but ahead of the click
Purchase side effects → still deferred until the user confirms
```

## The architecture: separate readiness from commitment

The core idea is that "the modal is ready to show" and "the user has started a purchase" are two different states. The old code accidentally coupled them. I split them apart.

- **Preload data, not decisions:** the GraphQL query that populates the modal was prepared ahead of the click, so the data was warm and ready. It only reads what the modal needs to render — it does not create purchase state.
- **Lazy-load code without blocking the page:** the modal's UI code was split into its own bundle and loaded after the page settled, so it was present by the time the user clicked but never on the checkout critical path.
- **Defer irreversible actions to confirm:** anything with a real side effect (creating the purchase / adding the membership) stayed on the user's explicit confirmation, not on preload or open.

![Readiness vs. commitment separation diagram](/work/rewards-modal-preloading/prefetch_architecture.svg)

{% callout title="Key idea" %}
Preloading made the modal *ready*. It did not make the purchase *happen*. Keeping those separate is what let me cut latency without adding checkout risk.
{% /callout %}

## Safety rails / production behavior

Because this sat next to checkout, "faster" could not come at the cost of "riskier."

- **No premature side effects:** preload only prepared read data; purchase creation stayed behind explicit confirmation.
- **Off the critical path:** prefetch and lazy-load ran during idle time so the checkout page's own render was never slowed.
- **Graceful fallback:** if preload had not finished when the user clicked, the modal fell back to fetching on demand — slower, but still correct.
- **Measured:** load time was tracked so the improvement (and any regression) was visible, not assumed.
