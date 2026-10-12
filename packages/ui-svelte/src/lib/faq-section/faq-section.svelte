<script lang="ts">
import Accordion from "../accordion/accordion.svelte";
import AccordionContent from "../accordion/accordion-content.svelte";
import AccordionItem from "../accordion/accordion-item.svelte";
import AccordionTrigger from "../accordion/accordion-trigger.svelte";
import Button from "../button/button.svelte";
import { cn } from "../lib/cn";
import SearchInput from "../search-input/search-input.svelte";
import ToggleGroup from "../toggle-group/toggle-group.svelte";
import ToggleGroupItem from "../toggle-group/toggle-group-item.svelte";
import {
	type FaqContact,
	type FaqItem,
	faqCategories,
	faqCategory,
	faqHint,
	faqKey,
	faqMatches,
	highlightParts,
} from "./faq";
import { type FaqSectionVariant, faqSection } from "./variants";

let {
	items,
	variant = "accordion",
	title = "Frequently asked questions",
	description,
	type = "single",
	value = $bindable(),
	onValueChange,
	category = $bindable(),
	onCategoryChange,
	query = $bindable(),
	onQueryChange,
	contact,
	searchLabel = "Search questions",
	class: className,
}: {
	items: FaqItem[];
	/** `accordion` is one centred list, `columns` adds a topic rail, `search` filters as you type. */
	variant?: FaqSectionVariant;
	title?: string;
	description?: string;
	/** Several answers open at once. */
	type?: "single" | "multiple";
	/** Open item ids (an item's `id`, else its question). Bindable. */
	value?: string[];
	onValueChange?: (value: string[]) => void;
	/** Active topic in the columns variant. Bindable. */
	category?: string;
	onCategoryChange?: (category: string) => void;
	/** Search text in the search variant. Bindable. */
	query?: string;
	onQueryChange?: (query: string) => void;
	/** A way to reach a person when the answer is not listed. */
	contact?: FaqContact;
	searchLabel?: string;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(faqSection({ variant }));
const categories = $derived(faqCategories(items));
// svelte-ignore state_referenced_locally
let ownOpen = $state<string[]>(items[0] ? [faqKey(items[0])] : []);
// svelte-ignore state_referenced_locally
let ownCategory = $state(faqCategories(items)[0] ?? "General");
let ownQuery = $state("");
const open = $derived(value ?? ownOpen);
const topic = $derived(category ?? ownCategory);
const text = $derived(variant === "search" ? (query ?? ownQuery) : "");
const shown = $derived(items.filter((item) => faqMatches(item, text)));

function setOpen(next: string | string[]) {
	const list = Array.isArray(next) ? next : next ? [next] : [];
	if (value === undefined) ownOpen = list;
	else value = list;
	onValueChange?.(list);
}
function setTopic(next: string | string[]) {
	const picked = Array.isArray(next) ? next[0] : next;
	if (!picked) return;
	if (category === undefined) ownCategory = picked;
	else category = picked;
	onCategoryChange?.(picked);
}
function setText(next: string) {
	if (query === undefined) ownQuery = next;
	else query = next;
	onQueryChange?.(next);
}
</script>

{#snippet marked(copy: string)}{#each highlightParts(copy, text) as part, index (index)}{#if part.match}<mark class={s.mark()}>{part.text}</mark>{:else}{part.text}{/if}{/each}{/snippet}

{#snippet list(entries: FaqItem[], hidden: (item: FaqItem) => boolean)}
	<Accordion
		{type}
		value={type === "multiple" ? open : (open[0] ?? "")}
		onValueChange={setOpen}
		class={s.list()}
	>
		{#each entries as item (faqKey(item))}
			{@const key = faqKey(item)}
			{@const hint = faqHint(item, text, open.includes(key))}
			{@const gone = hidden(item)}
			<AccordionItem value={key} data-hidden={gone} inert={gone} class={s.row()}>
				<div class={s.rowInner()}>
					<AccordionTrigger class={s.trigger()}>
						<span class="min-w-0">{@render marked(item.question)}</span>
					</AccordionTrigger>
					{#if hint}
						<p class={s.hint()}>{@render marked(hint)}</p>
					{/if}
					<AccordionContent class={s.answer()}>{@render marked(item.answer)}</AccordionContent>
				</div>
			</AccordionItem>
		{/each}
	</Accordion>
{/snippet}

{#snippet intro()}
	<div class={s.intro()}>
		<h2 id="{uid}-title" class={s.title()}>{title}</h2>
		{#if description}
			<p class={s.description()}>{description}</p>
		{/if}
	</div>
{/snippet}

{#snippet reach()}
	{#if contact}
		{#snippet inner()}
			<span class={s.contactText()}>
				<span class={s.contactLabel()}>{contact.label}</span>
				{#if contact.description}
					<span class={s.contactDescription()}>{contact.description}</span>
				{/if}
			</span>
			<svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class={s.contactArrow()}>
				<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		{/snippet}
		{#if contact.href}
			<a data-slot="faq-contact" href={contact.href} onclick={contact.onClick} class={s.contact()}>{@render inner()}</a>
		{:else}
			<button data-slot="faq-contact" type="button" onclick={contact.onClick} class={s.contact()}>{@render inner()}</button>
		{/if}
	{/if}
{/snippet}

<section
	data-slot="faq-section"
	data-variant={variant}
	aria-labelledby="{uid}-title"
	class={cn(s.root(), className)}
>
	{#if variant === "columns"}
		<div class={s.grid()}>
			<div class={s.rail()}>
				{@render intro()}
				<ToggleGroup
					variant="segmented"
					orientation="vertical"
					label="Question topics"
					value={topic}
					onValueChange={setTopic}
					class={s.topics()}
				>
					{#each categories as entry (entry)}
						<ToggleGroupItem value={entry} class={s.topic()}>
							{entry}
							<span class={s.count()}>{items.filter((item) => faqCategory(item) === entry).length}</span>
						</ToggleGroupItem>
					{/each}
				</ToggleGroup>
				{@render reach()}
			</div>
			<div class={s.stage()}>
				{#each categories as entry (entry)}
					<div data-active={entry === topic} inert={entry !== topic} class={s.panel()}>
						<div class={s.panelInner()}>
							{@render list(
								items.filter((item) => faqCategory(item) === entry),
								() => false,
							)}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class={s.stack()}>
			{@render intro()}
			{#if variant === "search"}
				<div class={s.searchRow()}>
					<SearchInput label={searchLabel} value={text} onValueChange={setText} />
					<p class={s.resultCount()} aria-live="polite">
						{text.trim()
							? `${shown.length} ${shown.length === 1 ? "answer" : "answers"}`
							: `${items.length} questions`}
					</p>
				</div>
			{/if}
			{@render list(items, (item) => !faqMatches(item, text))}
			{#if variant === "search" && text.trim() && shown.length === 0}
				<div class={s.empty()}>
					<p>No answers mention "{text.trim()}".</p>
					<Button size="sm" variant="outline" onclick={() => setText("")}>Clear search</Button>
				</div>
			{/if}
			{@render reach()}
		</div>
	{/if}
</section>
