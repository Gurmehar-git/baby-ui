<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { faqSectionState } from "./context";

let {
	href,
	onclick,
	description,
	class: classProp,
	children,
}: {
	/** A link when set, otherwise a button. */
	href?: string;
	onclick?: () => void;
	/** A second line under the label. */
	description?: string;
	class?: string;
	children?: Snippet;
} = $props();
const faq = faqSectionState();
</script>

{#snippet inner()}
	<span class={faq.styles.contactText()}>
		<span class={faq.styles.contactLabel()}>{@render children?.()}</span>
		{#if description}
			<span class={faq.styles.contactDescription()}>{description}</span>
		{/if}
	</span>
	<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class={faq.styles.contactArrow()}>
		<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

<!-- A way to reach a person when the answer is not listed. -->
{#if href}
	<a data-slot="faq-section-contact" {href} {onclick} class={cn(faq.styles.contact(), classProp)}>
		{@render inner()}
	</a>
{:else}
	<button data-slot="faq-section-contact" type="button" {onclick} class={cn(faq.styles.contact(), classProp)}>
		{@render inner()}
	</button>
{/if}
