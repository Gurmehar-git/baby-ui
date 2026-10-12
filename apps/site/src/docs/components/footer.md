---
title: Footer
description: "Marketing site footer: brand and socials, link columns, an optional giant wordmark."
component: footer
category: blocks
tags: [footer, links, marketing, wordmark]
---

Brand, description and socials sit beside a grid of link columns. Both are plain content
props, and the component ships no sample data of its own.

## The wordmark is optional

`wordmark` is a giant `background-clip: text` sheen across the foot of the footer. Omit it
and that whole section doesn't render: it's not a fixed piece of decoration baked into the
component.

## Notched layout

`layout="notched"` rounds the top corners and hangs a [Notched Shelf](/components/blocks/notched-shelf)
tab from the top edge, linking to `topHref`. The tab only renders with a `topHref`. Socials
become text links, column titles turn into small mono labels, and `copyright`, `legal` and
`actions` move into a ruled row along the bottom.

```svelte
<Footer layout="notched" topHref="#top" {columns} {legal} description="A small lab that makes developer tools.">
	{#snippet actions()}<ThemeToggle {theme} {onThemeChange} />{/snippet}
</Footer>
```

A link's `description` adds a muted second line, which suits a products column (name,
then what it is).

`layout="minimal"` folds everything into one quiet row: brand, every link and the copyright.
`status` adds a system status link with a dot that pulses in its tone (`success`, `warning`
or `destructive`). External links show an outward arrow in every layout.
