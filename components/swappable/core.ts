import {
	type BeforeSwapEvent,
	type Config,
	createSwapy,
	type SlotItemMap,
	type SlotItemMapArray,
	type SwapEndEvent,
	type SwapEvent,
	type SwapStartEvent,
	type Swapy,
	utils,
} from "swapy";

export type {
	BeforeSwapEvent,
	Config as SwapyConfig,
	SlotItemMapArray,
	SwapEndEvent,
	SwapEvent,
	SwapStartEvent,
	Swapy,
};

export interface SwappableHandlers {
	onSwap?: (event: SwapEvent) => void;
	onSwapStart?: (event: SwapStartEvent) => void;
	onSwapEnd?: (event: SwapEndEvent) => void;
	/** Return false to refuse a swap, e.g. to keep a slot locked. */
	onBeforeSwap?: (event: BeforeSwapEvent) => boolean;
	/** Text for a polite live region after a keyboard move. */
	announce?: (text: string) => void;
}

/** One slot per item, in order: the starting map for a layout rendered from data. */
export const initSlotItemMap = <Item>(items: Item[], id: keyof Item): SlotItemMapArray =>
	utils.initSlotItemMap(items, id);

/** Each slot with the item now in it (or null), so `manualSwap` layouts render from the map. */
export const toSlottedItems = <Item>(
	items: Item[],
	id: keyof Item,
	map: SlotItemMapArray,
) => utils.toSlottedItems(items, id, map);

const toSlotItemMap = (asArray: SlotItemMapArray): SlotItemMap => ({
	asArray,
	asObject: Object.fromEntries(asArray.map((e) => [e.slot, e.item])),
	asMap: new Map(asArray.map((e) => [e.slot, e.item])),
});

/** Alt+arrow: previous or next slot, as Swapy has no keyboard path of its own. */
function keyDelta(event: KeyboardEvent): -1 | 1 | 0 {
	if (!event.altKey) return 0;
	if (event.key === "ArrowUp" || event.key === "ArrowLeft") return -1;
	if (event.key === "ArrowDown" || event.key === "ArrowRight") return 1;
	return 0;
}

/** The swap a keyboard move makes, shaped like Swapy's own so one `onSwap` handles both. */
function keyboardSwap(swapy: Swapy, itemId: string, delta: -1 | 1): SwapEvent | null {
	const old = swapy.slotItemMap().asArray;
	const from = old.findIndex((e) => e.item === itemId);
	const a = old[from];
	const b = old[from + delta];
	if (!a || !b) return null;
	const next = old.map((e, i) =>
		i === from
			? { slot: e.slot, item: b.item }
			: i === from + delta
				? { slot: e.slot, item: a.item }
				: e,
	);
	return {
		oldSlotItemMap: toSlotItemMap(old),
		newSlotItemMap: toSlotItemMap(next),
		fromSlot: a.slot,
		toSlot: b.slot,
		draggingItem: itemId,
		swappedWithItem: b.item,
	};
}

const slotEl = (container: HTMLElement, id: string) =>
	container.querySelector<HTMLElement>(`[data-swapy-slot="${CSS.escape(id)}"]`);

/** Without `manualSwap`, the DOM is ours to change: move the two items as Swapy would. */
function swapItemNodes(container: HTMLElement, event: SwapEvent) {
	const from = slotEl(container, event.fromSlot);
	const to = slotEl(container, event.toSlot);
	if (!from || !to) return;
	const moving = from.querySelector("[data-swapy-item]");
	const other = to.querySelector("[data-swapy-item]");
	if (moving) to.append(moving);
	if (other) from.append(other);
}

const LAYOUT_ATTRS = ["data-swapy-slot", "data-swapy-item"];

/**
 * Swapy on `container` plus what it lacks: a keyboard path, and a re-read of the layout when
 * slots or items come and go (deferred until a drag ends). Both ports mount through this.
 */
export function mountSwappable(
	container: HTMLElement,
	config: Partial<Config>,
	handlers: () => SwappableHandlers,
) {
	const swapy = createSwapy(container, { autoScrollOnDrag: true, ...config });
	let enabled = config.enabled ?? true;
	let dragging = false;
	let stale = false;
	let frame = 0;

	const refresh = () => {
		if (dragging) {
			stale = true;
			return;
		}
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => swapy.update());
	};
	const observer = new MutationObserver((records) => {
		const touched = records.some(
			(r) =>
				r.type === "attributes" ||
				[...r.addedNodes, ...r.removedNodes].some(
					(n) =>
						n instanceof Element &&
						LAYOUT_ATTRS.some((a) => n.hasAttribute(a) || n.querySelector(`[${a}]`)),
				),
		);
		if (touched) refresh();
	});
	observer.observe(container, {
		childList: true,
		subtree: true,
		attributeFilter: LAYOUT_ATTRS,
	});

	swapy.onSwap((e) => handlers().onSwap?.(e));
	swapy.onSwapStart((e) => {
		dragging = true;
		handlers().onSwapStart?.(e);
	});
	swapy.onSwapEnd((e) => {
		dragging = false;
		if (stale) {
			stale = false;
			refresh();
		}
		handlers().onSwapEnd?.(e);
	});
	swapy.onBeforeSwap((e) => handlers().onBeforeSwap?.(e) ?? true);

	function onKeydown(event: KeyboardEvent) {
		const delta = keyDelta(event);
		if (!enabled || !delta || !(event.target instanceof Element)) return;
		const id = event.target.closest("[data-swapy-item]")?.getAttribute("data-swapy-item");
		if (!id) return;
		const swap = keyboardSwap(swapy, id, delta);
		if (!swap) return;
		if (
			handlers().onBeforeSwap?.({
				fromSlot: swap.fromSlot,
				toSlot: swap.toSlot,
				draggingItem: id,
				swapWithItem: swap.swappedWithItem,
			}) === false
		)
			return;
		event.preventDefault();
		if (!config.manualSwap) {
			swapItemNodes(container, swap);
			swapy.update();
		}
		handlers().onSwap?.(swap);
		const order = swap.newSlotItemMap.asArray;
		handlers().announce?.(
			`Moved to position ${order.findIndex((e) => e.item === id) + 1} of ${order.length}`,
		);
		// A manual layout re-renders the item in its new slot, so focus follows it there.
		requestAnimationFrame(() =>
			container
				.querySelector<HTMLElement>(`[data-swapy-item="${CSS.escape(id)}"]`)
				?.focus(),
		);
	}
	container.addEventListener("keydown", onKeydown);

	return {
		swapy,
		setEnabled(next: boolean) {
			enabled = next;
			swapy.enable(next);
		},
		destroy() {
			cancelAnimationFrame(frame);
			observer.disconnect();
			container.removeEventListener("keydown", onKeydown);
			swapy.destroy();
		},
	};
}
