<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { setHeroStageMotion } from "./context";
import { type HeroStageMotion, heroStage } from "./variants";

type Props = {
	children: Snippet;
	class?: string;
	/** `scroll` scatters the slots and settles them as the page scrolls; `enter` only fades them in. */
	motion?: HeroStageMotion;
};

let { children, class: classProp, motion = "scroll" }: Props = $props();

setHeroStageMotion(() => motion);
const s = $derived(heroStage({ motion }));
</script>

<div data-slot="hero-stage" class={cn(s.root(), classProp)}>
	<div class={s.frame()}>{@render children()}</div>
</div>
