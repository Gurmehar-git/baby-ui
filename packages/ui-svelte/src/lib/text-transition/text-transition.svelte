<script lang="ts">
import { cn } from "../lib/cn";
import { TEXT_TRANSITION_PRESETS, type TextTransitionPreset } from "./presets";
import { type TextTransitionVariant, textTransition } from "./variants";

let {
	text,
	variant = "blur-out-up",
	durationMs,
	staggerMs,
	as = "span",
	class: classProp,
}: {
	text: string;
	variant?: TextTransitionVariant;
	/** Overrides the preset's own duration, in ms. */
	durationMs?: number;
	/** Overrides the preset's own per-unit stagger, in ms. */
	staggerMs?: number;
	as?: string;
	class?: string;
} = $props();

const basePreset = $derived(TEXT_TRANSITION_PRESETS[variant]);
const preset = $derived(
	durationMs === undefined && staggerMs === undefined
		? basePreset
		: {
				...basePreset,
				durationMs: durationMs ?? basePreset.durationMs,
				staggerMs: staggerMs ?? basePreset.staggerMs,
			},
);
const words = $derived(text.trim().split(/\s+/));
const characters = $derived([...text]);
const classes = $derived(textTransition({ variant }));
</script>

{#snippet unit(p: TextTransitionPreset, index: number, content: string)}
	<span
		class="text-transition-unit inline-block"
		style:--tt-duration="{p.durationMs}ms"
		style:--tt-delay="{index * p.staggerMs}ms"
		style:--tt-ease={p.easing ?? "var(--ease-ui-out)"}
		style:--tt-from-opacity={p.from.opacity ?? 1}
		style:--tt-from-x={p.from.x ?? "0px"}
		style:--tt-from-y={p.from.y ?? "0px"}
		style:--tt-from-scale={p.from.scale ?? 1}
		style:--tt-from-blur={p.from.blur ?? "0px"}
		style:--tt-from-rotate={p.from.rotate ?? "0deg"}
	>{content}</span>
{/snippet}

<svelte:element this={as} data-slot="text-transition" class={cn(classes, classProp)}>
	{#key `${text}-${variant}`}
		{#if preset.target === "whole"}
			{@render unit(preset, 0, text)}
		{:else if preset.target === "word"}
			{#each words as word, index (index)}
				{#if index > 0}{" "}{/if}{@render unit(preset, index, word)}
			{/each}
		{:else}
			{#each characters as char, index (index)}
				{#if char.trim() === ""}{char}{:else}{@render unit(preset, index, char)}{/if}
			{/each}
		{/if}
	{/key}
</svelte:element>
