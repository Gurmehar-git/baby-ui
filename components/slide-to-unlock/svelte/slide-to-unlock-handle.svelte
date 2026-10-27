<script lang="ts">
import { Slider as SliderPrimitive } from "bits-ui";
import type { ComponentProps, Snippet } from "svelte";
import { cn } from "../../lib/cn";
import Spinner from "../../spinner/svelte/spinner.svelte";
import { slideToUnlock } from "../variants";
import { getSlideToUnlock } from "./context";

let {
	children,
	class: classProp,
	...rest
}: Omit<ComponentProps<typeof SliderPrimitive.Thumb>, "index"> & {
	children?: Snippet;
} = $props();
const context = getSlideToUnlock();
const s = $derived(slideToUnlock({ variant: context.variant, size: context.size }));
</script>

<SliderPrimitive.Thumb
	index={0}
	aria-label={rest["aria-label"] ?? context.label}
	data-slot="slide-to-unlock-handle"
	class={cn(s.thumb(), classProp)}
	{...rest}
>
	{#if context.loading}
		<Spinner label="{context.label}, in progress" />
	{:else if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path d="m7 4 6 6-6 6M3 4l6 6-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	{/if}
</SliderPrimitive.Thumb>
