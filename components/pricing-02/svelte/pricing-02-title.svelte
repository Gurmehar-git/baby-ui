<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing02State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
const pricing = pricing02State();
</script>

<!-- Line breaks in the text are kept. -->
<h2 data-slot="pricing-02-title" {...rest} class={cn(pricing.styles.title(), classProp)}>
	{@render children?.()}
</h2>
