---
title: Chart
description: "The chart base: container, config, grid, axes, tooltip and legend, on d3 and SVG."
component: chart
category: charts
tags: [chart, graph, data, visualization]
---

Every chart installs this first. It has shadcn's part names (`ChartContainer`, `ChartConfig`,
`ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`), so shadcn chart
markup ports over with the recharts pieces swapped for ours.

## Colour

Series read `var(--color-<key>)`, set per chart from `config`. Point `color` at
`--chart-1` to `--chart-5`: that order passes colour-blind separation in both themes, so
assign it in sequence and never reorder by rank.

## Keyboard and screen readers

The plot takes focus. Arrow keys walk the points, and each move is announced. A generated
summary and a visually hidden data table ship with every chart; pass `description` to
replace the summary. Legend entries are toggles, so hiding a series works from the keyboard.

## Motion

Charts use a small tween and spring kernel for what CSS cannot move (scales, paths,
springs). Fades and dims stay CSS. Under reduced motion everything lands on its end state.
