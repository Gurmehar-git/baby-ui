<script lang="ts">
import {
	OrbitHero,
	OrbitHeroAction,
	OrbitHeroActions,
	OrbitHeroContent,
	OrbitHeroDescription,
	OrbitHeroSubheading,
	OrbitHeroTitle,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { ORBIT_GLYPHS, ORBIT_GROUPS, ORBIT_HERO } from "../data/orbit-hero";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof OrbitHero>>(props));
</script>

<OrbitHero
	interval={p.interval}
	variant={p.variant}
	size={p.size ?? "section"}
	groups={ORBIT_GROUPS}
>
	{#snippet item(name)}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			{#each ORBIT_GLYPHS[name] ?? [] as [d, faded], i (i)}
				<path {d} opacity={faded ? 0.5 : undefined} />
			{/each}
		</svg>
	{/snippet}
	<OrbitHeroContent>
		<OrbitHeroTitle>
			{ORBIT_HERO.headline}
			<OrbitHeroSubheading>{ORBIT_HERO.subheading}</OrbitHeroSubheading>
		</OrbitHeroTitle>
		<OrbitHeroDescription>{ORBIT_HERO.description}</OrbitHeroDescription>
		<OrbitHeroActions>
			{#each ORBIT_HERO.actions as action, i (action.label)}
				<OrbitHeroAction href={action.href} target={action.target} variant={i === 0 ? "default" : "outline"}>
					{action.label}
				</OrbitHeroAction>
			{/each}
		</OrbitHeroActions>
	</OrbitHeroContent>
</OrbitHero>
