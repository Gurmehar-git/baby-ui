---
title: Orbit Hero
description: "A hero whose headline sits over two counter-rotating rings of icons, with a centre dial that swaps the set and its colour."
component: orbit-hero
category: blocks
tags: [hero, landing, orbit, icons, rings, showcase]
---

A landing hero for anything with a catalogue: icon sets, integrations, features. The rings turn on
their own, speed up with page scroll, and pause off screen.

Pass `groups` of plain values and draw each one yourself, so any icon library works. The top half
of the centre dial cycles groups, the bottom half cycles `tones`; both change on their own every
`interval` ms until you set it to 0.

The copy is built from parts: `OrbitHeroContent` holds `OrbitHeroBadge`, `OrbitHeroTitle`
(with an optional `OrbitHeroSubheading`), `OrbitHeroDescription` and `OrbitHeroActions`.

```svelte
// tab: Svelte
<OrbitHero groups={GROUPS}>
	{#snippet item(Icon)}
		<Icon />
	{/snippet}
	<OrbitHeroContent>
		<OrbitHeroTitle>Every icon your product needs</OrbitHeroTitle>
	</OrbitHeroContent>
</OrbitHero>
```

```tsx
// tab: React
<OrbitHero groups={GROUPS} renderItem={(Icon) => <Icon />}>
	<OrbitHeroContent>
		<OrbitHeroTitle>Every icon your product needs</OrbitHeroTitle>
	</OrbitHeroContent>
</OrbitHero>
```

Items are drawn at 32px on a 48px slot; ten on the outer ring and six on the inner read best.
