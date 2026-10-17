<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
const pricing = pricing01State();
</script>

<p data-slot="pricing-01-plan-description" {...rest} class={cn(pricing.styles.blurb(), classProp)}>
	{@render children?.()}
</p>
