<script lang="ts">
import { RangeCalendar as Primitive } from "bits-ui";
import { type ButtonVariant, button } from "../../button/svelte/variants";
import { calendar } from "../../calendar/svelte/variants";
import { cn } from "../../lib/svelte/cn";

let {
	ref = $bindable(null),
	class: classProp,
	children,
	variant = "ghost",
	...rest
}: Primitive.PrevButtonProps & { variant?: ButtonVariant } = $props();
</script>

<Primitive.PrevButton
	bind:ref
	class={cn(button({ variant, size: "icon" }), calendar().navButton(), classProp)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-4">
			<path d="m15 6-6 6 6 6" />
		</svg>
	{/if}
</Primitive.PrevButton>
