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

<div data-slot="pricing-01-plans" {...rest} class={cn(pricing.styles.plans(), classProp)}>
	{@render children?.()}
</div>
