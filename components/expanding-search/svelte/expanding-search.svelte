<script lang="ts">
import { Combobox } from "bits-ui";
import { tick, untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { glideHighlight } from "../../lib/svelte/glide";
import {
	type ExpandingSearchGroup,
	type ExpandingSearchItem,
	groupSearch,
	rankSearch,
	splitSearchMatch,
} from "./search";
import {
	type ExpandingSearchSize,
	type ExpandingSearchVariant,
	expandingSearch,
} from "./variants";

let {
	label,
	items,
	suggestions = [],
	suggestionsLabel = "Recent",
	placeholder,
	onSelect,
	expanded = $bindable(),
	defaultExpanded = false,
	onExpandedChange,
	value = $bindable(),
	onValueChange,
	expandedWidth = 360,
	maxResults = 6,
	anchor = "end",
	emptyHint = "Try a shorter word or check the spelling.",
	variant = "default",
	size = "default",
	class: classProp,
}: {
	/** Names the button, the field and the results, e.g. "Search projects and docs". */
	label: string;
	items: ExpandingSearchItem[];
	/** Shown before anything is typed, such as recent searches. */
	suggestions?: ExpandingSearchItem[];
	suggestionsLabel?: string;
	placeholder?: string;
	onSelect?: (item: ExpandingSearchItem) => void;
	/** Bindable. Leave unset to let the search own it. */
	expanded?: boolean;
	defaultExpanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** The typed query; bindable. */
	value?: string;
	onValueChange?: (value: string) => void;
	/** The widest the field grows, in px; never past its container. */
	expandedWidth?: number;
	maxResults?: number;
	/** The edge the button sits on; the field grows away from it. */
	anchor?: "start" | "end";
	emptyHint?: string;
	variant?: ExpandingSearchVariant;
	size?: ExpandingSearchSize;
	class?: string;
} = $props();

let ownExpanded = $state(untrack(() => defaultExpanded));
let ownQuery = $state("");
const isOpen = $derived(expanded ?? ownExpanded);
const query = $derived(value ?? ownQuery);
let focused = $state(false);
let input = $state<HTMLInputElement | null>(null);
let button = $state<HTMLButtonElement>();

function setQuery(next: string) {
	if (value === undefined) ownQuery = next;
	else value = next;
	onValueChange?.(next);
}
function setExpanded(next: boolean) {
	if (expanded === undefined) ownExpanded = next;
	else expanded = next;
	onExpandedChange?.(next);
}

const trimmed = $derived(query.trim());
const results = $derived(trimmed ? rankSearch(items, trimmed, maxResults) : []);
const mode = $derived(
	!trimmed
		? suggestions.length
			? "suggestions"
			: null
		: results.length
			? "results"
			: "empty",
);
const groups: ExpandingSearchGroup[] = $derived(
	mode === "suggestions"
		? [{ name: suggestionsLabel, items: suggestions }]
		: mode === "results"
			? groupSearch(results, items)
			: [],
);
const open = $derived(isOpen && focused && mode !== null);
const all = $derived([...items, ...suggestions]);

// Focus moves inside the click so touch keyboards open; the field is inert until it renders expanded.
function expand() {
	if (input) {
		input.inert = false;
		input.focus({ preventScroll: true });
	}
	focused = true;
	setExpanded(true);
}
async function collapse(returnFocus: boolean) {
	setQuery("");
	focused = false;
	setExpanded(false);
	await tick();
	// The primitive writes the chosen label into the field after the change; clear it for next time.
	if (input) input.value = "";
	if (returnFocus) button?.focus({ preventScroll: true });
}
function choose(id: string) {
	const item = all.find((entry) => entry.id === id);
	if (!item) return;
	collapse(true);
	onSelect?.(item);
}

function glide(list: HTMLElement) {
	const pill = list.querySelector<HTMLElement>("[data-es-pill]");
	if (pill) return glideHighlight(list, pill);
}

const s = $derived(expandingSearch({ size, variant }));
</script>

{#snippet match(text: string)}
	{#if mode === "results"}
		{@const [before, hit, after] = splitSearchMatch(text, trimmed)}
		{before}{#if hit}<mark>{hit}</mark>{/if}{after}
	{:else}
		{text}
	{/if}
{/snippet}

<div
	data-slot="expanding-search"
	data-anchor={anchor}
	class={cn(s.root(), classProp)}
	style:--es-max="{expandedWidth}px"
>
	<Combobox.Root
		type="single"
		{open}
		onOpenChange={(next) => {
			if (!next && open && !input?.value.trim()) collapse(true);
		}}
		value=""
		inputValue={query}
		onValueChange={(id) => {
			if (id) choose(id);
		}}
		items={all.map((item) => ({ value: item.id, label: item.title }))}
	>
		<div data-expanded={isOpen || undefined} class={s.shell()}>
			<button bind:this={button} type="button" aria-label={label} hidden={isOpen} class={s.trigger()} onclick={expand}></button>
			<span class={s.icon()}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
					<circle cx="11" cy="11" r="7" />
					<path d="m20 20-3.5-3.5" stroke-linecap="round" />
				</svg>
			</span>
			<Combobox.Input
				bind:ref={input}
				inert={!isOpen}
				aria-label={label}
				placeholder={placeholder ?? label}
				autocomplete="off"
				spellcheck={false}
				enterkeyhint="search"
				class={s.input()}
				oninput={(event) => setQuery(event.currentTarget.value)}
				onfocus={() => (focused = true)}
				onkeydown={(event) => {
					if (event.key === "Escape") collapse(true);
				}}
				onblur={() => {
					// Switching windows keeps the search as it was.
					if (!document.hasFocus()) return;
					focused = false;
					if (!input?.value.trim()) collapse(false);
				}}
			/>
			{#if isOpen && query}
				<button
					type="button"
					tabindex="-1"
					aria-label="Clear search"
					class={s.clear()}
					onmousedown={(event) => event.preventDefault()}
					onclick={() => {
						setQuery("");
						input?.focus({ preventScroll: true });
					}}
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
						<path d="M6 6l12 12M18 6 6 18" stroke-linecap="round" />
					</svg>
				</button>
			{/if}
		</div>
		<Combobox.Portal>
			<Combobox.Content
				sideOffset={8}
				align={anchor === "end" ? "end" : "start"}
				class={s.popup()}
			>
				{#if mode === "empty"}
					<div class={s.empty()}>
						<p class={s.emptyTitle()}>No results for "{trimmed}"</p>
						<p class={s.emptyHint()}>{emptyHint}</p>
					</div>
				{:else}
					<Combobox.Viewport class={s.list()} {@attach glide}>
						<span data-es-pill="" aria-hidden="true" class={s.pill()}></span>
						{#each groups as group (group.name)}
							<Combobox.Group>
								{#if group.name}
									<Combobox.GroupHeading class={s.groupLabel()}>{group.name}</Combobox.GroupHeading>
								{/if}
								{#each group.items as item (item.id)}
									<Combobox.Item value={item.id} label={item.title} class={s.item()}>
										<span class="grid min-w-0">
											<span class={s.title()}>{@render match(item.title)}</span>
											{#if item.meta}<span class={s.meta()}>{item.meta}</span>{/if}
										</span>
									</Combobox.Item>
								{/each}
							</Combobox.Group>
						{/each}
					</Combobox.Viewport>
				{/if}
			</Combobox.Content>
		</Combobox.Portal>
	</Combobox.Root>
</div>
