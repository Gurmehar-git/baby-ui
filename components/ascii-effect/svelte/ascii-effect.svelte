<script lang="ts">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { type AsciiOptions, mountAscii } from "../ascii";
import {
	type AsciiEffectDither,
	type AsciiEffectFit,
	type AsciiEffectPosition,
	type AsciiEffectTone,
	type AsciiEffectVariant,
	asciiEffect,
} from "../variants";

let {
	src,
	alt,
	variant = "image",
	tone = "mono",
	chars = " .:-=+*#%@",
	fontSize = 10,
	contrast = 1.1,
	brightness = 1.2,
	dither = "floyd-steinberg",
	invert = false,
	fit = "cover",
	speed = 1,
	position,
	children,
	class: className,
}: {
	/** Image URL; must be same-origin or served with CORS so its pixels can be read. */
	src: string;
	/** Describes the image; omit when the effect is purely decorative. */
	alt?: string;
	/** `image` is still, `flow` drifts and ripples under the pointer, `glitch` tears rows. */
	variant?: AsciiEffectVariant;
	/** Token colour ramp by brightness, or `source` for the image's own colours. */
	tone?: AsciiEffectTone;
	/** Glyph ramp from sparse to dense. */
	chars?: string;
	/** Glyph size in px. */
	fontSize?: number;
	contrast?: number;
	brightness?: number;
	dither?: AsciiEffectDither;
	/** Flip the brightness mapping. */
	invert?: boolean;
	fit?: AsciiEffectFit;
	/** Flow drift or glitch frequency multiplier; 0 holds a still frame. */
	speed?: number;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: AsciiEffectPosition;
	/** Rendered above the glyphs. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(asciiEffect({ variant, tone, dither, fit, position }));
const options: AsciiOptions = $derived({
	src,
	variant,
	tone,
	chars,
	fontSize,
	contrast,
	brightness,
	dither,
	invert,
	fit,
	speed,
});

let root = $state<HTMLDivElement>();
let canvas = $state<HTMLCanvasElement>();
let engine: ReturnType<typeof mountAscii> | undefined;

$effect(() => {
	if (!root || !canvas) return;
	engine = mountAscii(
		root,
		canvas,
		untrack(() => $state.snapshot(options)),
	);
	return () => engine?.destroy();
});

$effect(() => {
	const next = $state.snapshot(options);
	engine?.update(next);
});
</script>

<div bind:this={root} data-slot="ascii-effect" class={cn(s.root(), className)}>
	<canvas
		bind:this={canvas}
		role={alt ? "img" : undefined}
		aria-label={alt || undefined}
		aria-hidden={alt ? undefined : "true"}
		class={s.canvas()}
	></canvas>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
