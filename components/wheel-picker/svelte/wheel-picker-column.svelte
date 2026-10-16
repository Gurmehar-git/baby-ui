<script lang="ts">
import { untrack } from "svelte";
import { cn } from "../../lib/svelte/cn";
import { useWheel } from "./context";
import {
	nearestEnabled,
	normalizeWheelOption,
	WHEEL_FLICK,
	type WheelPickerOption,
	wheelPicker,
} from "./variants";

let {
	options,
	value = $bindable(),
	defaultValue,
	onValueChange,
	onValueCommit,
	loop = false,
	disabled = false,
	name,
	"aria-label": ariaLabel,
	class: classProp,
}: {
	options: WheelPickerOption[];
	/** Bindable selected value. */
	value?: string;
	defaultValue?: string;
	/** Fires as each row passes the centre. */
	onValueChange?: (value: string) => void;
	/** Fires once the wheel comes to rest on a value. */
	onValueCommit?: (value: string) => void;
	/** Wrap around; needs at least rows + 2 options. */
	loop?: boolean;
	disabled?: boolean;
	/** Adds a hidden input for forms. */
	name?: string;
	"aria-label"?: string;
	class?: string;
} = $props();

const wheel = useWheel();
const uid = $props.id();
const id = `wheel-${uid}`;
const items = $derived(options.map(normalizeWheelOption));
const count = $derived(items.length);
const h = $derived(wheel.itemHeight);
const canLoop = $derived(loop && count >= Number(wheel.rows) + 2);
const copies = $derived(canLoop ? 3 : 1);
const base = $derived(canLoop ? count : 0);
const styles = $derived(wheelPicker({ rows: wheel.rows, lens: wheel.lens }));

const initial = untrack(() => {
	const i = items.findIndex((item) => item.value === (value ?? defaultValue));
	return i >= 0
		? i
		: Math.max(
				0,
				items.findIndex((item) => !item.disabled),
			);
});
let active = $state(initial);
let committed = initial;
let viewport = $state<HTMLDivElement | null>(null);
let dragging = $state(false);
let drag: {
	y: number;
	top: number;
	lastY: number;
	lastT: number;
	v: number;
	moved: boolean;
} | null = null;
let suppressClick = false;
let pending: number | null = null;

const wrap = (raw: number) =>
	canLoop ? ((raw % count) + count) % count : Math.min(Math.max(raw, 0), count - 1);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollToRaw = (raw: number, smooth = true) =>
	viewport?.scrollTo({
		top: raw * h,
		behavior: smooth && !reduced() ? "smooth" : "auto",
	});
const currentRaw = () => Math.round((viewport?.scrollTop ?? 0) / h);

/** Raw row showing logical `index` nearest `from`, so a looped wheel takes the short way round. */
function rawFor(index: number, from: number) {
	if (!canLoop) return index;
	let diff = (((index - wrap(from)) % count) + count) % count;
	if (diff > count / 2) diff -= count;
	return from + diff;
}

function goTo(index: number, direction = 0) {
	const target = wrap(nearestEnabled(items, index, direction, canLoop));
	const raw = rawFor(target, pending ?? currentRaw());
	pending = raw;
	scrollToRaw(raw);
}

/** Jump without snap, which can otherwise nudge an instant scroll a row over. */
function jumpToRaw(raw: number) {
	const node = viewport;
	if (!node) return;
	node.style.scrollSnapType = "none";
	node.scrollTop = raw * h;
	requestAnimationFrame(() => {
		node.style.scrollSnapType = "";
	});
}

function select(index: number) {
	active = index;
	const item = items[index];
	if (!item) return;
	if (value !== undefined) value = item.value;
	onValueChange?.(item.value);
}

function settle() {
	if (drag) return;
	const raw = currentRaw();
	const index = wrap(raw);
	if (pending !== null && pending !== raw) return;
	pending = null;
	if (canLoop && (raw < count || raw >= 2 * count)) return jumpToRaw(base + index);
	if (items[index]?.disabled) return goTo(index);
	if (committed === index) return;
	committed = index;
	const item = items[index];
	if (item) onValueCommit?.(item.value);
}

$effect(() => {
	void h;
	void wheel.rows;
	const node = viewport;
	if (!node) return;
	untrack(() => jumpToRaw(base + active));
});

$effect(() => {
	const wanted = value;
	untrack(() => {
		if (wanted === undefined || drag) return;
		const index = items.findIndex((item) => item.value === wanted);
		if (index >= 0 && index !== active) goTo(index);
	});
});

$effect(() => {
	const node = viewport;
	if (!node) return;
	let frame = 0;
	let idle: ReturnType<typeof setTimeout> | undefined;
	const onScroll = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const index = wrap(currentRaw());
			if (index !== active) select(index);
		});
		clearTimeout(idle);
		idle = setTimeout(settle, 140);
	};
	node.addEventListener("scroll", onScroll, { passive: true });
	node.addEventListener("scrollend", settle);
	return () => {
		cancelAnimationFrame(frame);
		clearTimeout(idle);
		node.removeEventListener("scroll", onScroll);
		node.removeEventListener("scrollend", settle);
	};
});

function onKeyDown(event: KeyboardEvent) {
	const steps: Record<string, number> = {
		ArrowDown: 1,
		ArrowUp: -1,
		PageDown: Number(wheel.rows),
		PageUp: -Number(wheel.rows),
	};
	if (event.key === "Home") goTo(0, 1);
	else if (event.key === "End") goTo(count - 1, -1);
	else if (steps[event.key] !== undefined) {
		const step = steps[event.key] ?? 0;
		// Step from where the wheel is heading, so presses during a scroll are not lost.
		const next = wrap(pending ?? currentRaw()) + step;
		goTo(canLoop ? next : Math.min(Math.max(next, 0), count - 1), Math.sign(step));
	} else return;
	event.preventDefault();
}

function onPointerDown(event: PointerEvent) {
	if (event.pointerType !== "mouse" || event.button !== 0 || !viewport) return;
	const now = performance.now();
	drag = {
		y: event.clientY,
		top: viewport.scrollTop,
		lastY: event.clientY,
		lastT: now,
		v: 0,
		moved: false,
	};
}

function onPointerMove(event: PointerEvent) {
	if (!drag || !viewport) return;
	const dy = event.clientY - drag.y;
	if (!drag.moved && Math.abs(dy) < 3) return;
	if (!drag.moved) {
		drag.moved = true;
		dragging = true;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}
	const now = performance.now();
	drag.v = ((drag.lastY - event.clientY) / Math.max(1, now - drag.lastT)) * 1000;
	drag.lastY = event.clientY;
	drag.lastT = now;
	viewport.scrollTop = drag.top - dy;
}

function onPointerUp() {
	const state = drag;
	drag = null;
	if (!state?.moved) return;
	dragging = false;
	suppressClick = true;
	setTimeout(() => {
		suppressClick = false;
	}, 0);
	const projected = (viewport?.scrollTop ?? 0) + state.v * WHEEL_FLICK;
	const raw = Math.round(projected / h);
	const index = nearestEnabled(
		items,
		canLoop ? raw : Math.min(Math.max(raw, 0), count - 1),
		Math.sign(state.v),
		canLoop,
	);
	scrollToRaw(canLoop ? index : wrap(index));
}
</script>

<div data-slot="wheel-picker-column" class={cn(styles.column(), classProp)}>
	<div aria-hidden="true" class={styles.lens()}></div>
	<div
		bind:this={viewport}
		{id}
		role="listbox"
		tabindex={disabled ? -1 : 0}
		aria-label={ariaLabel}
		aria-disabled={disabled || undefined}
		aria-activedescendant="{id}-{base + active}"
		data-disabled={disabled || undefined}
		data-dragging={dragging || undefined}
		class={styles.viewport()}
		onkeydown={onKeyDown}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		{#each { length: copies * count }, raw (raw)}
			{@const item = items[raw % count]}
			{@const main = raw >= base && raw < base + count}
			{#if item}
				<!-- svelte-ignore a11y_click_events_have_key_events -- the listbox handles keys. -->
				<div
					id="{id}-{raw}"
					role="option"
					aria-hidden={main ? undefined : "true"}
					aria-selected={main && raw - base === active}
					aria-disabled={item.disabled || undefined}
					class={styles.item()}
					onclick={() => {
						if (!suppressClick && !item.disabled) scrollToRaw(raw);
					}}
				>
					<span data-disabled={item.disabled || undefined} class={styles.label()}>{item.label}</span>
				</div>
			{/if}
		{/each}
	</div>
	{#if name}
		<input type="hidden" {name} value={items[active]?.value ?? ""} />
	{/if}
</div>
