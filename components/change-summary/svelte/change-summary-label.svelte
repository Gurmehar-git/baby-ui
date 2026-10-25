<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { changeSummaryState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props();
const ctx = changeSummaryState("ChangeSummaryLabel");
</script>

<dt data-slot="change-summary-label" {...rest} class={cn(ctx.styles.label(), classProp)}>
	{@render children?.()}
</dt>
