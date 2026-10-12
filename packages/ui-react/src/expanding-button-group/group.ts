export type ExpandingGroupItem = {
	/** Stable key, also passed to `onAction`. */
	id: string;
	/** Shown when expanded and always the accessible name. A short verb, such as "Archive". */
	label: string;
	/** Past tense shown in place after the action, such as "Archived"; omit for actions that open something. */
	doneLabel?: string;
	/** Runs the action. Return false, or reject, to skip the confirmation; a promise keeps it busy. */
	onSelect?: () => unknown;
	/** Dimmed and inert, but still focusable and still reveals its label. */
	disabled?: boolean;
};

export type ExpandingGroupState = {
	/** The item the pointer or focus wants expanded, or null to rest. */
	intent: string | null;
	done: string | null;
	busy: string | null;
	/** Status text for the live region. */
	announcement: string;
};

export type ExpandingGroupOptions = {
	items: readonly ExpandingGroupItem[];
	confirmDuration: number;
	onAction?: (id: string) => void;
	onState: (state: ExpandingGroupState) => void;
};

/** Pixels the pointer must travel into a neighbour before the expansion moves to it. */
const HYSTERESIS = 4;
const ZWSP = String.fromCharCode(0x200b);

/**
 * Decides which action shows its label: real pointer movement, keyboard focus, a first tap on
 * touch, and an in-place confirmation that holds the label until it times out.
 */
export function createExpandingGroup(root: HTMLElement, initial: ExpandingGroupOptions) {
	let options = initial;
	let state: ExpandingGroupState = {
		intent: null,
		done: null,
		busy: null,
		announcement: "",
	};
	let pointerOver: string | null = null;
	let pointerAt: { x: number; y: number } | null = null;
	let keyFocus: string | null = null;
	let touchOpen: string | null = null;
	let press: { id: string; kind: string; wasExpanded: boolean } | null = null;
	let timer = 0;
	let seq = 0;
	let alive = true;

	const set = (next: Partial<ExpandingGroupState>) => {
		state = { ...state, ...next };
		options.onState(state);
	};
	const find = (id: string | null | undefined) =>
		options.items.find((item) => item.id === id);
	const itemOf = (target: EventTarget | null) =>
		target instanceof Element ? target.closest<HTMLElement>("[data-ebg-item]") : null;
	const expandedNow = (id: string) =>
		root
			.querySelector(`[data-ebg-item][data-id="${CSS.escape(id)}"]`)
			?.hasAttribute("data-expanded") ?? false;

	const confirm = (item: ExpandingGroupItem) => {
		clearTimeout(timer);
		seq += 1;
		// A zero-width space alternates so a repeated word is announced again.
		set({ done: item.id, announcement: `${item.doneLabel}${seq % 2 ? "" : ZWSP}` });
		timer = window.setTimeout(() => {
			const stay = pointerOver === item.id || keyFocus === item.id;
			if (!stay && touchOpen === item.id) touchOpen = null;
			set({
				done: null,
				intent:
					stay || state.intent !== item.id ? state.intent : (pointerOver ?? keyFocus),
			});
		}, options.confirmDuration);
	};

	async function activate(item: ExpandingGroupItem) {
		if (item.disabled || state.busy === item.id || state.done === item.id) return;
		set({ intent: item.id });
		options.onAction?.(item.id);
		let result: unknown;
		try {
			const pending = item.onSelect?.();
			if (pending instanceof Promise) {
				set({ busy: item.id });
				result = await pending;
			} else result = pending;
		} catch {
			result = false;
		}
		if (!alive) return;
		if (state.busy === item.id) set({ busy: null });
		if (result === false || !item.doneLabel) return;
		confirm(item);
	}

	const onPointerDown = (event: PointerEvent) => {
		const button = itemOf(event.target);
		const id = button?.dataset.id;
		if (id) press = { id, kind: event.pointerType, wasExpanded: expandedNow(id) };
	};
	// Touch has no hover: the first tap reveals the label, the second runs it.
	const onClick = (event: MouseEvent) => {
		const item = find(itemOf(event.target)?.dataset.id);
		if (!item) return;
		const last = press;
		press = null;
		if (last?.id === item.id && last.kind === "touch" && !last.wasExpanded) {
			touchOpen = item.id;
			set({ intent: item.id });
			return;
		}
		if (last?.kind === "touch") touchOpen = item.id;
		void activate(item);
	};
	// Only keyboard focus expands; a click or tap has its own path.
	const onFocusIn = (event: FocusEvent) => {
		const button = itemOf(event.target);
		const id = button?.dataset.id;
		if (!button || !id || !button.matches(":focus-visible")) return;
		keyFocus = id;
		set({ intent: id });
	};
	const onFocusOut = (event: FocusEvent) => {
		if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
		keyFocus = null;
		touchOpen = null;
		set({ intent: pointerOver ?? state.done });
	};
	// Hover follows real movement only: a button sliding under a resting pointer must not take over.
	const onPointerMove = (event: PointerEvent) => {
		if (event.pointerType !== "mouse") return;
		if (
			pointerAt &&
			Math.abs(pointerAt.x - event.clientX) < 1 &&
			Math.abs(pointerAt.y - event.clientY) < 1
		)
			return;
		pointerAt = { x: event.clientX, y: event.clientY };
		const button = itemOf(event.target);
		const id = button?.dataset.id;
		if (!button || !id || id === pointerOver) return;
		if (pointerOver) {
			const box = button.getBoundingClientRect();
			if (event.clientX < box.left + HYSTERESIS || event.clientX > box.right - HYSTERESIS)
				return;
		}
		pointerOver = id;
		set({ intent: id });
	};
	const onPointerLeave = (event: PointerEvent) => {
		if (event.pointerType !== "mouse") return;
		pointerAt = null;
		pointerOver = null;
		set({ intent: state.done ?? keyFocus });
	};
	// A tap outside closes a label opened by a first tap.
	const onOutside = (event: PointerEvent) => {
		if (!touchOpen || state.intent !== touchOpen) return;
		if (event.target instanceof Node && root.contains(event.target)) return;
		touchOpen = null;
		set({ intent: state.done ?? keyFocus });
	};

	root.addEventListener("pointerdown", onPointerDown);
	root.addEventListener("click", onClick);
	root.addEventListener("focusin", onFocusIn);
	root.addEventListener("focusout", onFocusOut);
	root.addEventListener("pointermove", onPointerMove);
	root.addEventListener("pointerleave", onPointerLeave);
	document.addEventListener("pointerdown", onOutside, true);

	return {
		update(next: ExpandingGroupOptions) {
			options = next;
		},
		destroy() {
			alive = false;
			clearTimeout(timer);
			root.removeEventListener("pointerdown", onPointerDown);
			root.removeEventListener("click", onClick);
			root.removeEventListener("focusin", onFocusIn);
			root.removeEventListener("focusout", onFocusOut);
			root.removeEventListener("pointermove", onPointerMove);
			root.removeEventListener("pointerleave", onPointerLeave);
			document.removeEventListener("pointerdown", onOutside, true);
		},
	};
}
