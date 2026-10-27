---
title: Dialog
description: Centred dialog on the platform top layer, composed from trigger, content, header, title, description and footer.
component: dialog
category: base
tags: [dialog, modal]
---

Base UI and bits-ui own focus trapping, outside dismissal, inertness and restoring focus to
the trigger. The component keeps the shadcn part names while adding one shared visual and
motion contract across React and Svelte.

## Motion with a reason

`motion="zoom"` is the neutral default. `fade` is quieter, the four slide directions preserve
an edge relationship, and `morph` unfolds the surface from its centre. Every exit retraces its
entrance; morph stays opaque and folds fully back into its centre instead of fading away during
the collapse. Reduced motion removes travel, scale and clipping.
