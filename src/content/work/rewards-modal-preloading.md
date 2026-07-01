---
slug: rewards-modal-preloading
collection: work
eyebrow: Wayfair · Rewards checkout
title: Reducing rewards modal load time with GraphQL preloading
summary: Moved data fetching earlier in the checkout flow so a rewards modal could open quickly when the user needed it.
impact: Dropped modal load time from 3.8 seconds to 0.5 seconds.
tags:
  - GraphQL
  - Preloading
  - Checkout
  - Performance
---

# Reducing rewards modal load time with GraphQL preloading

The rewards modal loaded too slowly at the moment of interaction, so I moved the required GraphQL data fetching earlier in the flow.

## History

The experience depended on data that was only fetched when the modal opened, which made the interaction feel slower than it needed to.

The modal was part of a checkout-adjacent rewards experience. When the user opened it, the interface needed to feel immediate because they were already in a purchase flow.

## Problem

{% callout tone="warning" title="The delay happened at the worst time" %}
The issue was not only the absolute data-fetch time. It was that the fetch happened at the exact moment the user expected the modal to be ready.
{% /callout %}

## Key decisions

- Identified the modal open as the user-visible delay.
- Moved required GraphQL data fetching earlier in the flow.
- Preserved the existing product behavior while improving perceived speed.
- Measured the load-time improvement after the change.

## Tradeoffs

- Accepted earlier data fetching to improve the later interaction.
- Kept the change focused on loading behavior instead of redesigning the modal.
- Balanced performance improvement with checkout flow stability.

## Outcome

{% callout tone="success" title="3.8s -> 0.5s" %}
Rewards modal load time dropped from 3.8 seconds to 0.5 seconds.
{% /callout %}

Perceived performance often comes from scheduling work at the right time. If the next user action is predictable, preloading can make a feature feel dramatically better without changing what the feature does.

## What I learned

- Perceived performance often depends on when work happens, not just how much work happens.
- Preloading is useful when the next user interaction is predictable.
- Small data-loading changes can meaningfully improve product feel.
