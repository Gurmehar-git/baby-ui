<script lang="ts">
import type { Snippet } from "svelte";
import { type CanvasEngine, canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { cn } from "../../lib/svelte/cn";
import { type AuroraFlowOptions, mountAuroraFlow } from "./aurora";
import { mountSilkAurora } from "./silk";
import {
	AURORA_FLOW_GRAIN,
	AURORA_FLOW_SPEED,
	type AuroraFlowPosition,
	type AuroraFlowSpeed,
	type AuroraFlowTone,
	type AuroraFlowVariant,
	auroraColors,
	auroraFlow,
} from "./variants";

let {
	variant,
	tone = "chart",
	speed = "normal",
	position = "absolute",
	intensity = 1,
	grain,
	direction = -18,
	interactive = true,
	class: classProp,
	children,
}: {
	variant: AuroraFlowVariant;
	tone?: AuroraFlowTone;
	speed?: AuroraFlowSpeed;
	position?: AuroraFlowPosition;
	intensity?: number;
	grain?: number;
	direction?: number;
	interactive?: boolean;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
// The parent keys this component on `variant`, so the engine choice is fixed for its life.
// svelte-ignore state_referenced_locally
const mount: CanvasEngine<AuroraFlowOptions> =
	variant === "silk" ? mountSilkAurora : mountAuroraFlow;
const gl = canvasEngine(
	mount,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(auroraFlow({ variant, tone, speed, position, webgl: gl.webgl }));
const options: AuroraFlowOptions = $derived({
	colors: auroraColors(variant, tone),
	speed: AURORA_FLOW_SPEED[speed],
	intensity,
	grain: grain ?? AURORA_FLOW_GRAIN[variant],
	direction,
	interactive,
});
</script>

<div bind:this={root} data-slot="aurora-flow" data-variant={variant} class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
