<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { changeSummaryTrend } from "../variants";
import { changeSummaryState, changeSummaryTrendState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const ctx = changeSummaryState("ChangeSummaryChange");
const trend = changeSummaryTrendState();
</script>

<!-- What happened, in words; the trend mark is decorative, so the words carry the direction. -->
<dd data-slot="change-summary-change" {...rest} class={cn(ctx.styles.change(), classProp)}>
	<span aria-hidden="true" class={changeSummaryTrend({ tone: trend.tone })}>
		{#if trend.tone === "neutral"}
			<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
				<path d="M3 6h6" />
			</svg>
		{:else}
			<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d={trend.direction === "down" ? "M6 2.5v7M3 6.5l3 3 3-3" : "M6 9.5v-7M3 5.5l3-3 3 3"} />
			</svg>
		{/if}
	</span>
	<span class={ctx.styles.changeText()}>{@render children?.()}</span>
</dd>
