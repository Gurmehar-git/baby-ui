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
const ctx = changeSummaryState("ChangeSummaryHeader");
</script>

<header data-slot="change-summary-header" {...rest} class={cn(ctx.styles.header(), classProp)}>
	{@render children?.()}
</header>
