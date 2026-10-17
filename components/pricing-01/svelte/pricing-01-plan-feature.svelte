<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLLiAttributes & { children?: Snippet } = $props();
const pricing = pricing01State();
</script>

<li data-slot="pricing-01-plan-feature" {...rest} class={cn(pricing.styles.feature(), classProp)}>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={pricing.styles.check()}
	>
		<path d="M5 12l5 5l10 -10" />
	</svg>
	<span>{@render children?.()}</span>
</li>
