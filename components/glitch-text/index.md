---
title: Glitch Text
description: "RGB-split glitch on text: two coloured ghosts jitter while the label stays sharp on top."
component: glitch-text
category: text
tags: [text, glitch, rgb, animated]
---

Every offset is `em`-relative (`--glitch-step`), so the glitch scales with font-size
instead of needing separate tuning per size. `baseColor` inherits the surrounding text
colour by default; `colorA`/`colorB` are the two ghost layers (magenta/cyan by default).
