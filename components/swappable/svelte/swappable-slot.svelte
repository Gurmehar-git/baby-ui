<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/svelte/cn";
import { swappable } from "./variants";

let {
	id,
	class: classProp,
	children,
	...rest
}: {
	/** Unique within the Swappable. */
	id: string;
	class?: string;
	children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, "id" | "class" | "children"> = $props();
</script>

<div {...rest} data-swapy-slot={id} data-slot="swappable-slot" class={cn(swappable().slot(), classProp)}>
	{@render children?.()}
</div>
