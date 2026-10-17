<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { faqSectionState } from "./context";

let { class: classProp }: { class?: string } = $props();
const faq = faqSectionState();
</script>

<!-- Shown when a search matches nothing, with a button that clears it. -->
{#if faq.variant === "search" && faq.text.trim() && faq.shown.length === 0}
	<div data-slot="faq-section-empty" class={cn(faq.styles.empty(), classProp)}>
		<p>No answers mention "{faq.text.trim()}".</p>
		<Button size="sm" variant="outline" onclick={() => faq.setText("")}>Clear search</Button>
	</div>
{/if}
