<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { changeSummaryState } from "./context";

let {
	icon,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & {
	/** Replaces the default lines mark; pass `null` to remove it. */
	icon?: Snippet | null;
	children?: Snippet;
} = $props();
const ctx = changeSummaryState("ChangeSummaryTitle");
</script>

<h2 data-slot="change-summary-title" id={ctx.titleId} {...rest} class={cn(ctx.styles.title(), classProp)}>
	{#if icon === undefined}
		<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
			<path d="M2.5 4h4M2.5 8h8M6.5 12h7M9.5 4h1" />
		</svg>
	{:else if icon}
		{@render icon()}
	{/if}
	{@render children?.()}
</h2>
