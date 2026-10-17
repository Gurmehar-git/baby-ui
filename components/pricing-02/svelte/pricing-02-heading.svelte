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

<div data-slot="pricing-02-heading" {...rest} class={cn(pricing.styles.heading(), classProp)}>
	{@render children?.()}
</div>
