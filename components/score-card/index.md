---
title: Score Card
description: "A single headline metric on a dial: health scores, grades, NPS, uptime."
component: score-card
category: blocks
tags: [score, gauge, health score, nps, uptime, card]
---

Built from parts: `ScoreCardHeader` holds `ScoreCardTitle`, an optional
`ScoreCardDescription` and an optional `ScoreCardTrend` badge for the change since the last
reading. `ScoreCardContent` holds `ScoreCardGauge`, which takes every gauge chart prop
(`value`, `min`, `max`, `label`, `tone`, `layout`). `size` on `ScoreCard` sets the dial width.
