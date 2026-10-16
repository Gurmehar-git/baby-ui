<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { createSlotText } from "./slot";
import { type SlotTextSize, type SlotTextVariant, slotText } from "./variants";

let {
	value,
	format,
	duration = 0.9,
	stagger = 0.07,
	spins = 1,
	align,
	announce = false,
	variant = "default",
	size = "inherit",
	class: classProp,
	style,
}: {
	/** The value to show; numbers pass through `format`. */
	value: string | number;
	/** Formats a number; en-US grouping by default, so 12480 reads 12,480. */
	format?: (value: number) => string;
	/** Seconds the first reel spins; later reels add `stagger`. */
	duration?: number;
	/** Seconds between reels stopping, left to right. */
	stagger?: number;
	/** Extra full turns a digit makes before it lands; 0 rolls straight there. */
	spins?: number;
	/** Which end reels match from when the length changes; numbers default to the end. */
	align?: "start" | "end";
	/** Announce new values politely to screen readers. */
	announce?: boolean;
	variant?: SlotTextVariant;
	size?: SlotTextSize;
	class?: string;
	style?: string;
} = $props();

const text = $derived(
	typeof value === "number"
		? format
			? format(value)
			: value.toLocaleString("en-US")
		: value,
);
// Server and first paint only; after that the engine owns the reels.
const initialText = untrack(() => text);
const s = $derived(slotText({ variant, size }));
const options = $derived({
	duration,
	stagger,
	spins,
	fromEnd: (align ?? (typeof value === "number" ? "end" : "start")) === "end",
	classes: {
		reel: s.reel(),
		sizer: s.sizer(),
		window: s.window(),
		track: s.track(),
		cell: s.cell(),
	},
});
let reels = $state<HTMLElement>();
let engine: ReturnType<typeof createSlotText> | null = null;
let last: string | number = untrack(() => value);

$effect(() => {
	const el = reels;
	if (!el) return;
	const created = untrack(() => createSlotText(el, initialText, options));
	engine = created;
	return () => created.destroy();
});
$effect(() => {
	engine?.update(options);
	const next = value;
	const before = last;
	last = next;
	engine?.set(
		text,
		typeof next === "number" && typeof before === "number" ? next >= before : true,
	);
});
</script>

<span data-slot="slot-text" class={cn(s.root(), classProp)} {style}>
	<span class="sr-only" aria-live={announce ? "polite" : undefined}>{text}</span>
	<span bind:this={reels} aria-hidden="true" class={s.reels()}>{initialText}</span>
</span>
