<script lang="ts">
import { Slider as SliderPrimitive } from "bits-ui";
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { slideToUnlock } from "../variants";
import { getSlideToUnlock } from "./context";

let {
	children,
	class: classProp,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	children: Snippet;
} = $props();
const context = getSlideToUnlock();
const s = $derived(slideToUnlock({ variant: context.variant, size: context.size }));
</script>

<!-- Everything that reads --slide-handle sits inside the control, so the override lives here. -->
<div
	data-slot="slide-to-unlock-track"
	class={cn(s.control(), classProp)}
	style:--slide-handle={context.handle}
	{...rest}
>
	<span aria-hidden="true" class={s.track()}>
		<SliderPrimitive.Range class={s.range()} />
	</span>
	{@render children()}
</div>
