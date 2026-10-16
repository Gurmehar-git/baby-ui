<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { calendar } from "../../calendar/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();
</script>

<div bind:this={ref} class={cn(calendar().month(), classProp)} {...rest}>
	{@render children?.()}
</div>
