<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";

type Props = {
	children: Snippet;
	class?: string;
	columns?: number;
	gap?: number;
	rowHeight?: number;
};

let {
	children,
	class: classProp,
	columns = 3,
	gap = 16,
	rowHeight = 160,
}: Props = $props();
</script>

<div
	data-slot="bento-grid"
	style:--bento-columns={columns}
	style:gap="{gap}px"
	style:grid-auto-rows="{rowHeight}px"
	class={cn(
		"grid grid-cols-1 md:grid-cols-[repeat(var(--bento-columns),minmax(0,1fr))]",
		classProp,
	)}
>
	{@render children()}
</div>
