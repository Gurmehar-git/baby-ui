---
title: Reasoning
description: Collapsible chain-of-thought panel with steps, sources, images or trace rows; opens while thinking and closes when done.
component: reasoning
category: agents
tags: [reasoning, thinking, ai, steps, trace, tools]
---

Opens on its own while the model is reasoning and closes when it finishes, unless the
reader has toggled it; then their choice wins. Pass `open` to control it outright.

Children can be plain text or `ReasoningSteps`. Each `ReasoningStep` takes a `status`:
pending steps stay hidden, the active one's label previews under the collapsed title,
and done steps show a check. Nest `ReasoningStepDetails`, `ReasoningStepSources` and
`ReasoningStepImage` inside a step for detail.

For a flat trace, `ReasoningRows` takes `rows` and a `kind`: `steps` tick off (an
`active` row spins), `search` rows link to their sources under the `query`, and `coding`
rows are selectable files with +/- counts. `variant="inline"` drops the panel chrome for a
compact header over a thread line, the shape chat transcripts use.

`duration` is a prop, not a timer: the caller knows how long the model thought.

## Not a live region

Reasoning is supplementary to the answer. Marking it `aria-live` would have a screen
reader read the model's scratch work over the actual response.
