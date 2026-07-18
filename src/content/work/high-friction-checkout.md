---
slug: high-friction-checkout
collection: work
order: 2
eyebrow: Wayfair · Checkout architecture
title: "Wayfair Rewards in Checkout: Making a Revenue-Critical Flow Configurable"
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

The name High Friction Checkout (HFC) is literal: customers have to accept or decline the Rewards offer before the rest of checkout becomes interactive. The flow sits above checkout behind a global veil, so a failure can stop payment—not just break a banner.

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
- **Checkout owns the consequences:** cart facts, the membership SKU mutation, and the global veil that can block the page.

![Before and after ownership boundaries for the HFC migration](/work/high-friction-checkout/state_separation.svg)

## CMS configuration

Block Builder returns a typed GraphQL graph for the full experience. Each screen has three distinct regions rather than one open canvas. The header accepts an ordered set of logo, gem, and promotional-image blocks. Content has dedicated title and subtitle fields, followed by `Row` or `Column` containers. The footer has its own `Row` and `Column` containers.

Those containers accept a bounded set of content blocks: formatted messages, rich text, choices, terms, and enrollment actions. Containers cannot contain other containers. Editors can change ordering, direction, spacing, padding, and section alignment through Homebase design tokens, but the schema prevents a payment action from being dropped into the header or arbitrary CSS from entering checkout.

The same component serves five locales: `en-US`, `en-CA`, `fr-CA`, `en-GB`, and `en-IE`. It selects one of four message tiers by comparing the customer's potential rewards with zero, a configurable minimum, and the storefront's membership fee. A customer expected to earn $50 can see different copy from one expected to earn $2 without adding conditional copy to the frontend.

CMS-authored strings can also include placeholders such as `[PotentialRewards]`, `[RewardPercentage]`, `[MembershipFee]`, and `[CartTotal]`. The component resolves them against live checkout data at render time. Content editors write the message; checkout supplies the values.

## Interaction modes

HFC runs in two modes. In `addToCart` mode, the enrollment action requires terms acceptance before it can add the membership SKU. In `standalone` mode, the terms gate and checkout SKU mutation are absent.

The obvious schema design was a `mode` field. I chose not to add one because it could disagree with the content around it: a screen could claim to be `addToCart` while omitting the required terms block.

Instead, `deriveExperienceType()` reads the `DEFAULT` screen. An interactive `BlockBuilderLoyaltyTermsAndConditions` block—one whose `termsAndConditions` field is populated—means `addToCart`; without one, the component uses `standalone`.

```text
DEFAULT screen
  → contains a valid terms block?
      yes → addToCart → require acceptance before the membership mutation
      no  → standalone → do not enter the gated enrollment path
```

The CMS expresses intent by including the structure that makes the behavior valid. There is no second flag for an editor to keep in sync.

If the configuration is incomplete, the component falls back to `standalone` instead of treating an ungated action as permission to mutate checkout.

## Screen transitions

The CMS describes three screens: `DEFAULT`, `REWARDS_ADDED`, and `REWARDS_DECLINED`. It controls what each one looks like, but not when the component moves between them.

Those transitions stay in a `useReducer` with discriminated union actions:

```text
DEFAULT
  ├─ customer accepts terms and enrollment succeeds → REWARDS_ADDED
  └─ customer declines → REWARDS_DECLINED
                          └─ customer reconsiders → DEFAULT
```

The membership SKU mutation also stays in code. Content editors can change the call-to-action label or move it within the layout, but they cannot configure which SKU gets added to the customer's order.

## Failure handling

The HFC component does not control the global checkout veil directly. It emits `onVeilChange`; the surrounding checkout section translates that request into `enableVeil` and `disableVeil` actions in global checkout state.

That separation gives checkout an escape hatch when the component fails:

```text
HFC asks checkout to enable the veil
  → checkout sections become inactive
  → HFC hits a render error
  → its error boundary asks checkout to disable the veil
  → HFC is removed
  → the customer can continue checkout
```

The fallback behavior follows the same rule. If a screen is missing the copy variant for the current reward tier, the component uses that screen's default content and logs the missing tier with the affected block IDs. A content mistake can produce generic copy; it should not make the payment page unusable.

## After the migration

Before the migration, changing HFC copy, layout, or screen content meant changing a checkout-specific payload and shipping code. Live checkout facts and presentation were part of the same contract.

Afterward, content editors could configure the experience across five locales without a frontend deploy. The HFC component rendered and validated that configuration, keeping terms validation and screen transitions in code. Checkout retained control of the membership SKU mutation and veil recovery.

The line I landed on was consequence. The CMS could describe the experience and express its intent. Code still decided whether that intent was valid, when to mutate the customer's order, and how checkout recovered when something went wrong.
