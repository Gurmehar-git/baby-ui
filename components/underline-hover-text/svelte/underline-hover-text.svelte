<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import {
	type UnderlineHoverTextTone,
	type UnderlineHoverTextTrigger,
	type UnderlineHoverTextVariant,
	underlineHoverText,
} from "./variants";

let {
	children,
	as = "span",
	href,
	variant = "sweep",
	tone = "default",
	trigger = "hover",
	durationMs = 500,
	class: classProp,
}: {
	children: Snippet;
	as?: string;
	/** With `as="a"`, the link target. */
	href?: string;
	variant?: UnderlineHoverTextVariant;
	tone?: UnderlineHoverTextTone;
	/** `hover` draws the stroke on hover and keyboard focus; `always` keeps it drawn. */
	trigger?: UnderlineHoverTextTrigger;
	/** How long the stroke takes, in ms. */
	durationMs?: number;
	class?: string;
} = $props();

const s = $derived(underlineHoverText({ variant, tone, trigger }));
</script>

{#snippet strokes()}
	{@render children()}
	<span aria-hidden="true" class={s.baseline()}></span>
	<span aria-hidden="true" class={s.stroke()}></span>
	<span aria-hidden="true" class={s.top()}></span>
{/snippet}

<!-- A real anchor when there is a target: a dynamic element's attributes cannot type `href`. -->
{#if href}
	<a
		{href}
		data-slot="underline-hover-text"
		data-variant={variant}
		class={cn(s.root(), classProp)}
		style="--uht-duration: {durationMs}ms;"
	>
		{@render strokes()}
	</a>
{:else}
	<svelte:element
		this={as}
		data-slot="underline-hover-text"
		data-variant={variant}
		class={cn(s.root(), classProp)}
		style="--uht-duration: {durationMs}ms;"
	>
		{@render strokes()}
	</svelte:element>
{/if}
