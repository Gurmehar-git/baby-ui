---
title: Pricing 01
description: A pricing section of plan cards that lift on hover while a note rises behind them, with a billing period toggle.
component: pricing-01
category: blocks
tags: [pricing, plans, billing, saas]
---

Each `Pricing01Plan` is a card from parts: a header with `Pricing01PlanName`, an optional
`Pricing01PlanBadge` and `Pricing01PlanPrice`, then the description and features, then
`Pricing01PlanAction` in the footer (a link with `href`, or a button with `onClick`).

`Pricing01PlanPrice` takes one formatted price per billing period, so currency and rounding
stay yours. `Pricing01Periods` appears once there are two periods and is controlled through
`period` on the root. Composes `card`, `badge`, `button` and `toggle-group`.
