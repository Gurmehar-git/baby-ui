<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLUListElement> & { children?: Snippet } = $props();
const pricing = pricing01State();
</script>

<ul data-slot="pricing-01-plan-features" {...rest} class={cn(pricing.styles.features(), classProp)}>
	{@render children?.()}
</ul>
