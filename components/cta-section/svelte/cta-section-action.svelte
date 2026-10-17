<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import type { ButtonVariant } from "../../button/variants";
import { cn } from "../../lib/cn";
import { ctaSectionState } from "./context";

let {
	href,
	onclick,
	variant = "default",
	class: classProp,
	children,
}: {
	/** Renders a link. */
	href?: string;
	onclick?: () => void;
	/** `default` is the primary action and leans its arrow on hover; use `outline` for the secondary. */
	variant?: ButtonVariant;
	class?: string;
	children?: Snippet;
} = $props();
const cta = ctaSectionState();
const banner = $derived(cta.variant === "banner");
</script>

<Button
	data-slot="cta-section-action"
	size={banner ? "sm" : "lg"}
	{variant}
	{href}
	{onclick}
	class={cn(!banner && cta.styles.action(), classProp)}
>
	{@render children?.()}
	{#if variant === "default"}
		<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class={cta.styles.arrow()}>
			<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	{/if}
</Button>
