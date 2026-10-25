<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import type { FilterGroup, FilterValue } from "../filters";
import { type FilterMenuVariant, filterMenu } from "../variants";
import { setFilterMenu } from "./context";

let {
	groups,
	value = $bindable({}),
	onValueChange,
	open = $bindable(groups.slice(0, 1).map((g) => g.id)),
	onOpenChange,
	variant = "card",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	groups: FilterGroup[];
	/** Picked option ids, by group. Bindable. */
	value?: FilterValue;
	onValueChange?: (value: FilterValue) => void;
	/** Open groups; by default the first group starts open. Bindable. */
	open?: string[];
	onOpenChange?: (open: string[]) => void;
	variant?: FilterMenuVariant;
	children?: Snippet;
} = $props();

const styles = $derived(filterMenu({ variant }));

setFilterMenu({
	get groups() {
		return groups;
	},
	get value() {
		return value;
	},
	get open() {
		return open;
	},
	get styles() {
		return styles;
	},
	setValue(next) {
		value = next;
		onValueChange?.(next);
	},
	setOpen(next) {
		open = next;
		onOpenChange?.(next);
	},
});
</script>

<!-- The root: the groups, what is picked and which groups are open. -->
<div data-slot="filter-menu" data-variant={variant} {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
</div>
