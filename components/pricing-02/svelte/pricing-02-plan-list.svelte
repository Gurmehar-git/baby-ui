<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing02State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const pricing = pricing02State();
</script>

<!-- The lower list: an optional Pricing02PlanListLabel, then Pricing02PlanFeatures. -->
<div data-slot="pricing-02-plan-list" {...rest} class={cn(pricing.styles.list(), classProp)}>
	{@render children?.()}
</div>
