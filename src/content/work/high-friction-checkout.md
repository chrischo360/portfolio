---
slug: high-friction-checkout
collection: work
order: 2
eyebrow: Wayfair · Checkout architecture
title: "How Much Should a CMS Own in Checkout?"
summary: "Migrating a loyalty enrollment flow forced a harder architecture question: how much control should a CMS have inside a revenue-critical checkout?"
impact: Product can change copy, layout, reward tiers, and interaction intent across five storefront locales without a code deploy, while purchase mutations and checkout recovery stay in code.
hero:
  src: /work/high-friction-checkout/hfc-hero.png
  alt: Representative Wayfair Rewards checkout enrollment component showing reward value, enrollment choices, terms, and CTA

tags: []
---

Wayfair's [Block Builder](https://www.youtube.com/watch?v=m0WXGOSiMQU) is a server-driven UI platform. Instead of hardcoding what a page renders, the frontend asks Block Builder for a typed content graph and renders whatever comes back. Content editors configure it in a CMS. No code deploy required.

That model works well for marketing surfaces. For checkout, it raises a harder question: **what should the CMS actually own?**

Too little, and every copy tweak needs an engineer in a revenue-critical path. Too much, and a content editor can accidentally trap a customer behind an overlay that blocks the payment page.

The name High Friction Checkout (HFC) is literal. The Rewards enrollment flow asks the customer to accept or decline before the rest of checkout becomes interactive. An overlay failure is not just a visual bug; it can stop someone from paying.

When I migrated that existing flow from Wayfair's legacy PHP checkout stack to Block Builder, I had to decide where configurability ended and checkout control began.

_The product visuals below are representative recreations. They contain no customer or internal production data._

{% callout title="The boundary" %}
Block Builder could describe the experience and express its intent. Checkout code kept control of purchase mutations, gating, and recovery.
{% /callout %}

## Before the migration

The legacy component received one PHP data blob containing everything it needed: live checkout facts such as `potentialRewards` and `isLoyaltySkuAdded`, alongside titles, button labels, image IDs, and screen content. React consumed the whole shape as one unit.

I could have recreated that payload in GraphQL and called the migration finished. That would have changed the stack without changing the design. Copy, layout, checkout state, and behavior would still be tangled together.

Instead, I split the flow by ownership:

- **Block Builder owns the description:** screens, copy, terms, calls to action, layout, and styling tokens.
- **The HFC component owns the interaction:** selected choice, terms acceptance, loading and error state, and the current screen.
- **Checkout owns the consequences:** cart facts, the membership SKU mutation, and the global overlay that can block the page.

![Before and after ownership boundaries for the HFC migration](/work/high-friction-checkout/state_separation.svg)

## CMS configuration

Block Builder returns a typed GraphQL graph for the full experience. Each screen has three distinct regions rather than one open canvas. The header accepts an ordered set of logo, gem, and promotional-image blocks. Content has dedicated title and subtitle fields, followed by `Row` or `Column` containers. The footer has its own `Row` and `Column` containers.

Those containers accept a bounded set of content blocks: formatted messages, rich text, choices, terms, and enrollment actions. Containers cannot contain other containers. Editors can change ordering, direction, spacing, padding, and section alignment through Homebase design tokens, but the schema prevents a payment action from being dropped into the header or arbitrary CSS from entering checkout.

{% media type="embed" src="/work/high-friction-checkout/composable_layout_demo.html" title="Representative Block Builder visual playground" caption="Build the screen with contextual Add menus, drag blocks to reorder them, and switch on Developer view to inspect the typed GraphQL structure underneath." expandable=true /%}

The same component serves five storefront locales: US, Canadian English, Canadian French, UK, and Ireland. It selects one of four reward bands from the customer's potential rewards, membership fee, and a configurable minimum. A customer with a $50 cart can see a different message from one with a $5 cart without adding conditional copy to the frontend.

CMS-authored strings can also include placeholders such as `[PotentialRewards]`, `[MembershipFee]`, and `[CartTotal]`. The component resolves those against live checkout data at render time. Product writes the message; checkout supplies the facts.

## Interaction modes

HFC runs in two modes. In `addToCart` mode, the enrollment action requires terms acceptance before it can add the membership SKU. In `standalone` mode, that terms gate and purchase path are absent.

The obvious schema design was a `mode` field. I chose not to add one because it could disagree with the content around it: a screen could claim to be `addToCart` while omitting the required terms block.

Instead, `deriveExperienceType()` reads the DEFAULT screen. A valid `BlockBuilderLoyaltyTermsAndConditions` block means `addToCart`; without one, the component uses `standalone`.

```text
DEFAULT screen
  → contains a valid terms block?
      yes → addToCart → require acceptance before the membership mutation
      no  → standalone → do not enter the gated enrollment path
```

The CMS expresses intent by including the structure that makes the behavior valid. There is no second flag for an editor to keep in sync.

A malformed configuration therefore fails toward the less consequential mode instead of silently bypassing the terms gate.

## Screen transitions

The CMS describes three screens: `DEFAULT`, `REWARDS_ADDED`, and `REWARDS_DECLINED`. It controls what each one looks like, but not when the component moves between them.

Those transitions stay in a `useReducer` with discriminated union actions:

```text
DEFAULT
  → customer accepts terms and enrollment succeeds → REWARDS_ADDED
  → customer declines                              → REWARDS_DECLINED
  → customer reconsiders                           → DEFAULT
```

The membership SKU mutation also stays in code. Content editors can change the call-to-action label or move it within the layout, but they cannot configure what gets added to the purchase contract.

## Failure handling

The HFC component does not enable the overlay directly. It emits `onVeilChange`; the surrounding checkout section translates that request into `enableVeil` and `disableVeil` actions in global checkout state.

That separation gives checkout an escape hatch when the component fails:

```text
HFC asks checkout to enable the veil
  → checkout sections become inactive
  → HFC hits a render error
  → its error boundary asks checkout to disable the veil
  → HFC is removed
  → the customer can continue checkout
```

The fallback behavior follows the same rule. If Block Builder omits a message for one reward band, the component uses default content and logs the missing tier with the block ID. A content mistake can produce generic copy; it should not make the payment page unusable.

## After the migration

Before the migration, changing HFC copy, layout, or screen content meant changing a checkout-specific payload and shipping code. Live checkout facts and presentation were part of the same contract.

Afterward, Product could configure the experience across five storefront locales without a frontend deploy. The React component rendered and validated that configuration, while checkout retained the operations with customer or revenue consequences: terms gating, screen transitions, purchase-contract mutations, and overlay recovery.

The line I landed on was consequence. The CMS could describe the experience and express what it wanted. Code still decided whether that intent was valid, what changed the order, and how checkout recovered when something went wrong.
