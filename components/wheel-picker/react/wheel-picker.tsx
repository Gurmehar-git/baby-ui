"use client";

import {
	type CSSProperties,
	createContext,
	type KeyboardEvent,
	type PointerEvent,
	type ReactNode,
	useContext,
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	nearestEnabled,
	normalizeWheelOption,
	WHEEL_FLICK,
	type WheelPickerOption,
	type WheelPickerRows,
	wheelPicker,
} from "../variants";

export type { WheelPickerOption, WheelPickerRows };

const WheelContext = createContext({
	itemHeight: 44,
	rows: "5" as WheelPickerRows,
	lens: true,
});

export interface WheelPickerProps {
	children?: ReactNode;
	/** Row height in px. */
	itemHeight?: number;
	/** Rows visible at once. */
	rows?: WheelPickerRows;
	/** Tint behind the selected row. */
	lens?: boolean;
	"aria-label"?: string;
	className?: string;
}

export function WheelPicker({
	children,
	itemHeight = 44,
	rows = "5",
	lens = true,
	"aria-label": ariaLabel,
	className,
}: WheelPickerProps) {
	const context = useMemo(() => ({ itemHeight, rows, lens }), [itemHeight, rows, lens]);
	return (
		<WheelContext.Provider value={context}>
			{/* biome-ignore lint/a11y/useSemanticElements: a fieldset's chrome fights the barrel layout. */}
			<div
				role="group"
				aria-label={ariaLabel}
				data-slot="wheel-picker"
				className={cn(wheelPicker({ rows }).root(), className)}
				style={{ "--wheel-h": `${itemHeight}px` } as CSSProperties}
			>
				{children}
			</div>
		</WheelContext.Provider>
	);
}

export interface WheelPickerColumnProps {
	options: WheelPickerOption[];
	/** Controlled selected value. */
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
	className?: string;
}

export function WheelPickerColumn({
	options,
	value,
	defaultValue,
	onValueChange,
	onValueCommit,
	loop = false,
	disabled = false,
	name,
	"aria-label": ariaLabel,
	className,
}: WheelPickerColumnProps) {
	const { itemHeight: h, rows, lens } = useContext(WheelContext);
	const id = `wheel-${useId().replace(/:/g, "")}`;
	const items = useMemo(() => options.map(normalizeWheelOption), [options]);
	const count = items.length;
	const canLoop = loop && count >= Number(rows) + 2;
	const copies = canLoop ? 3 : 1;
	const base = canLoop ? count : 0;
	const styles = wheelPicker({ rows, lens });
	const viewport = useRef<HTMLDivElement>(null);

	const [initial] = useState(() => {
		const i = items.findIndex((item) => item.value === (value ?? defaultValue));
		return i >= 0
			? i
			: Math.max(
					0,
					items.findIndex((item) => !item.disabled),
				);
	});
	const [active, setActive] = useState(initial);
	const latest = useRef({
		active,
		committed: initial,
		onValueChange,
		onValueCommit,
		items,
	});
	latest.current = { ...latest.current, active, onValueChange, onValueCommit, items };
	const [dragging, setDragging] = useState(false);
	const drag = useRef<{
		y: number;
		top: number;
		lastY: number;
		lastT: number;
		v: number;
		moved: boolean;
	} | null>(null);
	const suppressClick = useRef(false);
	const pending = useRef<number | null>(null);

	const wrap = (raw: number) =>
		canLoop ? ((raw % count) + count) % count : Math.min(Math.max(raw, 0), count - 1);
	const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
	const scrollToRaw = (raw: number, smooth = true) =>
		viewport.current?.scrollTo({
			top: raw * h,
			behavior: smooth && !reduced() ? "smooth" : "auto",
		});
	const currentRaw = () => Math.round((viewport.current?.scrollTop ?? 0) / h);
	/** Raw row showing logical `index` nearest `from`, so a looped wheel takes the short way round. */
	const rawFor = (index: number, from: number) => {
		if (!canLoop) return index;
		let diff = (((index - wrap(from)) % count) + count) % count;
		if (diff > count / 2) diff -= count;
		return from + diff;
	};
	const goTo = (index: number, direction = 0) => {
		const target = wrap(nearestEnabled(items, index, direction, canLoop));
		const raw = rawFor(target, pending.current ?? currentRaw());
		pending.current = raw;
		scrollToRaw(raw);
	};
	/** Jump without snap, which can otherwise nudge an instant scroll a row over. */
	const jumpToRaw = (raw: number) => {
		const node = viewport.current;
		if (!node) return;
		node.style.scrollSnapType = "none";
		node.scrollTop = raw * h;
		requestAnimationFrame(() => {
			node.style.scrollSnapType = "";
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: h, rows only re-run it on change; jumpToRaw, base left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		jumpToRaw(base + latest.current.active);
	}, [h, rows]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: goTo left out on purpose, the listed values decide when it runs.
	useEffect(() => {
		if (value === undefined || drag.current) return;
		const index = items.findIndex((item) => item.value === value);
		if (index >= 0 && index !== latest.current.active) goTo(index);
	}, [value, items]);

	const handlers = useRef({ settle: () => {}, sync: () => {} });
	handlers.current = {
		settle: () => {
			if (drag.current) return;
			const raw = currentRaw();
			const index = wrap(raw);
			if (pending.current !== null && pending.current !== raw) return;
			pending.current = null;
			if (canLoop && (raw < count || raw >= 2 * count)) return jumpToRaw(base + index);
			if (latest.current.items[index]?.disabled) return goTo(index);
			if (latest.current.committed === index) return;
			latest.current.committed = index;
			const item = latest.current.items[index];
			if (item) latest.current.onValueCommit?.(item.value);
		},
		sync: () => {
			const index = wrap(currentRaw());
			if (index === latest.current.active) return;
			setActive(index);
			const item = latest.current.items[index];
			if (item) latest.current.onValueChange?.(item.value);
		},
	};

	useEffect(() => {
		const node = viewport.current;
		if (!node) return;
		let frame = 0;
		let idle: ReturnType<typeof setTimeout> | undefined;
		const settle = () => handlers.current.settle();
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => handlers.current.sync());
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
	}, []);

	const onKeyDown = (event: KeyboardEvent) => {
		const steps: Record<string, number> = {
			ArrowDown: 1,
			ArrowUp: -1,
			PageDown: Number(rows),
			PageUp: -Number(rows),
		};
		if (event.key === "Home") goTo(0, 1);
		else if (event.key === "End") goTo(count - 1, -1);
		else if (steps[event.key] !== undefined) {
			const step = steps[event.key] ?? 0;
			// Step from where the wheel is heading, so presses during a scroll are not lost.
			const next = wrap(pending.current ?? currentRaw()) + step;
			goTo(canLoop ? next : Math.min(Math.max(next, 0), count - 1), Math.sign(step));
		} else return;
		event.preventDefault();
	};

	const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== "mouse" || event.button !== 0 || !viewport.current) return;
		const now = performance.now();
		drag.current = {
			y: event.clientY,
			top: viewport.current.scrollTop,
			lastY: event.clientY,
			lastT: now,
			v: 0,
			moved: false,
		};
	};
	const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const state = drag.current;
		if (!state || !viewport.current) return;
		const dy = event.clientY - state.y;
		if (!state.moved && Math.abs(dy) < 3) return;
		if (!state.moved) {
			state.moved = true;
			setDragging(true);
			event.currentTarget.setPointerCapture(event.pointerId);
		}
		const now = performance.now();
		state.v = ((state.lastY - event.clientY) / Math.max(1, now - state.lastT)) * 1000;
		state.lastY = event.clientY;
		state.lastT = now;
		viewport.current.scrollTop = state.top - dy;
	};
	const onPointerUp = () => {
		const state = drag.current;
		drag.current = null;
		if (!state?.moved) return;
		setDragging(false);
		suppressClick.current = true;
		setTimeout(() => {
			suppressClick.current = false;
		}, 0);
		const projected = (viewport.current?.scrollTop ?? 0) + state.v * WHEEL_FLICK;
		const raw = Math.round(projected / h);
		const index = nearestEnabled(
			items,
			canLoop ? raw : Math.min(Math.max(raw, 0), count - 1),
			Math.sign(state.v),
			canLoop,
		);
		scrollToRaw(canLoop ? index : wrap(index));
	};

	return (
		<div data-slot="wheel-picker-column" className={cn(styles.column(), className)}>
			<div aria-hidden="true" className={styles.lens()} />
			<div
				ref={viewport}
				id={id}
				role="listbox"
				tabIndex={disabled ? -1 : 0}
				aria-label={ariaLabel}
				aria-disabled={disabled || undefined}
				aria-activedescendant={`${id}-${base + active}`}
				data-disabled={disabled || undefined}
				data-dragging={dragging || undefined}
				className={styles.viewport()}
				onKeyDown={onKeyDown}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
			>
				{Array.from({ length: copies * count }, (_, raw) => {
					const item = items[raw % count];
					if (!item) return null;
					const main = raw >= base && raw < base + count;
					return (
						// biome-ignore lint/a11y/useFocusableInteractive: the listbox owns focus via aria-activedescendant.
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
							key={raw}
							id={`${id}-${raw}`}
							role="option"
							aria-hidden={main ? undefined : true}
							aria-selected={main && raw - base === active}
							aria-disabled={item.disabled || undefined}
							className={styles.item()}
							onClick={() => {
								if (suppressClick.current || item.disabled) return;
								scrollToRaw(raw);
							}}
						>
							<span data-disabled={item.disabled || undefined} className={styles.label()}>
								{item.label}
							</span>
						</div>
					);
				})}
			</div>
			{name ? (
				<input type="hidden" name={name} value={items[active]?.value ?? ""} />
			) : null}
		</div>
	);
}
