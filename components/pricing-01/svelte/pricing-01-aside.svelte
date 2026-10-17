<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
const pricing = pricing01State();
</script>

<!-- The right-hand column: Pricing01Description and Pricing01Periods. -->
<div data-slot="pricing-01-aside" {...rest} class={cn(pricing.styles.aside(), classProp)}>
	{@render children?.()}
</div>
