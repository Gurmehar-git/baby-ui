---
title: Wall Hero
description: "A landing hero with brand, headline, an install command and actions beside a tilted wall of your own cards drifting past in columns."
component: wall-hero
category: blocks
tags: [hero, landing, wall, marquee, showcase]
---

Composes `copy-button`. Put your own components on the wall: they render twice per column for
the seamless loop, inert and hidden from assistive tech.

Built from parts:

```tsx
<WallHero>
  <WallHeroContent>
    <WallHeroBrand><Logo /> Acme</WallHeroBrand>
    <WallHeroTitle>Components with calm motion</WallHeroTitle>
    <WallHeroDescription>Composable parts for React and Svelte.</WallHeroDescription>
    <WallHeroCommand command="npx shadcn@latest add @baby-ui/wall-hero" />
    <WallHeroActions>
      <Button href="/docs">Get started</Button>
    </WallHeroActions>
  </WallHeroContent>
  <WallHeroWall>
    <WallHeroColumn duration="70s">
      <WallHeroCard><Progress label="Setup" value={60} showValue /></WallHeroCard>
    </WallHeroColumn>
    <WallHeroColumn direction="down" duration="85s">{/* cards */}</WallHeroColumn>
    <WallHeroColumn duration="78s">{/* cards */}</WallHeroColumn>
  </WallHeroWall>
</WallHero>
```

`split` puts the wall beside the copy and stacks it underneath in narrow containers; `backdrop`
runs it behind centred copy with a soft veil. Three columns fill the plane; give each its own
`duration` so they never line up. Set `--wall-hero-duration` to change the default pace.
