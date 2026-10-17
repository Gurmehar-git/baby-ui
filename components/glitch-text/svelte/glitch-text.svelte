<script lang="ts">
import { cn } from "../../lib/cn";
import { type GlitchTextBlendMode, type GlitchTextSize, glitchText } from "../variants";

let {
	text,
	size = "default",
	intensity,
	durationSeconds,
	baseColor,
	colorA,
	colorB,
	blendMode,
	class: classProp,
}: {
	text: string;
	size?: GlitchTextSize;
	intensity?: number;
	durationSeconds?: number;
	baseColor?: string;
	colorA?: string;
	colorB?: string;
	blendMode?: GlitchTextBlendMode;
	class?: string;
} = $props();

const style = $derived(
	[
		intensity !== undefined && `--glitch-intensity: ${intensity}`,
		durationSeconds !== undefined && `--glitch-duration: ${durationSeconds}s`,
		baseColor !== undefined && `--glitch-color-base: ${baseColor}`,
		colorA !== undefined && `--glitch-color-a: ${colorA}`,
		colorB !== undefined && `--glitch-color-b: ${colorB}`,
		blendMode !== undefined && `--glitch-blend-mode: ${blendMode}`,
	]
		.filter(Boolean)
		.join("; "),
);
</script>

<span data-slot="glitch-text" class={cn(glitchText({ size }), classProp)} style={style}>
	<span aria-hidden="true" class="glitch-text__ghost-a select-none">{text}</span>
	<span aria-hidden="true" class="glitch-text__ghost-b select-none">{text}</span>
	<span class="glitch-text__base">{text}</span>
</span>
