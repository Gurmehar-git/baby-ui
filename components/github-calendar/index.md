---
title: GitHub Calendar
description: "A contribution heatmap: one cell per day in week columns, with a tooltip per day and a colour legend."
component: github-calendar
category: blocks
tags: [github, contributions, calendar, heatmap, activity]
---

Pass one entry per day; the component fills gaps with zero, lays days out in week columns and
picks five levels from quarters of the busiest day, or from `thresholds`. It never fetches:
load contributions from GitHub's GraphQL API or any other source yourself.

The grid is one tab stop. Arrow keys move a day or a week, each cell opens its tooltip on
focus, and Enter selects a day through the controlled `value`. Composes `tooltip`.
