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

<!-- The row above the plans: Pricing02Heading beside Pricing02Aside. -->
<div data-slot="pricing-02-header" {...rest} class={cn(pricing.styles.header(), classProp)}>
	{@render children?.()}
</div>
