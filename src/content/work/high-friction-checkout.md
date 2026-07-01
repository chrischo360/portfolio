---
slug: high-friction-checkout
collection: work
eyebrow: Wayfair · Checkout architecture
title: Schema-Driven UI for a Checkout Loyalty Flow
summary: I turned a hardcoded checkout loyalty banner into a schema-driven mini-flow that product could configure without making checkout more fragile.
impact: Separated CMS content, checkout data, and local interaction state while preserving checkout safety.
tags:
  - Checkout
  - Block Builder
  - Server-driven UI
  - React state
---

# Schema-Driven UI for a Checkout Loyalty Flow

I turned a hardcoded checkout loyalty banner into a schema-driven mini-flow that product could configure without making checkout more fragile.

![Mock of the checkout loyalty enrollment component](/work/high-friction-checkout/hfc_component_mock.svg)

{% callout title="Context" %}
Block Builder is Wayfair’s server-driven UI platform. Product teams configure checkout content, while the frontend renders typed GraphQL blocks and keeps purchase-critical state local to checkout.
{% /callout %}

## History

The first version lived in Wayfair’s legacy checkout stack:

- A PHP controller/serializer prepared eligibility, reward values, suppression state, feature flags, localized copy, and image IDs.
- A checkout-specific React component rendered the banner and owned the veil/screen behavior.

As checkout moved toward a newer schema-driven architecture during Wayfair’s broader [tech replatforming](https://www.constellationr.com/insights/news/wayfair-starts-reap-rewards-optimization-tech-replatforming-efforts), the same loyalty flow needed to work in the new Block Builder checkout.

The migration goal was not just parity. The goal was to separate content/configuration from checkout behavior so product could iterate faster without making checkout more fragile.

## Problem

Checkout cannot break, but the legacy flow mixed too many concerns:

- PHP owned content and reward logic.
- React owned UI rendering.
- Checkout owned purchase-critical state and veil behavior.
- Product owned copy, layout, and screen variants.

That made the flow harder to evolve. A change to copy, layout, reward messaging, or screen structure could require code changes in a revenue-critical checkout path.

## Before vs. after

Before, the frontend received one checkout-specific data blob. It mixed business facts, content, images, and UI states.

```json
// Before: PHP-shaped response blob
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

After, Block Builder described the content structure, while checkout supplied live data like cart total and reward amount.

```json
// After: Block Builder / GraphQL-shaped content
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

```md
Key shift:
Content/layout -> Block Builder schema
Dynamic checkout data -> checkout state
Interaction flow -> local reducer/context
```

## Built as a Block Builder server-driven UI experience

![Block Builder schema preview mock](/work/high-friction-checkout/block_builder_schema_preview.svg)

The banner was modeled as configurable content instead of a one-off hardcoded component:

- **Experience:** the entire checkout component; owns the set of screens and global error copy.
- **Screen:** one state of the flow: `DEFAULT`, `REWARDS_ADDED`, `REWARDS_DECLINED`.
- **Component blocks:** logo, gem image, promo banner, title copy, choice options, terms, primary CTA, decline CTA.
- **Configurability:** rows/columns, background color, alignment, margins, padding, gaps, and tiered reward copy.

The important product win: product/content could change the structure, copy, visuals, and reward-tier messaging from CMS configuration instead of creating a new hardcoded checkout component.

## State separation

![State separation diagram](/work/high-friction-checkout/state_separation.svg)

The component did not own checkout. It only owned the enrollment mini-flow.

- **Checkout state owned purchase-critical facts:** cart total, potential rewards, membership price, whether the loyalty SKU was in the cart, and global veil behavior.
- **Block Builder owned content/layout:** screens, copy, terms, CTAs, rows/columns, spacing, and styling.
- **HFC local state owned interaction:** selected choice, terms accepted/error, loading/error, current screen, and whether the veil had been dismissed.

Key line: checkout provided the facts, Block Builder provided the content, and HFC managed only its own interaction state.

## Checkout-safe behavior

Because this lived in checkout, failure handling mattered as much as the happy path.

- Error boundaries protected the rest of checkout if the component failed.
- The veil was disabled on failure so the customer could not get trapped.
- Missing data fell back to default values/copy.
- Missing Block Builder variants logged warnings and fell back to default screen content.
- Observability helped catch checkout errors, payment failures, and latency regressions.

![Representative Datadog observability mock](/work/high-friction-checkout/datadog_observability_mock.svg)

## What I’d show in the interview

- **45-second component video:** banner appears, veil focuses the user, user accepts terms, enrolls, and sees the success state.
- **Datadog dashboard:** checkout errors, payment failures, page latency, and component warnings/errors.
- **Block Builder schema + preview:** the configured experience, screens, component blocks, and styling controls.

Visual mock page: [high_friction_checkout_visual_mocks.html](/work/high-friction-checkout/high_friction_checkout_visual_mocks.html)

## Why it matters

- I migrated a legacy production flow into a cleaner architecture without losing checkout reliability.
- I separated CMS content, checkout data, and component interaction state.
- I made a product-facing checkout experience easier to iterate on while preserving safety in a revenue-critical flow.

## TODO

- [ ] Add metrics on High Friction Checkout
- [ ] Add different translation support
