<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricingComparisonState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = pricingComparisonState("PricingComparisonToolbar");
</script>

<div data-slot="pricing-comparison-toolbar" class={cn(ctx.styles.toolbar(), classProp)} {...rest}>
	{@render children?.()}
</div>
