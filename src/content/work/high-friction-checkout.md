---
slug: high-friction-checkout
collection: work
order: 2
eyebrow: Wayfair · Checkout architecture
title: "Wayfair: Making a Revenue-Critical Flow Configurable in Checkout"
summary: "I moved a blocking Rewards enrollment flow from a legacy PHP payload to server-driven UI without giving the CMS control of purchase mutations or recovery."
impact: Content editors can change copy, layout, and reward-tier messaging across five locales without a deploy, while checkout keeps control of enrollment mutations and failure recovery.
headerDisplay: hero-only
hero:
  src: /work/high-friction-checkout/hfc-hero.png
  alt: Representative Wayfair Rewards checkout enrollment component showing reward value, enrollment choices, terms, and CTA

tags: []
---

Wayfair's [Block Builder](https://www.youtube.com/watch?v=m0WXGOSiMQU) is a server-driven UI platform. Instead of hardcoding what a page renders, the frontend asks Block Builder for a typed content graph and renders whatever comes back. Content editors configure it in a CMS.

The interactive builder below shows that model in practice: assemble a checkout screen, rearrange its layout, and inspect the typed GraphQL graph underneath.

{% media type="embed" src="/work/high-friction-checkout/composable_layout_demo.html" title="Representative Block Builder visual playground" caption="Build the screen with contextual Add menus, drag blocks to reorder them, and switch on Developer view to inspect the typed GraphQL structure underneath." expandable=true openLabel="Open the visual builder" description="Drag blocks, change layouts, and inspect the GraphQL structure." /%}

That model works well for marketing surfaces. For checkout, it raises a harder question: **what should the CMS actually own?**

Too little, and every copy tweak needs an engineer in a revenue-critical path. Too much, and a content editor can accidentally trap a customer behind a veil that blocks the payment page.

The name High Friction Checkout (HFC) is literal: customers have to accept or decline the Rewards offer before the rest of checkout becomes interactive. The flow sits above checkout behind a global veil, so a failure can stop payment, not just break a banner.

When I migrated that existing flow from Wayfair's legacy PHP checkout stack to Block Builder, I had to decide where configurability ended and checkout control began.

## Migration

![Before and after ownership boundaries for the HFC migration](/work/high-friction-checkout/state_separation.svg)

The legacy component received one PHP data blob containing everything it needed: live checkout facts such as `potentialRewards` and `isLoyaltySkuAdded`, alongside titles, button labels, image IDs, and screen content. React consumed the whole shape as one unit.

I could have recreated that payload in GraphQL and called the migration finished. That would have changed the stack without changing the design. Copy, layout, checkout state, and behavior would still be tangled together.

Instead, I split the flow by ownership:

- **Block Builder owns the description:** screens, copy, terms, calls to action, layout, and styling tokens.
- **The HFC component owns the interaction:** selected choice, terms acceptance, loading and error state, and the current screen.
- **Checkout owns the consequences:** cart facts, the membership SKU mutation, and the global veil that can block the page.


## CMS configuration

Block Builder returns a typed GraphQL graph for the full experience. Each screen has three regions (header, content, footer), each accepting a bounded set of content block types. Editors can change ordering, layout direction, spacing, and alignment through Homebase design tokens, but the schema prevents a payment action from landing in the header or arbitrary CSS from entering checkout.

The same component serves five locales. It selects one of four message tiers based on the customer's potential rewards, so a customer expected to earn $50 sees different copy from one expected to earn $2. No conditional logic in the frontend. CMS strings can include placeholders like `[PotentialRewards]` and `[CartTotal]` that resolve against live checkout data at render time.

## Interaction modes

HFC runs in two modes: `addToCart` (terms-gated, mutates checkout) and `standalone` (no gate, no mutation).

The obvious design was a `mode` field. I didn't add one. A flag can disagree with the content around it. Instead, `deriveExperienceType()` reads the `DEFAULT` screen: if it contains a valid terms block, the mode is `addToCart`; if not, `standalone`. The schema carries the intent. There's no second flag for an editor to keep aligned.

If the configuration is incomplete, the component falls back to `standalone` rather than treating an ungated action as permission to mutate checkout.

## Screen transitions

The CMS owns what each screen looks like. Transitions stay in a `useReducer`:

```text
DEFAULT
  ├─ accepts terms, enrollment succeeds → REWARDS_ADDED
  └─ declines → REWARDS_DECLINED
                 └─ reconsiders → DEFAULT
```

The membership SKU mutation also stays in code. Editors can change the call-to-action label, but not which SKU gets added to the cart.

## Failure handling

HFC doesn't control the veil directly. It emits `onVeilChange`, and the checkout section translates that into global state actions. So if HFC hits a render error, its error boundary can ask checkout to disable the veil and remove the component. The customer can continue.

Content fallbacks work the same way. If a screen is missing copy for the current reward tier, the component falls back to that screen's default content and logs the gap. A content mistake can produce generic copy; it shouldn't block the payment page.

## After the migration

Before the migration, changing HFC copy, layout, or screen content meant changing a checkout-specific payload and shipping code. Live checkout facts and presentation were part of the same contract.

Afterward, content editors could configure the experience across five locales without a frontend deploy. The HFC component rendered and validated that configuration, keeping terms validation and screen transitions in code. Checkout retained control of the membership SKU mutation and veil recovery.

The line I landed on was consequence. The CMS could describe the experience and express its intent. Code still decided whether that intent was valid, when to mutate the customer's order, and how checkout recovered when something went wrong.
