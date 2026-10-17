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

<!-- The right-hand column: Pricing02Description and Pricing02Periods. -->
<div data-slot="pricing-02-aside" {...rest} class={cn(pricing.styles.aside(), classProp)}>
	{@render children?.()}
</div>
