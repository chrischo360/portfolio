---
slug: high-friction-checkout
collection: work
eyebrow: Wayfair · Checkout architecture
title: Turning a Checkout Banner into Schema-Driven UI
summary: I turned a hardcoded checkout loyalty banner into a schema-driven mini-flow that product could configure without making checkout more fragile.
impact: Moved checkout content into CMS configuration while keeping purchase-critical state and failure handling safely in code.
hero:
  src: /work/high-friction-checkout/hfc_component_mock.svg
  alt: Checkout loyalty enrollment component
tags:
  - React
  - GraphQL
  - Server-driven UI
  - Checkout
  - State management
---

# Turning a Checkout Banner into Schema-Driven UI

I turned a hardcoded checkout loyalty banner into a schema-driven mini-flow that product could configure without making checkout more fragile.

_A representative mock of the checkout enrollment component. The real component appeared above checkout sections and used a veil — a semi-transparent overlay — to focus the customer on the decision._

## The short version

At first glance, this was a banner. In checkout, though, a banner is never just a banner.

- render configurable content from a CMS
- use live checkout data like cart total and potential rewards
- manage its own enrollment interaction
- fail safely if anything went wrong

{% callout title="Helpful references" %}
- [Content management system](https://en.wikipedia.org/wiki/Content_management_system)
- [Server-driven UI](https://www.infoq.com/articles/server-driven-ui/)
- [GraphQL](https://graphql.org/learn/)
- [React reducer state](https://react.dev/reference/react/useReducer)
- [React context](https://react.dev/reference/react/useContext)
{% /callout %}

## Why this existed

Wayfair wanted to increase Rewards enrollment during checkout.

The first version lived in the legacy checkout stack. PHP prepared eligibility, reward values, feature flags, localized copy, and images. React rendered a checkout-specific component.

As checkout moved toward a newer schema-driven architecture during Wayfair’s broader [tech replatforming](https://www.constellationr.com/insights/news/wayfair-starts-reap-rewards-optimization-tech-replatforming-efforts), the same flow needed to exist in the new Block Builder checkout.

{% callout title="Migration goal" %}
The goal was not just parity. I wanted the content to move into configuration, while checkout behavior stayed in code where it could be tested and safely recovered.
{% /callout %}

## The problem: checkout cannot break

A normal marketing banner can fail quietly. A checkout banner cannot.

If it traps the user behind a veil, breaks payment, or blocks the page, it can directly hurt conversion.

- PHP owned content and reward logic.
- React owned UI rendering.
- Checkout owned purchase-critical state and veil behavior.
- Product owned copy, layout, and screen variants.

That made the flow harder to evolve. A change to copy, layout, reward messaging, or screen structure could require code changes in a revenue-critical checkout path.

## Before vs. after

Before, the frontend received one checkout-specific data blob.

{% callout title="What to notice" %}
The old shape mixes live checkout facts with content, images, and UI states.
{% /callout %}

```json
// Before: legacy response
{
  "potentialRewards": "$18.42",
  "isLoyaltySkuAdded": false,
  "isInSuppressionPeriod": false,
  "logoImageId": "...",
  "default": {
    "title": "Earn rewards today",
    "choice1": "Yes, enroll me",
    "choice2": "No thanks",
    "cta": "Join Rewards"
  },
  "added": { "...": "..." },
  "declined": { "...": "..." }
}
```

```json
// After: schema-driven content
{
  "__typename": "BlockBuilderLoyaltyProgramHighFrictionCheckoutExperience",
  "screens": [
    {
      "screenType": "DEFAULT",
      "header": { "logo": "..." },
      "content": {
        "titleOne": "Earn [PotentialRewards]",
        "contentBlocks": ["Choices", "Terms", "CTA"]
      },
      "footer": { "contentBlocks": [] }
    },
    { "screenType": "REWARDS_ADDED" },
    { "screenType": "REWARDS_DECLINED" }
  ]
}
```

![Block Builder schema preview mock](/work/high-friction-checkout/block_builder_schema_preview.svg)

```md
Key shift:
Content/layout → Block Builder schema
Dynamic checkout data → checkout state
Interaction flow → local reducer/context
```

## The architecture: schema owns content, checkout owns facts

The banner became configurable content instead of a one-off hardcoded component.

- **Block Builder owned content:** screens, copy, terms, CTAs, images, layout, spacing, and tiered reward messaging.
- **Checkout owned facts:** cart total, potential rewards, membership price, whether the loyalty membership item was already in the cart, and global veil behavior.
- **The component owned interaction:** selected choice, terms accepted, loading/error, current screen, and whether the veil had been dismissed.

![State separation diagram](/work/high-friction-checkout/state_separation.svg)

{% callout title="Key idea" %}
Checkout provided the facts, Block Builder provided the content, and HFC managed only its own interaction state.
{% /callout %}

## Safety rails

Because this lived in checkout, failure handling mattered as much as the happy path.

- **Error boundary:** protect checkout if the component fails.
- **Veil escape hatch:** disable the overlay on errors so the customer cannot get trapped.
- **Default values:** keep rendering if optional data is missing.
- **Schema warnings:** log missing CMS variants and fall back to default screen content.
- **Observability:** watch checkout errors, payment failures, and latency regressions.

![Representative Datadog observability mock](/work/high-friction-checkout/datadog_observability_mock.svg)

_Representative observability view. For the interview, I’d show sanitized production dashboards where possible._

## Evidence I’d show

- **45-second component video:** the banner appears, the veil focuses the user, the user accepts terms, enrolls, and sees success.
- **Schema preview:** configured screens, component blocks, and styling controls.
- **Observability:** checkout errors, payment failures, page latency, and component warnings.

Visual mock page: [high_friction_checkout_visual_mocks.html](/work/high-friction-checkout/high_friction_checkout_visual_mocks.html)

## What this demonstrates

- I can migrate legacy production flows without losing reliability.
- I can separate CMS content, live checkout data, and client interaction state.
- I can build product-facing UI that is configurable for non-engineers.
- I think about failure modes when working near revenue-critical flows.
