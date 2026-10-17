<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { showMore } from "../variants";
import { setShowMore } from "./context";

let {
	lines = 3,
	maxHeight = 320,
	expanded = $bindable(false),
	onExpandedChange,
	label = "Details",
	class: classProp,
	children,
	...rest
}: HTMLAttributes<HTMLDivElement> & {
	/** Lines visible when collapsed. */
	lines?: number;
	/** Cap on the expanded height in pixels; past it the region scrolls. */
	maxHeight?: number;
	/** Bindable. */
	expanded?: boolean;
	onExpandedChange?: (expanded: boolean) => void;
	/** The region's accessible name once it scrolls. */
	label?: string;
	children?: Snippet;
} = $props();

const regionId = $props.id();
let region = $state<HTMLDivElement>();
let lineHeight = $state<number>();
let fullHeight = $state<number>();

const expandable = $derived(
	lineHeight === undefined || fullHeight === undefined
		? false
		: fullHeight - lineHeight * lines > 1,
);
const open = $derived(expanded && expandable);
const scrollable = $derived(open && fullHeight !== undefined && fullHeight > maxHeight);
const height = $derived(
	lineHeight === undefined || fullHeight === undefined
		? undefined
		: open
			? Math.min(fullHeight, maxHeight)
			: Math.min(lineHeight * lines, fullHeight),
);

setShowMore({
	get lines() {
		return lines;
	},
	get label() {
		return label;
	},
	regionId,
	get open() {
		return open;
	},
	get expandable() {
		return expandable;
	},
	get scrollable() {
		return scrollable;
	},
	get height() {
		return height;
	},
	get region() {
		return region;
	},
	set region(el) {
		region = el;
	},
	setMetrics(line, full) {
		lineHeight = line;
		fullHeight = full;
	},
	toggle() {
		if (open) region?.scrollTo({ top: 0 });
		expanded = !expanded;
		onExpandedChange?.(expanded);
	},
});
</script>

<!-- Clamps ShowMoreContent to `lines`; ShowMoreTrigger appears only when the content overflows. -->
<div
	data-slot="show-more"
	data-state={open ? "open" : "closed"}
	{...rest}
	class={cn(showMore().root(), classProp)}
>
	{@render children?.()}
</div>
