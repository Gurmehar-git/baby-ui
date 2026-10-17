<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import {
	type AnimatedGradientPosition,
	type AnimatedGradientTone,
	animatedGradient,
} from "../variants";

let {
	tone,
	position,
	duration = 20,
	children,
	class: className,
}: {
	tone?: AnimatedGradientTone;
	/** `absolute` fills the nearest positioned parent; `fixed` fills the viewport. */
	position?: AnimatedGradientPosition;
	/** Seconds for one drift cycle. */
	duration?: number;
	/** Rendered above the gradient. */
	children?: Snippet;
	class?: string;
} = $props();

const s = $derived(animatedGradient({ tone, position }));
</script>

<div
	data-slot="animated-gradient"
	class={cn(s.root(), className)}
	style="--animated-gradient-duration: {duration}s"
>
	<div aria-hidden="true" class={s.layer()}></div>
	<div aria-hidden="true" class={s.layerAlt()}></div>
	{#if children}
		<div class={s.content()}>{@render children()}</div>
	{/if}
</div>
