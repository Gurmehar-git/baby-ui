---
title: Roll Text
description: "A label that rolls on hover like a flip-clock digit, or swaps to a second label on hover and click."
component: roll-text
category: text
tags: [text, roll, hover, flip, swap, toggle]
---

Two stacked copies of the label: the top slides up out of view, the bottom rises in to
replace it. `stagger` splits the roll across words or characters instead of moving the
whole label as one unit. `groupHover` plays it from a `[data-roll-group]` ancestor's
hover/focus instead of the element's own, which suits a card link.

Set `to` and it becomes a swap: a real `<button>` that previews `to` on hover and toggles to
it on click, controlled through `active`/`defaultActive`/`onActiveChange`.
