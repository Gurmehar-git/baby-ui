<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { type DecisionInboxVariant, decisionInbox } from "../variants";
import { setDecisionInbox } from "./context";

let {
	value = $bindable({}),
	onValueChange,
	collapsed = $bindable([]),
	onCollapsedChange,
	variant = "tray",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLElement> & {
	/** Answers so far, by decision. Bindable. */
	value?: Record<string, string>;
	onValueChange?: (value: Record<string, string>) => void;
	/** Decisions folded to one line. Bindable. */
	collapsed?: string[];
	onCollapsedChange?: (collapsed: string[]) => void;
	variant?: DecisionInboxVariant;
	children?: Snippet;
} = $props();

const styles = $derived(decisionInbox({ variant }));
let items = $state<string[]>([]);

setDecisionInbox({
	get answers() {
		return value;
	},
	get collapsed() {
		return collapsed;
	},
	get items() {
		return items;
	},
	get styles() {
		return styles;
	},
	answer(item, answer) {
		value = { ...value, [item]: answer };
		onValueChange?.(value);
	},
	expand(item) {
		collapsed = collapsed.filter((c) => c !== item);
		onCollapsedChange?.(collapsed);
	},
	register(item) {
		if (!items.includes(item)) items = [...items, item];
		return () => {
			items = items.filter((i) => i !== item);
		};
	},
});
</script>

<!-- The root: answers and folded rows, and the count of decisions placed inside it. -->
<section data-slot="decision-inbox" data-variant={variant} {...rest} class={cn(styles.root(), classProp)}>
	{@render children?.()}
</section>
