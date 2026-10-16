---
title: Question
description: One or more clarifying questions, stepped through with radio/checkbox/custom-text answers and a sliding transition.
component: question
category: agents
tags: [question, prompt, form, agent]
---

`questions` is an array: one question is just an array of one, several are stepped through
in order with progress dots and a sliding entrance. Built entirely on this registry's own
primitives, real `RadioGroup`/`Checkbox`/`Input`, so keyboard navigation and screen-reader
semantics come from those, not reimplemented here.

## A single-select question moves on by itself

Picking an answer on a non-`multiple` question auto-advances after a beat, the same feel
as a real form. `multiple` questions and any question with `autoAdvance: false` wait for the
explicit next/submit control instead, since there's no way to know when someone's done
checking boxes.

## Controlled or uncontrolled, like the rest of this registry

`answers` and `step` both work either way: pass them with `onAnswersChange`/`onStepChange`
for a fully controlled flow, or `defaultAnswers`/`defaultStep` and let the component hold
its own state.
