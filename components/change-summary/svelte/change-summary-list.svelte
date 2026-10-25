<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { changeSummaryState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDListElement> & { children?: Snippet } = $props();
const ctx = changeSummaryState("ChangeSummaryList");
</script>

<dl data-slot="change-summary-list" {...rest} class={cn(ctx.styles.list(), classProp)}>
	{@render children?.()}
</dl>
