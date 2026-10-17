<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing02 } from "../variants";
import { pricing02Plan, pricing02State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const pricing = pricing02State();
const plan = pricing02Plan();
</script>

<!-- The top panel: name, description, Pricing02PlanPrice and Pricing02PlanAction. -->
<div
	data-slot="pricing-02-plan-panel"
	{...rest}
	class={cn(pricing02({ variant: pricing.variant, featured: plan.featured }).panel(), classProp)}
>
	{@render children?.()}
</div>
