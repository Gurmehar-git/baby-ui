<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import type { ChangeSummaryDirection, ChangeSummaryTone } from "../variants";
import { changeSummaryState, setChangeSummaryTrend } from "./context";

let {
	tone = "neutral",
	direction,
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	tone?: ChangeSummaryTone;
	/** Defaults to up for positive and down for negative; neutral shows a dash. */
	direction?: ChangeSummaryDirection;
	children?: Snippet;
} = $props();
const ctx = changeSummaryState("ChangeSummaryItem");

setChangeSummaryTrend({
	get tone() {
		return tone;
	},
	get direction() {
		return direction ?? (tone === "negative" ? "down" : "up");
	},
});
</script>

<!-- One metric: a label and what happened to it. -->
<div data-slot="change-summary-item" data-tone={tone} {...rest} class={cn(ctx.styles.item(), classProp)}>
	{@render children?.()}
</div>
