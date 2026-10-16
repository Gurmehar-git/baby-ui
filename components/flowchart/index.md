---
title: Flowchart
description: "A workflow canvas: draggable nodes joined by a measured bezier connector."
component: flowchart
category: advanced
tags: [flowchart, workflow, canvas, diagram, agent]
---

Nodes drag anywhere on the dotted canvas; the connector between them recomputes from each
node's real, measured height rather than an assumed one. A node with `conditions` renders
an If/Else row set instead of a plain title/caption card.

## Built on the real Select

Condition rows pick values through this registry's own `Select`, not a hand-rolled
absolutely-positioned popup with its own outside-click listener; positioning, dismissal
and keyboard handling all come from that primitive.

## No fictional default

`steps` is required: the nodes, their titles, captions and condition data are the whole
point of the canvas, so there's no built-in sample workflow.
