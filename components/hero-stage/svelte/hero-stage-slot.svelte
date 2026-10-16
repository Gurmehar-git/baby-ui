<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { getHeroStageMotion } from "./context";
import { heroStage } from "./variants";

type Props = {
	children: Snippet;
	class?: string;
	/** Entrance order; each step delays the slot by 110ms. */
	index?: number;
	/** Scattered offset in px and tilt in degrees, before scrolling settles it. */
	x?: number;
	y?: number;
	rotate?: number;
};

let { children, class: classProp, index = 0, x = 0, y = 0, rotate = 0 }: Props = $props();

const motion = getHeroStageMotion();
const s = $derived(heroStage({ motion: motion() }));
</script>

<div data-slot="hero-stage-slot" class={cn(s.slot(), classProp)} style:--i={index}>
	<div class={s.card()} style:--sx="{x}px" style:--sy="{y}px" style:--sr="{rotate}deg">
		{@render children()}
	</div>
</div>
