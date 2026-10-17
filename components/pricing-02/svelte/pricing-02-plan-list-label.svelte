<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing02State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const pricing = pricing02State();
</script>

<!-- A heading over the features, e.g. "Everything in Starter, plus". -->
<p data-slot="pricing-02-plan-list-label" {...rest} class={cn(pricing.styles.listLabel(), classProp)}>
	{@render children?.()}
</p>
