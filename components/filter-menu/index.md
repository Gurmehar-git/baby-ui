---
title: Filter Menu
description: "Grouped filters as checkboxes in folding groups, with the picks on top as removable chips and a count on each group."
component: filter-menu
category: blocks
tags: [filters, facets, chips, checkbox, refine]
---

Composes `accordion`, `checkbox`, `badge` and `button`. Use it beside a list or table to narrow it
by several facets at once, or inside a popover behind a Filters button.

Built from parts:

```tsx
<FilterMenu groups={groups} value={filters} onValueChange={setFilters}>
  <FilterMenuHeader>
    <FilterMenuTitle>Filters</FilterMenuTitle>
    <FilterMenuClear />
  </FilterMenuHeader>
  <FilterMenuChips />
  <FilterMenuGroups />
</FilterMenu>
```

`groups` lists each facet and its options; `chipPrefix` goes in front of an option on its chip,
so a Score group with `chipPrefix: "Score: "` reads "Score: 80 to 90". `value` maps group ids to
picked option ids; it is controlled with `onValueChange` and bindable in Svelte, so apply it to
your query from there. `open` holds the open groups; the first starts open.

`variant="plain"` drops the frame for use inside a popover or a sidebar.
