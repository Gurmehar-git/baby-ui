<script lang="ts" module>
import type { Snippet } from "svelte";

export type SwipeAction = {
	label: string;
	icon: Snippet;
	/** Fill of the revealed action; pair `destructive` with a label that names the result. */
	tone?: "default" | "primary" | "destructive";
	/** Runs on a full swipe, a tap on the revealed action, or the menu. Remove the item here unless `keepRow`. */
	onSelect: () => void;
	/** The row springs home after the action instead of sliding away, e.g. Mark as unread. */
	keepRow?: boolean;
};
</script>

<script lang="ts">
import { untrack } from "svelte";
import DropdownMenu from "../dropdown-menu/dropdown-menu.svelte";
import DropdownMenuContent from "../dropdown-menu/dropdown-menu-content.svelte";
import DropdownMenuItem from "../dropdown-menu/dropdown-menu-item.svelte";
import DropdownMenuTrigger from "../dropdown-menu/dropdown-menu-trigger.svelte";
import { cn } from "../lib/cn";
import { getSwipeList } from "./context";
import { createSwipeRow, type SwipeSide } from "./swipe";
import { swipeActions } from "./variants";

let {
	label,
	leading = [],
	trailing = [],
	fullSwipe = true,
	children,
	class: classProp,
}: {
	/** Names the row in its menu button, e.g. the message subject. */
	label: string;
	/** Actions under the left edge; the first commits on a full swipe right. */
	leading?: SwipeAction[];
	/** Actions under the right edge; the last commits on a full swipe left. */
	trailing?: SwipeAction[];
	/** Lets a long swipe commit the outermost action without a tap. */
	fullSwipe?: boolean;
	children: Snippet;
	class?: string;
} = $props();

const list = getSwipeList();
let row = $state<HTMLLIElement>();
let engine: ReturnType<typeof createSwipeRow> | null = null;
const actionOf = (side: SwipeSide, index: number) => (side === "leading" ? leading : trailing)[index];
const options = $derived({
	leading: leading.length,
	trailing: trailing.length,
	fullSwipe,
	keepRow: (side: SwipeSide, index: number) => !!actionOf(side, index)?.keepRow,
	onCommit: (side: SwipeSide, index: number) => actionOf(side, index)?.onSelect(),
});

$effect(() => {
	const el = row;
	const group = list.group;
	if (!el) return;
	const created = untrack(() => createSwipeRow(el, group, options));
	engine = created;
	return () => created.destroy();
});
$effect(() => {
	engine?.update(options);
});

const s = $derived(swipeActions({ size: list.size }));
const menu = $derived([
	...leading.map((action, index) => ({ action, side: "leading" as const, index })),
	...trailing.map((action, index) => ({ action, side: "trailing" as const, index })),
]);
</script>

{#snippet layers(side: SwipeSide, actions: SwipeAction[])}
	{#each actions as action, index (`${side}-${action.label}`)}
		<!-- The menu is the accessible path, so the revealed copy stays out of the tab order. -->
		<button
			type="button"
			tabindex="-1"
			aria-hidden="true"
			data-swipe-layer=""
			data-side={side}
			data-index={index}
			data-tone={action.tone ?? "default"}
			class={s.layer()}
			style:z-index={(side === "leading" ? actions.length - 1 - index : index) + 1}
		>
			<span data-swipe-glyph="" class={s.glyph()}>
				<span class={s.face()}>
					<span data-swipe-icon="" class={s.icon()}>{@render action.icon()}</span>
					<span data-swipe-label="" class={s.label()}>{action.label}</span>
				</span>
			</span>
		</button>
	{/each}
{/snippet}

<li bind:this={row} class={cn(s.row(), classProp)}>
	<div class={s.clip()}>
		{@render layers("leading", leading)}
		{@render layers("trailing", trailing)}
		<div data-swipe-content="" class={s.content()}>
			<div class={s.body()}>{@render children()}</div>
			{#if menu.length}
				<DropdownMenu>
					<DropdownMenuTrigger data-swipe-more="" aria-label="More actions for {label}" class={s.more()}>
						<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<circle cx="5" cy="12" r="1.6" />
							<circle cx="12" cy="12" r="1.6" />
							<circle cx="19" cy="12" r="1.6" />
						</svg>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={6}>
						{#each menu as entry (`${entry.side}-${entry.action.label}`)}
							<DropdownMenuItem
								destructive={entry.action.tone === "destructive"}
								class={s.item()}
								onSelect={() => engine?.commit(entry.side, entry.index)}
							>
								<span aria-hidden="true" class="inline-flex">{@render entry.action.icon()}</span>
								{entry.action.label}
							</DropdownMenuItem>
						{/each}
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}
		</div>
	</div>
</li>
