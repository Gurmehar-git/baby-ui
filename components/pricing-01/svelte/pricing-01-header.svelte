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

<!-- The row above the plans: Pricing01Heading beside Pricing01Aside. -->
<div data-slot="pricing-01-header" {...rest} class={cn(pricing.styles.header(), classProp)}>
	{@render children?.()}
</div>
