<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { pricing01Plan, pricing01State } from "./context";

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
const pricing = pricing01State();
const plan = pricing01Plan();
</script>

<!-- The plan's full-width button; filled on a featured plan. -->
<Button
	data-slot="pricing-01-plan-action"
	{href}
	{onclick}
	variant={plan.featured ? "default" : "dark"}
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
		<path d="M17 7l-10 10" />
		<path d="M8 7l9 0l0 9" />
	</svg>
</Button>
