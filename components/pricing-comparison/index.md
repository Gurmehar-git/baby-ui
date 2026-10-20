---
title: Pricing Comparison
description: "Feature matrix for plans: a real table with a sticky plan header, collapsible groups, a highlighted column and a show differences only switch, with a plan picker on narrow screens."
component: pricing-comparison
category: blocks
tags: [pricing, comparison, feature matrix, plans, table, compare, saas]
---

Needs `switch` and `tabs`. Put it under Pricing Plans so the cards stay short and the details
live in one table.

Built from parts. The root holds the data and the controlled state; the parts read it:

```tsx
<PricingComparison plans={plans} groups={groups}>
  <PricingComparisonToolbar>
    <PricingComparisonDifferences />
  </PricingComparisonToolbar>
  <PricingComparisonTable />
  <PricingComparisonMobile />
  <PricingComparisonEmpty />
</PricingComparison>
```

Drop the toolbar to hide the switch, put your own controls beside it, or pass children to
`PricingComparisonEmpty` to replace the "nothing differs" message.

Each row maps plan ids to `true`, `false` or a short string such as "5" or "Priority". A plan
missing from `values` reads as not included. Checks and crosses carry "Included" and "Not
included" for screen readers, and a row's `hint` sits under the feature name.

The plan header sticks while the table scrolls. Set `--pricing-comparison-top` on a parent to
clear a fixed site header, e.g. `[--pricing-comparison-top:3.5rem]`. Mark one plan
`highlighted` to outline its column.

Show differences only collapses rows that read the same on every plan, and whole groups when
nothing in them differs. Groups collapse from their header. Both states are controlled
(`differencesOnly`, `collapsedGroups`) so a page can remember them.

Below the container's 2xl width the table swaps for a plan picker and a single plan list, so
nothing scrolls sideways. `activePlanId` controls the picker and defaults to the highlighted
plan.

## Migrating

`<PricingComparison plans={...} groups={...} />` used to render the toolbar, table and plan
picker itself. Keep the root's props as they are and add the parts above inside it.
