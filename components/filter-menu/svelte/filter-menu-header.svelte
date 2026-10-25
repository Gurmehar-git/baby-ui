<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { filterMenuState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const ctx = filterMenuState("FilterMenuHeader");
</script>

<div data-slot="filter-menu-header" {...rest} class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</div>
