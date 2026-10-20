---
title: Animated Beam
description: "A composable integrations diagram: logo nodes around a hub or in a row, joined by curved beams that pulses travel along."
component: animated-beam
category: animated
tags: [beam, integrations, connections, diagram, hub]
---

Use it where a landing page says "works with the tools you already use": your product in
the middle, the services it syncs with around it, and a pulse on each connection showing
data moving.

Built from parts. The root holds the nodes and beams and measures where each node sits; the
beam drawing and the node list read that, so either can be restyled or dropped:

```tsx
<AnimatedBeam nodes={nodes} beams={beams} center="app">
  <AnimatedBeamBeams />
  <AnimatedBeamNodes label="Connected tools" showLabels />
</AnimatedBeam>
```

Pass `nodes` and `beams` separately. A node can sit on several beams, so a row layout can
fan one source out to several targets, and a hub can link satellites to each other as well
as to the centre. `reverse` runs a beam's pulse from `to` back to `from`, for services that
receive data rather than send it.

Beams follow the rendered nodes, re-measured on resize, so the diagram stays aligned at any
width and with labels shown or hidden. Pulses stop while the diagram is offscreen or the
tab is hidden, and reduced motion leaves plain lines.

Node images are decorative; each node's `label` is what a screen reader hears, as an item
in a labelled list.

## Migrating

`<AnimatedBeam nodes={...} beams={...} showLabels label="..." />` used to draw the beams and
nodes itself. Keep the root's props and compose the parts above; `showLabels` and `label`
move to `AnimatedBeamNodes`.
