<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { changeSummaryState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLSpanElement> & { children?: Snippet } = $props();
const ctx = changeSummaryState("ChangeSummaryPeriod");
</script>

<span data-slot="change-summary-period" {...rest} class={cn(ctx.styles.period(), classProp)}>
	{@render children?.()}
</span>
