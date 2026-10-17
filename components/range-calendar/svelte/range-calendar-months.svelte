<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { calendar } from "../../calendar/variants";
import { cn } from "../../lib/cn";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { ref?: HTMLElement | null } = $props();
</script>

<div bind:this={ref} class={cn(calendar().months(), classProp)} {...rest}>
	{@render children?.()}
</div>
