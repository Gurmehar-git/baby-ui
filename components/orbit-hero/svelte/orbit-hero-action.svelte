<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import type { ButtonVariant } from "../../button/variants";

let {
	href,
	target,
	onclick,
	variant = "default",
	class: classProp,
	children,
}: {
	/** Renders a link; otherwise a button calling `onclick`. */
	href?: string;
	/** Link target; `_blank` also sets `rel="noopener noreferrer"`. */
	target?: "_blank" | "_self";
	onclick?: () => void;
	/** `default` for the primary action, `outline` for the rest. */
	variant?: ButtonVariant;
	class?: string;
	children?: Snippet;
} = $props();
</script>

<Button
	data-slot="orbit-hero-action"
	{href}
	{target}
	rel={target === "_blank" ? "noopener noreferrer" : undefined}
	{variant}
	size="lg"
	{onclick}
	class={classProp}
>
	{@render children?.()}
</Button>
