<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLLiAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { pricing02State } from "./context";

let {
	class: classProp,
	children,
	...rest
}: HTMLLiAttributes & { children?: Snippet } = $props();
const pricing = pricing02State();
</script>

<li data-slot="pricing-02-plan-feature" {...rest} class={cn(pricing.styles.feature(), classProp)}>
	<span class={pricing.styles.tick()}>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="size-3"
		>
			<path d="M5 12l5 5l10 -10" />
		</svg>
	</span>
	{@render children?.()}
</li>
