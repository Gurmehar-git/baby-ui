<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { type GradientTextTone, gradientText } from "./variants";

let {
	children,
	as = "span",
	tone = "primary",
	durationSeconds = 3,
	class: classProp,
}: {
	children: Snippet;
	as?: string;
	tone?: GradientTextTone;
	/** One full sweep cycle, in seconds. */
	durationSeconds?: number;
	class?: string;
} = $props();
</script>

<svelte:element
	this={as}
	data-slot="animated-gradient-text"
	class={cn(gradientText({ tone }), classProp)}
	style="--agt-duration: {durationSeconds}s;"
>
	{@render children()}
</svelte:element>
