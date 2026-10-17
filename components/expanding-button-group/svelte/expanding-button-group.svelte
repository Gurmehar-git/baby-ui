<script lang="ts" module>
import type { Snippet } from "svelte";
import type { ExpandingGroupItem } from "../group";

export type ExpandingButtonGroupItem = ExpandingGroupItem & {
	icon: Snippet;
	/** `destructive` tints the expanded state, for actions such as Delete. */
	variant?: "default" | "destructive";
};
</script>

<script lang="ts">
import { Toolbar } from "bits-ui";
import { untrack } from "svelte";
import { cn } from "../../lib/cn";
import { createExpandingGroup, type ExpandingGroupState } from "../group";
import {
	type ExpandingButtonGroupSize,
	type ExpandingButtonGroupVariant,
	expandingButtonGroup,
} from "../variants";

let {
	items,
	label,
	variant = "default",
	size = "default",
	defaultExpanded = null,
	onAction,
	confirmDuration = 1400,
	class: classProp,
}: {
	items: readonly ExpandingButtonGroupItem[];
	/** Accessible name of the toolbar, e.g. "Message actions". */
	label: string;
	variant?: ExpandingButtonGroupVariant;
	size?: ExpandingButtonGroupSize;
	/** The action whose label shows at rest; defaults to the first enabled one. */
	defaultExpanded?: string | null;
	/** Called with the item id whenever an action runs, before its own `onSelect`. */
	onAction?: (id: string) => void;
	/** How long the confirmation stays, in ms. */
	confirmDuration?: number;
	class?: string;
} = $props();

let root = $state<HTMLElement | null>(null);
let view = $state<ExpandingGroupState>({ intent: null, done: null, busy: null, announcement: "" });
let engine: ReturnType<typeof createExpandingGroup> | null = null;
const options = $derived({
	items,
	confirmDuration,
	onAction,
	onState: (next: ExpandingGroupState) => {
		view = next;
	},
});

$effect(() => {
	const el = root;
	if (!el) return;
	const created = untrack(() => createExpandingGroup(el, options));
	engine = created;
	return () => created.destroy();
});
$effect(() => {
	engine?.update(options);
});

const has = (id: string | null) => !!id && items.some((item) => item.id === id);
const restId = $derived(
	has(defaultExpanded)
		? defaultExpanded
		: (items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? null),
);
const expandedId = $derived(has(view.intent) ? view.intent : restId);
const s = $derived(expandingButtonGroup({ variant, size }));
</script>

<Toolbar.Root bind:ref={root} aria-label={label} data-slot="expanding-button-group" class={cn(s.root(), classProp)}>
	{#each items as item (item.id)}
		{@const done = view.done === item.id && !!item.doneLabel}
		<Toolbar.Button
			data-ebg-item=""
			data-id={item.id}
			data-variant={item.variant ?? "default"}
			data-state={done ? "done" : "idle"}
			data-expanded={expandedId === item.id || undefined}
			aria-label={item.label}
			aria-disabled={item.disabled || undefined}
			aria-busy={view.busy === item.id || undefined}
			class={s.item()}
		>
			<span aria-hidden="true" class={s.icon()}>
				<span data-on={!done} class={s.glyph()}>{@render item.icon()}</span>
				<span data-on={done} class={s.glyph()}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M4 12.5l5 5L20 6.5" pathLength="1" class={s.tick()} />
					</svg>
				</span>
			</span>
			<span aria-hidden="true" class={s.columns()}>
				<span class={s.label()}>
					<span data-on={!done} class={s.word()}>{item.label}</span>
					{#if item.doneLabel}
						<span data-on={done} class={s.word()}>{item.doneLabel}</span>
					{/if}
				</span>
			</span>
		</Toolbar.Button>
	{/each}
	<span class="sr-only" role="status">{view.announcement}</span>
</Toolbar.Root>
