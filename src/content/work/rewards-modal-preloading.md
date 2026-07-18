---
slug: rewards-modal-preloading
collection: work
order: 3
eyebrow: Wayfair · Checkout performance
title: "Wayfair: Making a Checkout Rewards Modal Feel Immediate"
summary: "I replaced a blank-spinner checkout modal with a two-phase GraphQL flow: prefetch lightweight CMS preview content while the modal was closed, then create the real checkout contract only when the customer opened it."
impact: "Replaced a risky full-checkout prefetch with a safe GraphQL preview path that separated CMS readiness from purchase-contract creation."
headerDisplay: minimal
hero:
  src: /work/rewards-modal-preloading/rewards-modal-hero.png
  alt: Wayfair Rewards standalone purchase modal preview mock
tags: []
---

## Before vs. after

{% videocomparison beforeSrc="/work/rewards-modal-preloading/rewards-modal-before.mp4" afterSrc="/work/rewards-modal-preloading/rewards-modal-after.mp4" beforeLabel="Before: blank spinner" afterLabel="After: preview content" /%}

## Making a Checkout Rewards Modal Feel Immediate

Before, opening the modal required the full checkout experience.

{% callout title="What to notice" %}
The old flow coupled “show the modal content” with “create the checkout state.”
{% /callout %}

```text
user opens modal
  → frontend runs full loyalty checkout query
  → backend checks eligibility
  → backend creates payment intent / purchase contract
  → frontend receives CMS content + checkout contract
  → modal renders
```

After, the modal had a lightweight preview path.

```text
modal mounted but closed
  → frontend runs preview query without purchaseContract
  → backend returns CheckoutPreview screen content
  → no payment intent / purchase contract created

user opens modal
  → modal renders preview content immediately
  → frontend runs full checkout query with purchaseContract
  → backend creates/loads payment intent + purchase contract
  → contract-dependent widgets replace loading placeholders
```

![Representative before/after timeline of the modal load](/work/rewards-modal-preloading/prefetch_timeline.svg)

```md
Key shift:
CMS/modal content → safe preview query
Purchase/payment state → full query on open
Contract-dependent UI → loading placeholders until checkout data arrives
```

## The short version

In checkout-adjacent systems, loading a modal is not always just loading UI.

- the modal needed CMS content
- it needed eligibility and membership state
- it needed checkout data like payment, promo, terms, and totals
- some checkout data could create payment or purchase state

## Why this existed

Wayfair wanted more customers to join Rewards from high-intent shopping surfaces.

The standalone purchase modal was one entry point. Customers could open it from PDP or Hot Deals, review benefits, choose payment, accept terms, and buy the membership without going through the normal cart flow.

But the modal felt slow. The user clicked, then saw a blank loading state while the system assembled the full checkout experience.

{% callout title="Performance goal" %}
The goal was to make the modal feel ready immediately, while keeping payment intent and purchase contract creation behind real customer intent.
{% /callout %}

## The problem: prefetching checkout is risky

The obvious fix was to prefetch the modal.

The first attempt did that: when a PDP or Hot Deals page rendered, the frontend prepared the standalone purchase experience ahead of time.

But the “purchase experience” query was not just a read. It could trigger the real checkout path.

```text
page loads
  → prefetch standalone purchase query
  → backend prepares full checkout experience
  → payment intent / purchase contract / payment-session work starts
  → multiplied across millions of page views, checkout/payment services can be overloaded
  → many users may never open the modal
```

A safe prefetch should be cheap, reversible, and okay to run for many users. This one could create checkout/payment load for users who only saw a loyalty banner.



## Architecture

The final design separated the modal into two API states.

- **Preview owned readiness:** the backend returned `BlockBuilderLoyaltyProgramCheckoutPreview`, a lightweight GraphQL type with CMS screen content and no purchase contract.
- **Checkout owned commitment:** the full query requested `purchaseContract`, which created or loaded the real checkout state.
- **The component owned the transition:** React rendered preview content first, then merged in full checkout data when it arrived.

![Preview vs. checkout architecture diagram](/work/rewards-modal-preloading/prefetch_architecture.svg)

{% callout title="Key idea" %}
The server could now say, “this customer is eligible and here is the modal content,” without also saying, “I have started a checkout session.”
{% /callout %}

## Safety rails

Because this sat next to checkout and payments, fallback behavior mattered as much as speed.

- **No side effects in preview:** the preview query omitted `purchaseContract`, so the backend skipped payment intent, purchase contract, and checkout session cache work.
- **Full query as source of truth:** opening the modal still ran the full checkout query and replaced preview data.
- **Feature flags:** frontend prefetch and backend preview behavior were independently gated.
- **N+1 backend rollout:** the subgraph could be tested through a v2 deployment path and header-based routing before broader rollout.
- **Bad preview fallback:** if the prefetch returned an unusable full checkout type, the modal fell back to the normal spinner and full query.
- **Error handling:** full-query failure showed the standard error screen rather than leaving the modal stuck.
- **Performance logging:** modal open time tracked whether the render came from preview or full data.

