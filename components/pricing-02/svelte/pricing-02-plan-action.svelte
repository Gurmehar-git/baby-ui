<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { pricing02Plan, pricing02State } from "./context";

let {
	href,
	onclick,
	class: classProp,
	children,
}: {
	/** Renders a link; otherwise a button calling `onclick`. */
	href?: string;
	onclick?: () => void;
	class?: string;
	children?: Snippet;
} = $props();
const pricing = pricing02State();
const plan = pricing02Plan();
</script>

<!-- The plan's button; filled on a featured plan. -->
<Button
	data-slot="pricing-02-plan-action"
	{href}
	{onclick}
	variant={plan.featured ? "default" : "outline"}
	class={cn(pricing.styles.cta(), classProp)}
>
	{@render children?.()}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={pricing.styles.arrow()}
	>
		<path d="M5 12l14 0" />
		<path d="M13 18l6 -6" />
		<path d="M13 6l6 6" />
	</svg>
</Button>
