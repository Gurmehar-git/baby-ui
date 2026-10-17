<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { canvasEngine } from "../../lib/svelte/canvas-engine.svelte";
import { type LiquidChromeOptions, mountLiquidChrome } from "../chrome";
import {
	LIQUID_CHROME_COLORS,
	LIQUID_CHROME_SPEED,
	type LiquidChromePosition,
	type LiquidChromeSpeed,
	type LiquidChromeTone,
	liquidChrome,
} from "../variants";

let {
	tone = "chrome",
	speed = "normal",
	position = "absolute",
	amplitude = 0.6,
	interactive = true,
	class: classProp,
	children,
}: {
	tone?: LiquidChromeTone;
	speed?: LiquidChromeSpeed;
	position?: LiquidChromePosition;
	/** Domain-warp depth of the metal, 0 to 1.5. */
	amplitude?: number;
	/** The surface bulges away from the pointer instead of the centre. */
	interactive?: boolean;
	class?: string;
	children?: Snippet;
} = $props();

let root: HTMLDivElement | undefined = $state();
let canvas: HTMLCanvasElement | undefined = $state();
const gl = canvasEngine(
	mountLiquidChrome,
	() => ({ root, canvas }),
	() => options,
);
const s = $derived(liquidChrome({ tone, speed, position, webgl: gl.webgl }));
const options: LiquidChromeOptions = $derived({
	colors: LIQUID_CHROME_COLORS[tone],
	speed: LIQUID_CHROME_SPEED[speed],
	amplitude,
	interactive,
});
</script>

<div bind:this={root} data-slot="liquid-chrome" class={cn(s.root(), classProp)}>
	<div aria-hidden="true" class={s.fallback()}></div>
	<canvas bind:this={canvas} aria-hidden="true" class={s.canvas()}></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
