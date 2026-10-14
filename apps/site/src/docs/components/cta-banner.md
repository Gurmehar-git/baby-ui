---
title: CTA Banner
description: "A closing call to action built from parts: a grain surface with drifting icons, inclined rows of a running wordmark, or a dark card lit around the pointer."
component: cta-banner
category: blocks
tags: [cta, banner, closing, grain, ticker, spotlight, landing]
---

Built from parts, like any shadcn component. `CtaBanner` is the section and sets `variant`,
`size`, `tint` and `speed`; every part styles itself from it.

- Surface: one of `CtaBannerGrain` (plus any `CtaBannerFloater`), `CtaBannerTicker` or
  `CtaBannerSpotlight`.
- Copy: `CtaBannerContent` holding `CtaBannerBadge`, `CtaBannerEyebrow`, `CtaBannerTitle`,
  `CtaBannerDescription`, `CtaBannerActions` and `CtaBannerNote`.

The section is labelled by `CtaBannerTitle`. `tint` takes any CSS colour and defaults to
#05845f for grain, #0066ff for ticker and `--primary` for spotlight. Grain and ticker put white
text on the tint, so keep it dark enough for 4.5:1. `speed` scales every loop inside.

## Grain

```tsx
<CtaBanner variant="grain">
  <CtaBannerGrain noise={0.4} lines />
  <CtaBannerFloater x="10%" y="20%" delay={0}>
    <FileIcon />
  </CtaBannerFloater>
  <CtaBannerContent>
    <CtaBannerBadge><LayersIcon /></CtaBannerBadge>
    <CtaBannerTitle>One spec. Two frameworks.</CtaBannerTitle>
    <CtaBannerNote>
      No account. <strong>The source lands in your repo.</strong>
    </CtaBannerNote>
  </CtaBannerContent>
</CtaBanner>
```

Light bands, an SVG noise tile and hairline rules over the tint. Each floater drifts and
breathes on its own `duration` and `delay`; place as many as you like with `x` and `y`. A
`<strong>` inside the note becomes its emphasised second line.

## Ticker

```tsx
<CtaBanner variant="ticker">
  <CtaBannerTicker word="Acme" mark={<StarIcon />} angle={-38} rows={32} veil />
  <CtaBannerContent>...</CtaBannerContent>
</CtaBanner>
```

Rows of `word` run inclined at `angle`, alternate rows reversed. They pause while off screen
and show from a 56rem container. `veil` blurs the rows behind the copy.

## Spotlight

```tsx
<CtaBanner variant="spotlight">
  <CtaBannerSpotlight radius={420} grid sweep />
  <CtaBannerContent>
    <CtaBannerEyebrow>React and Svelte</CtaBannerEyebrow>
    ...
  </CtaBannerContent>
</CtaBanner>
```

A dark surface lit by the tint from above. The 1px edge, a brighter copy of the grid and a soft
light follow the pointer; `sweep` runs a highlight along the top edge.
