<script lang="ts">
import {
	GradientHero01,
	GradientHero01Action,
	GradientHero01Actions,
	GradientHero01Badge,
	GradientHero01Content,
	GradientHero01Description,
	GradientHero01Install,
	GradientHero01Meta,
	GradientHero01Title,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { GRADIENT_HERO_01 as copy } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof GradientHero01>>(props));
</script>

<GradientHero01 tone={p.tone} size={p.size}>
	<GradientHero01Content>
		<GradientHero01Badge>{copy.badge}</GradientHero01Badge>
		<GradientHero01Title>{copy.headline}</GradientHero01Title>
		<GradientHero01Description>{copy.description}</GradientHero01Description>
		<GradientHero01Actions>
			{#each copy.actions as action, i (action.label)}
				<GradientHero01Action href={action.href} variant={i === 0 ? "default" : "outline"}>
					{action.label}
				</GradientHero01Action>
			{/each}
		</GradientHero01Actions>
		<GradientHero01Install command={copy.install} />
		<GradientHero01Meta>
			{#each copy.meta as fact (fact)}
				<li>{fact}</li>
			{/each}
		</GradientHero01Meta>
	</GradientHero01Content>
</GradientHero01>
