<script lang="ts">
import Accordion from "../../accordion/svelte/accordion.svelte";
import AccordionContent from "../../accordion/svelte/accordion-content.svelte";
import AccordionItem from "../../accordion/svelte/accordion-item.svelte";
import AccordionTrigger from "../../accordion/svelte/accordion-trigger.svelte";
import { cn } from "../../lib/cn";
import {
	type FaqItem,
	faqCategory,
	faqHint,
	faqKey,
	faqMatches,
	highlightParts,
} from "../faq";
import { faqSectionState } from "./context";

let { class: classProp }: { class?: string } = $props();
const faq = faqSectionState();
</script>

{#snippet marked(copy: string)}{#each highlightParts(copy, faq.text) as part, index (index)}{#if part.match}<mark class={faq.styles.mark()}>{part.text}</mark>{:else}{part.text}{/if}{/each}{/snippet}

{#snippet questions(entries: FaqItem[], filtered: boolean)}
	<Accordion
		type={faq.type}
		value={faq.type === "multiple" ? faq.open : (faq.open[0] ?? "")}
		onValueChange={faq.setOpen}
		class={faq.styles.list()}
	>
		{#each entries as item (faqKey(item))}
			{@const key = faqKey(item)}
			{@const hint = faqHint(item, faq.text, faq.open.includes(key))}
			{@const gone = filtered && !faqMatches(item, faq.text)}
			<AccordionItem value={key} data-hidden={gone} inert={gone} class={faq.styles.row()}>
				<div class={faq.styles.rowInner()}>
					<AccordionTrigger class={faq.styles.trigger()}>
						<span class="min-w-0">{@render marked(item.question)}</span>
					</AccordionTrigger>
					{#if hint}
						<p class={faq.styles.hint()}>{@render marked(hint)}</p>
					{/if}
					<AccordionContent class={faq.styles.answer()}>{@render marked(item.answer)}</AccordionContent>
				</div>
			</AccordionItem>
		{/each}
	</Accordion>
{/snippet}

<!-- The questions; one list per topic in the columns variant, filtered rows folded away in search. -->
{#if faq.variant === "columns"}
	<div data-slot="faq-section-list" class={cn(faq.styles.stage(), classProp)}>
		{#each faq.categories as entry (entry)}
			<div data-active={entry === faq.topic} inert={entry !== faq.topic} class={faq.styles.panel()}>
				<div class={faq.styles.panelInner()}>
					{@render questions(
						faq.items.filter((item) => faqCategory(item) === entry),
						false,
					)}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div data-slot="faq-section-list" class={classProp}>
		{@render questions(faq.items, true)}
	</div>
{/if}
