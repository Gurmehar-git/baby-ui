<script lang="ts">
import { cn } from "../../lib/cn";
import { type ShimmerTextSize, type ShimmerTextVariant, shimmerText } from "../variants";

let {
	text,
	durationMs = 2000,
	spread = 2,
	active = true,
	variant = "default",
	size = "inherit",
	as = "p",
	class: className,
}: {
	text: string;
	/** One sweep across the text, in ms. */
	durationMs?: number;
	/** Band half-width in px per character, so long text gets a wider band. */
	spread?: number;
	/** Sweep while work is ongoing; false settles the text to solid. */
	active?: boolean;
	variant?: ShimmerTextVariant;
	size?: ShimmerTextSize;
	as?: string;
	class?: string;
} = $props();
</script>

<svelte:element
	this={as}
	data-slot="shimmer-text"
	data-active={active}
	aria-busy={active || undefined}
	class={cn(shimmerText({ variant, size }), className)}
	style:--shimmer-spread="{text.length * spread}px"
	style:--shimmer-duration="{durationMs}ms">{text}</svelte:element
>
