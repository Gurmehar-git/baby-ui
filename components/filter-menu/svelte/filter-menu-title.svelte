<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { filterMenuState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const ctx = filterMenuState("FilterMenuTitle");
</script>

<h2 data-slot="filter-menu-title" {...rest} class={cn(ctx.styles.title(), classProp)}>
	{@render children?.()}
</h2>
