<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { slideToUnlock } from "../variants";
import { getSlideToUnlock } from "./context";

let {
	children,
	class: classProp,
	style,
	...rest
}: HTMLAttributes<HTMLSpanElement> & {
	children: Snippet<[{ value: number }]>;
} = $props();
const context = getSlideToUnlock();
const s = $derived(slideToUnlock({ variant: context.variant, size: context.size }));
</script>

<span
	data-slot="slide-to-unlock-text"
	class={cn(s.text(), classProp)}
	style:opacity={Math.max(0, 1 - context.value / 45)}
	{style}
	{...rest}
>
	{@render children({ value: context.value })}
</span>
