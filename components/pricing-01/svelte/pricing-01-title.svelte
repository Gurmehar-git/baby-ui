<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const pricing = pricing01State();
</script>

<h2 data-slot="pricing-01-title" {...rest} class={cn(pricing.styles.title(), classProp)}>
	{@render children?.()}
</h2>
