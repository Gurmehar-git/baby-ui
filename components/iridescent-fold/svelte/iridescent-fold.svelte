<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { type IridescentFoldOptions, mountIridescentFold } from "../fold";
import {
	IRIDESCENT_FOLD_COLORS,
	IRIDESCENT_FOLD_SPEED,
	type IridescentFoldPosition,
	type IridescentFoldSpeed,
	type IridescentFoldTone,
	type IridescentFoldVariant,
	iridescentFold,
} from "../variants";

let {
	variant = "foil",
	tone = "holo",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain = 0,
	class: classProp,
	children,
}: {
	variant?: IridescentFoldVariant;
	tone?: IridescentFoldTone;
	speed?: IridescentFoldSpeed;
	position?: IridescentFoldPosition;
	/** Effect strength, 0 to 2. */
	intensity?: number;
	/** Film grain, 0 to 1. */
	grain?: number;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountIridescentFold,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(iridescentFold({ variant, tone, speed, position, webgl: gl.webgl }));
const options: IridescentFoldOptions = $derived({
	colors: IRIDESCENT_FOLD_COLORS[tone],
	speed: IRIDESCENT_FOLD_SPEED[speed],
	intensity,
	grain,
	silk: variant === "silk",
});
</script>

<div bind:this={root} data-slot="iridescent-fold" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
