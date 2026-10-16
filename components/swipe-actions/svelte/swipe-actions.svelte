<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { setSwipeList } from "./context";
import { createSwipeGroup, type SwipeGroup } from "./swipe";
import {
	type SwipeActionsSize,
	type SwipeActionsVariant,
	swipeActions,
} from "./variants";

let {
	label,
	variant = "default",
	size = "default",
	children,
	class: classProp,
}: {
	/** Accessible name of the list, e.g. "Inbox". */
	label: string;
	variant?: SwipeActionsVariant;
	size?: SwipeActionsSize;
	children: Snippet;
	class?: string;
} = $props();

let group = $state<SwipeGroup | null>(null);
$effect(() => {
	const created = createSwipeGroup();
	group = created;
	return () => created.destroy();
});
setSwipeList({
	get group() {
		return group;
	},
	get size() {
		return size;
	},
});
const s = $derived(swipeActions({ variant, size }));
</script>

<div data-slot="swipe-actions" class={cn(s.root(), classProp)}>
	<ul aria-label={label} class={s.list()}>
		{@render children()}
	</ul>
</div>
