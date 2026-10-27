---
title: Aspect Ratio
description: "Responsive media frame that preserves proportions and can morph between ratios."
component: aspect-ratio
category: base
tags: [aspect-ratio]
---

`AspectRatio` reserves a media frame with `ratio={16 / 9}` style width-to-height values.
Its content layer fills the frame, so nearby layout stays stable while an image or embed loads.

`AspectRatioImage` requires intrinsic dimensions and alt text. `fit="cover"` crops without
stretching; `contain` keeps the whole image visible. Ratio changes use native CSS transitions:
`smooth` for a compact reshape, `spring` for a more expressive editor interaction, and `none`
for an immediate update. Reduced motion always resolves without movement.
