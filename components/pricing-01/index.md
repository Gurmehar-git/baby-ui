---
title: Pricing 01
description: A pricing section of plan cards that lift on hover while a note rises behind them, with a billing period toggle.
component: pricing-01
category: blocks
tags: [pricing, plans, billing, saas]
---

Plans carry one formatted price per billing period, so currency and rounding stay yours. The
period toggle appears once there are two periods and is controlled through `period`.

A plan's button links to `href`, or calls `onSelect` with the plan id and period; plans with
neither show no button. Composes `card`, `badge`, `button` and `toggle-group`.
