<script lang="ts" generics="T">
import type { Snippet } from "svelte";
import { untrack } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import {
	type CardDecision,
	createCardDeck,
	type DeckCard,
	type DeckExit,
	type DeckPoint,
	type DeckReturn,
	VISIBLE,
} from "../deck";
import { type CardStackSize, type CardStackVariant, cardStack } from "../variants";

let {
	items,
	getKey,
	getLabel,
	card: cardSnippet,
	empty: emptySnippet,
	onDecide,
	onUndo,
	onReset,
	labels = { left: "Pass", right: "Keep" },
	outcomes,
	label = "Cards",
	variant = "stack",
	size = "default",
	buttons = true,
	index = $bindable(),
	defaultIndex = 0,
	onIndexChange,
	class: classProp,
}: {
	items: T[];
	getKey: (item: T) => string;
	/** A short name used in the card's accessible label and announcements, e.g. "Lisbon". */
	getLabel: (item: T) => string;
	card: Snippet<[T]>;
	/** Shown once every card is decided; receives a function that brings all cards back. */
	empty?: Snippet<[() => void]>;
	onDecide?: (item: T, decision: CardDecision) => void;
	onUndo?: (item: T, decision: CardDecision) => void;
	onReset?: () => void;
	/** Action names for each side, on the buttons and the stamps shown while dragging. */
	labels?: { left: string; right: string };
	/** Past tense of each action for announcements, e.g. "skipped" and "shortlisted". */
	outcomes?: { left: string; right: string };
	/** Accessible name of the stack. */
	label?: string;
	/** Cards behind peek below (`stack`), splay to the side (`fan`) or hide under the top card (`flat`). */
	variant?: CardStackVariant;
	size?: CardStackSize;
	/** Show the decision and undo buttons; drag and keys work either way. */
	buttons?: boolean;
	/** Position of the top card in `items`; bindable, or pair with onIndexChange. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	class?: string;
} = $props();

/** A release faster than this (px/s) throws the card even when it has moved only a little. */
const FLICK = 500;
const hintId = $props.id();

// svelte-ignore state_referenced_locally -- seeds the uncontrolled position once
let own = $state(defaultIndex);
const position = $derived(Math.min(items.length, Math.max(0, index ?? own)));
function setPosition(next: number) {
	if (index === undefined) own = next;
	else index = next;
	onIndexChange?.(next);
}
let history = $state<{ key: string; decision: CardDecision }[]>([]);
let flying = $state<string[]>([]);
let returning = $state<Record<string, DeckReturn>>({});
let message = $state("");
let stage = $state<HTMLDivElement>();
let engine: ReturnType<typeof createCardDeck> | null = null;
// Where each thrown card left the screen; only undo and start over read it.
const exits: Record<string, DeckExit> = {};
const top = $derived(items[position]);
const remaining = $derived(Math.max(0, items.length - position));

function decide(decision: CardDecision) {
	const current = top;
	if (!current) return;
	const key = getKey(current);
	setPosition(position + 1);
	history = [...history, { key, decision }];
	flying = [...flying, key];
	returning = {};
	const left = remaining;
	const verdict = outcomes ? ` ${outcomes[decision]}` : `: ${labels[decision]}`;
	message = `${getLabel(current)}${verdict}. ${left ? `${left} left.` : "All cards reviewed."}`;
	onDecide?.(current, decision);
}

function undo() {
	const last = history[history.length - 1];
	const item = last && items.find((entry) => getKey(entry) === last.key);
	if (!last || !item) return;
	const exit = exits[last.key];
	setPosition(position - 1);
	history = history.slice(0, -1);
	flying = flying.filter((key) => key !== last.key);
	returning = exit ? { [last.key]: { ...exit, delay: 0 } } : {};
	message = `${getLabel(item)} restored.`;
	onUndo?.(item, last.decision);
}

function reset() {
	if (!history.length) return;
	// The deck deals itself back: the card that will sit deepest returns first, the top card last.
	const count = Math.min(VISIBLE, items.length);
	const back: Record<string, DeckReturn> = {};
	items.slice(0, count).forEach((item, index) => {
		const key = getKey(item);
		const exit = exits[key];
		if (exit && index < position)
			back[key] = { ...exit, delay: (count - 1 - index) * 0.06 };
	});
	setPosition(0);
	history = [];
	flying = [];
	returning = back;
	message = "All cards are back in the stack.";
	onReset?.();
}

function release(key: string, offset: DeckPoint, velocity: DeckPoint, width: number) {
	const direction = Math.sign(offset.x);
	if (!direction || !top || getKey(top) !== key) return false;
	const flick =
		Math.abs(velocity.x) > FLICK &&
		Math.sign(velocity.x) === direction &&
		Math.abs(offset.x) > 12;
	const far =
		Math.abs(offset.x) > Math.min(width * 0.35, 140) &&
		!(Math.sign(velocity.x) === -direction && Math.abs(velocity.x) > 300);
	if (!flick && !far) return false;
	decide(direction > 0 ? "right" : "left");
	return true;
}

const options = {
	onRelease: release,
	onThrown: (key: string, exit: DeckExit) => {
		exits[key] = exit;
	},
	onGone: (key: string) => {
		flying = flying.filter((entry) => entry !== key);
	},
	get layout() {
		return variant;
	},
};

const decided = $derived(new Map(history.map((entry) => [entry.key, entry.decision])));
const entries = $derived.by(() => {
	const windowKeys = new Set(items.slice(position, position + VISIBLE).map(getKey));
	return items
		.filter((item) => windowKeys.has(getKey(item)) || flying.includes(getKey(item)))
		.map((item) => {
			const key = getKey(item);
			const decision = decided.get(key) ?? null;
			const card: DeckCard = {
				key,
				depth: decision ? 0 : items.indexOf(item) - position,
				decision,
				returnFrom: returning[key],
			};
			return { item, card };
		});
});
const isEmpty = $derived(position >= items.length && flying.length === 0);

$effect(() => {
	const el = stage;
	if (!el) return;
	const created = untrack(() => createCardDeck(el, options));
	engine = created;
	return () => {
		created.destroy();
		engine = null;
	};
});

// Runs after the DOM reflects `entries`, so the engine finds every rendered card.
$effect(() => {
	const deck = entries.map((entry) => entry.card);
	untrack(() => engine?.sync(deck));
});

function onkeydown(event: KeyboardEvent) {
	if (event.target !== event.currentTarget) return;
	if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
		event.preventDefault();
		decide(event.key === "ArrowRight" ? "right" : "left");
	} else if (
		event.key === "Backspace" ||
		((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z")
	) {
		event.preventDefault();
		undo();
	}
}

const s = $derived(cardStack({ variant, size }));

$effect(() => {
	// A fresh snapshot, so the engine sees the layout change and repaints.
	const layout = variant;
	untrack(() => engine?.update({ ...options, layout }));
});
</script>

{#snippet icon(name: "x" | "check" | "undo")}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		{#if name === "x"}
			<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
		{:else if name === "check"}
			<path d="M3.5 8.4 6.4 11 12.5 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
		{:else}
			<path d="M3 8a5 5 0 1 0 1.5-3.5M3 2.5v2.5h2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
		{/if}
	</svg>
{/snippet}

<div data-slot="card-stack" class={cn(s.root(), classProp)}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -- the stack takes focus so arrow keys decide the top card -->
	<div
		bind:this={stage}
		class={s.stage()}
		role="group"
		aria-roledescription="card stack"
		aria-label={label}
		aria-describedby={hintId}
		tabindex="0"
		{onkeydown}
	>
		{#each entries as { item, card } (card.key)}
			{@const interactive = !card.decision && card.depth === 0}
			<div
				data-stack-slot={card.key}
				class={s.slot()}
				style:--d={card.depth}
				style:z-index={card.decision ? 20 + flying.indexOf(card.key) : VISIBLE - card.depth}
				aria-hidden={interactive ? undefined : true}
				inert={!interactive}
			>
				<div
					data-stack-card=""
					data-top={interactive ? "" : undefined}
					class={s.card()}
					role="group"
					aria-label={interactive ? `${getLabel(item)}, ${items.indexOf(item) + 1} of ${items.length}` : undefined}
				>
					<div class={s.face()}>
						{@render cardSnippet(item)}
						<span data-stack-shade="" class={s.shade()} aria-hidden="true"></span>
					</div>
					<span data-stack-stamp="right" data-side="right" class={s.stamp()} aria-hidden="true">
						{@render icon("check")}{labels.right}
					</span>
					<span data-stack-stamp="left" data-side="left" class={s.stamp()} aria-hidden="true">
						{@render icon("x")}{labels.left}
					</span>
				</div>
			</div>
		{/each}
		{#if isEmpty}
			<div class={s.empty()}>
				{#if emptySnippet}
					{@render emptySnippet(reset)}
				{:else}
					<p class={s.emptyTitle()}>All cards reviewed</p>
					<Button variant="outline" onclick={reset}>{@render icon("undo")}Start over</Button>
				{/if}
			</div>
		{/if}
	</div>
	{#if buttons}
	<div class={s.controls()}>
		<Button variant="outline" aria-disabled={!top || undefined} onclick={() => top && decide("left")}>
			{@render icon("x")}{labels.left}
		</Button>
		<Button variant="ghost" aria-disabled={!history.length || undefined} onclick={undo}>
			{@render icon("undo")}<span class={s.undoLabel()}>Undo</span>
		</Button>
		<Button aria-disabled={!top || undefined} onclick={() => top && decide("right")}>
			{@render icon("check")}{labels.right}
		</Button>
	</div>
	{/if}
	<p id={hintId} class="sr-only">
		Drag the top card, or use the left and right arrow keys to {labels.left.toLowerCase()} or {labels.right.toLowerCase()} it.
		Backspace undoes the last decision.
	</p>
	<p class="sr-only" role="status" aria-live="polite">{message}</p>
</div>
