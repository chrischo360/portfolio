---
slug: rewards-modal-preloading
collection: work
order: 3
eyebrow: Wayfair · Checkout performance
title: "Wayfair: Making a Checkout Rewards Modal Feel Immediate"
summary: "I prefetched a checkout modal, caused an outage, then built a safer fix: a lightweight GraphQL preview query that separated CMS readiness from purchase-contract creation."
headerDisplay: copy-only
hero:
  src: /work/rewards-modal-preloading/rewards-modal-hero.png
  alt: Wayfair Rewards standalone purchase modal preview mock
tags: []
---
## Before vs. after

{% videocomparison beforeSrc="/work/rewards-modal-preloading/rewards-modal-before.mp4" afterSrc="/work/rewards-modal-preloading/rewards-modal-after.mp4" beforeLabel="Before: blank spinner" afterLabel="After: preview content" /%}

## Summary

- The modal was slow because it depended on a single GraphQL query that **coupled CMS content, eligibility, payment terms, and a purchase contract.**
- My first attempt to speed up the percieved latency of the modal was to prefetch it's query on page load.
- This worked fine in local development, but at scale across PDP, Hot Deals, and Browse, the query was creating payment intents for millions of users who never opened the modal.
- My second attempt was to create a new query that returned only CMS content and eligibility.
- The full checkout query only runs when a customer actually opens the modal.

## Solution

Created two queries:
1. **Preview Query:** A new lightweight query returned CMS content and eligibility state.

2. **Full Query** Only ran when the modal actually opened. That's when real checkout state got created.

The client rendered preview content immediately on open, then merged in the full checkout data as it arrived, with loading placeholders for contract-dependent widgets.
