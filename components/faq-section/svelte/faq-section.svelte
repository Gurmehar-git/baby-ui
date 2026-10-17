<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type FaqItem, faqCategories, faqKey, faqMatches } from "../faq";
import { type FaqSectionVariant, faqSection } from "../variants";
import { setFaqSection } from "./context";

let {
	items,
	variant = "accordion",
	type = "single",
	value = $bindable(),
	onValueChange,
	category = $bindable(),
	onCategoryChange,
	query = $bindable(),
	onQueryChange,
	class: className,
	children,
	...rest
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
	items: FaqItem[];
	/** `accordion` is one centred list, `columns` adds a topic rail, `search` filters as you type. */
	variant?: FaqSectionVariant;
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
	children?: Snippet;
} = $props();

const titleId = $props.id();
const styles = $derived(faqSection({ variant }));
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

setFaqSection({
	get items() {
		return items;
	},
	get variant() {
		return variant;
	},
	get type() {
		return type;
	},
	titleId,
	get categories() {
		return categories;
	},
	get open() {
		return open;
	},
	get topic() {
		return topic;
	},
	get text() {
		return text;
	},
	get shown() {
		return shown;
	},
	get styles() {
		return styles;
	},
	setOpen(next) {
		const list = Array.isArray(next) ? next : next ? [next] : [];
		if (value === undefined) ownOpen = list;
		else value = list;
		onValueChange?.(list);
	},
	setTopic(next) {
		const picked = Array.isArray(next) ? next[0] : next;
		if (!picked) return;
		if (category === undefined) ownCategory = picked;
		else category = picked;
		onCategoryChange?.(picked);
	},
	setText(next) {
		if (query === undefined) ownQuery = next;
		else query = next;
		onQueryChange?.(next);
	},
});
</script>

<!-- FaqSectionHeader, FaqSectionSearch, FaqSectionList and FaqSectionContact; columns adds FaqSectionRail. -->
<section
	data-slot="faq-section"
	data-variant={variant}
	aria-labelledby={titleId}
	{...rest}
	class={cn(styles.root(), className)}
>
	<div class={variant === "columns" ? styles.grid() : styles.stack()}>
		{@render children?.()}
	</div>
</section>
