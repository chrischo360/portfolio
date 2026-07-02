---
slug: federated-checkout-graphql
collection: work
hidden: true
eyebrow: Wayfair · Checkout architecture
title: Untangling a Checkout Monolith into Federated GraphQL Services
summary: Legacy checkout behavior lived deep inside a PHP monolith, which made every purchase surface slow and risky to change. I helped move it into federated GraphQL services with clear ownership boundaries, so features could evolve independently.
impact: Moved shared checkout behavior out of a monolith into domain-owned GraphQL subgraphs, incrementally and without pausing product delivery.
hero:
  src: /work/federated-checkout-graphql/federated_checkout_architecture.svg
  alt: A checkout monolith decomposed into federated GraphQL subgraphs
tags:
  - GraphQL
  - Architecture
  - Checkout
  - Migration
  - Server-driven UI
---

# Untangling a Checkout Monolith into Federated GraphQL Services

Checkout logic was buried in a PHP monolith, so every purchase surface had to reach into the same tangled code. I helped move that behavior into federated GraphQL services with clear ownership lines, so teams could change their piece without breaking everyone else's.

## The short version

"Federated GraphQL" sounds abstract. The practical problem was simple: one big legacy system (a PHP monolith) owned too much of how checkout worked, and every product surface that touched purchasing — cart, checkout, the loyalty flows — had to go through it. That made even small changes slow and risky.

- shared checkout behavior lived in one monolith
- multiple product surfaces depended on it
- so changes needed heavy coordination and carried broad risk
- and we could not rewrite a revenue-critical system in one shot

{% callout title="Helpful references" %}
- [GraphQL](https://graphql.org/learn/)
- [GraphQL federation](https://www.apollographql.com/docs/federation/)
- [Monolith vs. microservices](https://martinfowler.com/articles/microservices.html)
- [Server-driven UI](https://www.infoq.com/articles/server-driven-ui/)
{% /callout %}

## Why this existed

Wayfair was replatforming checkout off a legacy PHP monolith onto a newer GraphQL and Next.js architecture. The business reason was speed: teams wanted to ship purchase-related features faster and more safely, without every change rippling through one shared codebase.

For my area — loyalty and rewards — that meant the enrollment and membership behavior had to move out of the monolith and live behind its own service boundary.

{% callout title="The goal" %}
Move shared checkout behavior into federated GraphQL services, so each surface (cart, checkout, loyalty) could evolve behind a clear contract — without pausing product delivery to do it.
{% /callout %}

## The problem: one system owned too much

In the monolith, the data and logic a purchase surface needed were all in one place. Convenient at first, expensive over time.

- **Tight coupling:** loyalty logic reached directly into checkout's internals, and vice versa.
- **Broad blast radius:** a change for one surface could break another.
- **Coordination tax:** shipping anything meant syncing across teams and code paths.
- **No clear ownership:** it was unclear who owned what, so nobody could move fast safely.

"Federation" is the fix: instead of one giant API, each domain (loyalty membership, order financials, cart/basket) exposes its own GraphQL subgraph, and they compose into one graph the frontend can query as if it were unified.

## Before vs. after

The shift was from "everyone shares one tangled system" to "each domain owns a service behind a typed contract."

```text
// Before: monolith owns everything
PHP monolith
  ├─ checkout logic
  ├─ loyalty / enrollment logic
  ├─ pricing + financials
  └─ cart/basket
frontend → one big shared surface
(change one thing, risk all of it)
```

```text
// After: federated subgraphs
GraphQL gateway (one graph)
  ├─ loyalty membership subgraph
  ├─ order financials subgraph
  └─ cart / basket subgraph
frontend → queries the composed graph
(each domain owns + evolves its slice)
```

![A checkout monolith decomposed into federated GraphQL subgraphs](/work/federated-checkout-graphql/federated_checkout_architecture.svg)

```md
Key shift:
Shared logic → split into domain-owned subgraphs
One big API → one composed graph over many services
Cross-team risk → contained behind typed contracts
```

## The architecture: boundaries, not big-bang

The hard part was drawing the lines. What belongs to loyalty? What belongs to checkout? Get that wrong and you just move the tangle around.

- **Boundaries follow product flows:** I drew service lines around how surfaces actually behave — checkout owns page-level purchase state; loyalty owns enrollment logic and membership data — rather than around technical layers.
- **Communicate through contracts, not internals:** instead of loyalty reaching into checkout's internals, the surfaces talk through typed GraphQL contracts and dispatched events. Loyalty says "the user hasn't decided yet"; checkout decides what to do about the page.
- **Migrate incrementally:** behavior moved out of the monolith piece by piece, preserving the existing experience, so we never had to freeze a revenue-critical system for a big-bang rewrite.

{% callout title="Key idea" %}
Good service boundaries come from understanding product flows, not just technical layers. The win wasn't "GraphQL" — it was that each team could finally own and evolve its slice behind a clear contract.
{% /callout %}

## Safety rails / production behavior

Decomposing a live commerce system is risky, so the migration was designed to be reversible and boring.

- **Incremental extraction:** move one piece at a time, keep behavior identical.
- **Typed contracts:** GraphQL schemas made breaking changes visible before they shipped.
- **Preserved behavior:** the customer experience stayed the same while the implementation moved underneath.
- **Clear ownership:** each subgraph had an owning team, so on-call and changes had a clear home.

## Evidence I'd show

- **Architecture diagram:** monolith-owns-everything vs. federated subgraphs composed into one graph.
- **Ownership boundary sketch:** which surface owns which state, and how they communicate through contracts.
- **RFC / design doc:** the written design for moving a domain out of the monolith incrementally.

## What this demonstrates

- I can decompose a legacy monolith without freezing product delivery.
- I draw service boundaries from product behavior, not just tech layers.
- I design typed contracts that contain risk across teams.
- I favor incremental, reversible migration on revenue-critical systems.
