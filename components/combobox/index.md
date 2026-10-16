---
title: Combobox
description: A Popover whose content is a Command; shadcn/ui's own combobox recipe.
component: combobox
category: base
tags: [combobox, overlay]
---

There is no dedicated combobox engine. `ComboboxTrigger`/`ComboboxContent` are thin
`Popover` wrappers, and `ComboboxInput`/`List`/`Empty`/`Group`/`Item` are `Command`'s own
parts, re-exported under a combobox-friendly name. This is shadcn/ui's own combobox
pattern: compose two existing primitives instead of a third search engine.

## Search is substring matching, not fuzzy

`ComboboxInput` filters through the same `matches()` Command already uses elsewhere
(command palette, menus): a case-insensitive substring check against each item's value
and `keywords`. No separate fuzzy-search dependency to keep in sync with Command's own.

## Focus stays in the input

Arrow keys move `aria-activedescendant` between filtered results without focus ever
leaving the search field, so typing and navigating do not fight each other.

## The empty state is rendered

When nothing matches, the list stays open with a message rather than collapsing. A list
that vanishes leaves the user unsure whether it is filtering, loading, or broken.
