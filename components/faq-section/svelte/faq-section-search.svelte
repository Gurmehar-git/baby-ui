<script lang="ts">
import { cn } from "../../lib/cn";
import SearchInput from "../../search-input/svelte/search-input.svelte";
import { faqSectionState } from "./context";

let {
	label = "Search questions",
	class: classProp,
}: {
	/** Accessible name; also the placeholder. */
	label?: string;
	class?: string;
} = $props();
const faq = faqSectionState();
</script>

<!-- The search field and a live result count; filters FaqSectionList as you type. -->
<div data-slot="faq-section-search" class={cn(faq.styles.searchRow(), classProp)}>
	<SearchInput {label} value={faq.text} onValueChange={faq.setText} />
	<p class={faq.styles.resultCount()} aria-live="polite">
		{faq.text.trim()
			? `${faq.shown.length} ${faq.shown.length === 1 ? "answer" : "answers"}`
			: `${faq.items.length} questions`}
	</p>
</div>
