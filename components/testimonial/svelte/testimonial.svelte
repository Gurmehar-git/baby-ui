<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type TestimonialVariant, testimonial } from "../variants";
import { setTestimonial } from "./context";

let {
	children,
	variant = "card",
	class: classProp,
	onpointermove,
	...rest
}: HTMLAttributes<HTMLElement> & {
	children: Snippet;
	variant?: TestimonialVariant;
} = $props();
const s = $derived(testimonial({ variant }));

setTestimonial({
	get variant() {
		return variant;
	},
});
</script>

<figure
	data-slot="testimonial"
	data-variant={variant}
	class={cn(s.root(), classProp)}
	onpointermove={(event) => {
		onpointermove?.(event);
		if (variant !== "spotlight" || event.defaultPrevented) return;
		const rect = event.currentTarget.getBoundingClientRect();
		event.currentTarget.style.setProperty("--testimonial-x", `${event.clientX - rect.left}px`);
		event.currentTarget.style.setProperty("--testimonial-y", `${event.clientY - rect.top}px`);
	}}
	{...rest}
>
	{#if variant === "spotlight"}
		<span
			aria-hidden="true"
			class={s.spotlight()}
			style:background="radial-gradient(circle at var(--testimonial-x, 50%) var(--testimonial-y, 50%), color-mix(in oklab, var(--foreground) 14%, transparent), transparent 60%)"
		></span>
	{/if}
	{@render children()}
</figure>
