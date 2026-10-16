---
title: Blog Grid
description: "A blog index with category filters, a featured post and paged cards, plus an in-place reader whose image morphs out of its card."
component: blog-grid
category: blocks
tags: [blog, posts, articles, grid, journal, pagination, filter]
---

Composes `toggle-group`, `pagination`, `avatar` and `button`. Posts sort newest first;
`variant="featured"` leads page one with the post marked `featured` (or the newest) as a wide
card.

With `getHref`, cards are plain links to your post pages. Without it, a card opens the post in
place: its image morphs into the reader through a view transition where the browser supports
one. `category`, `page` and `openPost` are all controllable.
