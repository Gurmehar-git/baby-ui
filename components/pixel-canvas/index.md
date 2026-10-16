---
title: Pixel Canvas
description: A full-bleed pixel grid that lights up in token colours around the pointer and fades behind it.
component: pixel-canvas
category: backgrounds
tags: [background, pixel, grid, cursor, canvas]
---

Cells inside the pointer radius light up and fade at `decay` once it moves on, even under `children`. The frame loop runs only while some cell is still changing, so a settled grid costs nothing.

Reduced motion lights and clears cells instantly with no trail. Colours come from theme tokens and resample on theme change.
