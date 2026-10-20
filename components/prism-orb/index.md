---
title: Prism Orb
description: A refracting glass sphere drifting over prism bands, with chromatic dispersion at its rim.
component: prism-orb
category: backgrounds
tags: [background, prism, orb, glass, refraction, dispersion, webgl, hero]
---

A hero backdrop with one focal object. Prism bands swirl behind a glass sphere, and inside it each colour channel bends by a different amount, so the rim splits into a thin spectrum. On a mouse or trackpad the sphere leans a little toward the cursor.

`tone` picks the token colours, `intensity` fades the scene toward the base colour for busier layouts, and `grain` adds film grain.

Frames are capped at 30 per second on a low-power WebGL context and stop offscreen, in a hidden tab or when `speed` is 0. Reduced motion draws one still frame. Without WebGL a gradient in the same tokens shows instead.
