---
slug: lacuna-mentors
collection: work
order: 3
eyebrow: Lacuna Mentors · Zero-to-one marketplace
title: Building a Mentorship Marketplace from Zero to 60+ Mentors
summary: I co-founded and built a marketplace where high schoolers book time with college mentors on the spot, shipping it end-to-end to 60+ mentors and real bookings.
impact: Built a custom scheduling system on the mentor's own calendar, replacing per-seat tools and saving ~$900/month as supply grew.
hero:
  src: /work/lacuna-mentors/lacuna-hero.png
  alt: Lacuna Mentors landing page — "Discover the mentors you need"
tags:
  - Next.js
  - React
  - TypeScript
  - Supabase
  - Marketplace
  - Scheduling
---

# Building a Mentorship Marketplace from Zero to 60+ Mentors

I co-founded and built Lacuna Mentors, a marketplace where high school students discover college mentors and book time with them on the spot, and I shipped it end-to-end to 60+ mentors and real bookings.

## About

Lacuna was a two-sided marketplace: college students who had recently been through the admissions process on one side, and high schoolers who wanted that guidance on the other.

I was the sole engineer. My co-founder ran the business and recruited mentors. My job was to turn "students should be able to find a mentor and book a session" into a live product people actually used.

- let mentors onboard and manage their availability with almost no friction
- let students browse mentors and find someone relevant
- let students book a real session on the spot
- do all of this without paying per-seat pricing for every mentor

{% callout title="Helpful references" %}
- [Two-sided marketplace](https://en.wikipedia.org/wiki/Two-sided_market)
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/docs)
- [Microsoft Graph calendar API](https://learn.microsoft.com/en-us/graph/api/resources/calendar)
{% /callout %}

## Why this existed

Neither my co-founder nor I had access to college mentorship growing up. We figured students applying to college would pay to talk to someone who had actually been through it recently, not a generic counselor.

The bet was simple: recent, relatable guidance is valuable, and the supply (college students) is motivated and cheap to reach. The hard part was making that exchange smooth enough that both sides showed up.

{% callout title="The real goal" %}
The goal was to validate a marketplace quickly, not to overbuild. Every engineering decision was about reaching a live, bookable product with the least wasted effort.
{% /callout %}

We secured $2,500 in early funding and were accepted into Boston University's "Innovation Pathway" venture program, which gave us the runway to build and test the idea with real users.

## The problem: build the whole loop without overbuilding

A marketplace only works if the entire loop works. A student who finds a great mentor but cannot book time has a broken product. A mentor who cannot manage availability stops showing up.

- Mentors needed low-friction onboarding and availability management.
- Students needed to discover relevant mentors and book time easily.
- Off-the-shelf scheduling tools charged per seat, which does not scale to a growing roster of mentors.
- As the sole engineer, I could not afford to gold-plate any single piece.

So I built around the highest-value loops first and left everything else manual until it was worth automating.

## Problem: Scheduling

The hardest and most expensive piece was scheduling. Tools like Calendly charge per seat, so every new mentor would have added recurring cost, exactly the wrong shape for a marketplace trying to grow supply.

{% callout title="What to notice" %}
The "before" scales cost with every mentor you add. The "after" scales for free as supply grows.
{% /callout %}

```text
// Before: per-seat scheduling tool
Every mentor = one paid seat
- ~$15/mentor/month on off-the-shelf tools
- cost grows linearly with supply
- generic booking UX, not marketplace-aware
- ~$900/month projected at our roster size
```

```text
// After: custom scheduling on calendar APIs
Mentors connect their own calendar
- built on Microsoft Outlook / Graph calendar API
- students see live availability, book on the spot
- booking UX lives inside our marketplace
- ~$0 marginal cost per additional mentor
```

![Custom scheduling architecture diagram](/work/lacuna-mentors/lacuna_scheduling_architecture.svg)

```md
Key shift:
Availability source → the mentor's real calendar (via API)
Booking UX → owned inside the marketplace
Cost model → fixed instead of per-seat
```

## Architecture

I made a few deliberate tradeoffs to reach a live product fast.

- **Full-stack on a lean stack:** Next.js, React, TypeScript, and Tailwind on the front end, Supabase for the relational data model and auth, deployed on Vercel. One person could own the whole thing.
- **Custom scheduling, not per-seat SaaS:** built scheduling on top of the mentor's own calendar (Microsoft Outlook / Graph API) so students could see availability and book directly, with no per-mentor licensing cost.
- **Manual ops where automation wasn't worth it:** admin and edge-case operations were handled by hand early on. I only automated a workflow once real usage proved it mattered.

![Relational data model for users, mentors, availability, and bookings](/work/lacuna-mentors/lacuna_data_model.svg)

{% callout title="Key idea" %}
Prioritize by talking to users, not by guessing. I decided what to build next based on real mentor and student conversations instead of a speculative roadmap.
{% /callout %}

