<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { testimonial } from "../variants";
import { getTestimonial } from "./context";

let {
	children,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const context = getTestimonial();
const s = $derived(testimonial({ variant: context.variant }));
</script>

<span data-slot="testimonial-verified-badge" role="img" aria-label="Verified" class={cn(s.badge(), classProp)} {...rest}>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
			<path d="m8 1.5 1.6 1.2 2-.1.6 1.9 1.7 1-.6 1.9.6 1.9-1.7 1-.6 1.9-2-.1L8 14.5l-1.6-1.2-2 .1-.6-1.9-1.7-1 .6-1.9-.6-1.9 1.7-1 .6-1.9 2 .1L8 1.5Zm2.7 4.1L7.2 9.1 5.4 7.3 4.3 8.4l2.9 2.9 4.6-4.6-1.1-1.1Z" />
		</svg>
	{/if}
</span>
