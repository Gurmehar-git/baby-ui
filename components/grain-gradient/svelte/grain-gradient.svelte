<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	type GrainGradientPosition,
	type GrainGradientTone,
	grainGradient,
	grainTexture,
} from "../variants";

let {
	tone,
	position,
	angle = 0,
	grain = 0.35,
	grainSize = 1,
	duration = 12,
	children,
	class: className,
}: {
	tone?: GrainGradientTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: GrainGradientPosition;
	/** Composition rotation in degrees. */
	angle?: number;
	/** Grain strength, 0 to 1. */
	grain?: number;
	/** Grain coarseness, 0.5 to 4. */
	grainSize?: number;
	/** Seconds for one breath. */
	duration?: number;
	/** Rendered above the gradient. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(grainGradient({ tone, position }));
const texture = $derived(grainTexture(grainSize));
</script>

<div
	data-slot="grain-gradient"
	class={cn(s.root(), className)}
	style="--grain-gradient-angle: {angle}deg; --grain-gradient-duration: {duration}s"
>
	<div aria-hidden="true" class={s.scene()}>
		<div class={s.glow()}></div>
		<div class={s.shadow()}></div>
	</div>
	<div
		aria-hidden="true"
		class={s.grain()}
		style:opacity={grain}
		style:background-image={texture}
	></div>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
