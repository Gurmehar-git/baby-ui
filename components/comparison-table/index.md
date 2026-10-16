---
title: Comparison Table
description: "A feature matrix for plans or products: prices with a billing switch, grouped rows of checks and limits, and a differences-only filter."
component: comparison-table
category: blocks
tags: [comparison, compare, plans, pricing, features, matrix, table]
---

Composes `switch`, `toggle-group`, `button` and `rolling-digits`. Give each column a `price`
as one number, or `{ monthly, yearly }` to show a billing switch whose prices count to the new
period. A `highlight` column is tinted; an `action` without `href` selects its column.

Row values read `true`, `false`, `"partial"`, plain text, or `{ value, note }` for a short
qualifier under the mark. "Differences only" folds away every row where all columns agree.
