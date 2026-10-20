<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricingPlans } from "../variants";
import { pricingPlansState } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();

const ctx = pricingPlansState("PricingPlansGrid");
</script>

<div
	data-slot="pricing-plans-grid"
	class={cn(pricingPlans({ layout: ctx.layout, size: ctx.size }).grid(), classProp)}
	{...rest}
>
	{@render children?.()}
</div>
