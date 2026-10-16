---
title: Scroll Reveal
description: Reveals text word by word as an inner container scrolls.
component: scroll-reveal
category: text
tags: [text, scroll, reveal, reading]
---

One scroll listener sets a single `--sr-progress` custom property on the container;
every word derives its own reveal fraction from that with a CSS `calc()`, so nothing
runs per word on scroll.
