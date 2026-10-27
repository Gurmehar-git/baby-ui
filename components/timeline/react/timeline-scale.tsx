"use client";

import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useId,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import {
	type TimelineOrientation,
	type TimelineScaleVariant,
	timelineScale,
} from "../variants";

export type { TimelineOrientation, TimelineScaleVariant };

type ScaleItem = {
	id: string;
	label: string;
	description?: string;
	element: HTMLButtonElement;
};

type TimelineScaleContextValue = {
	itemVersion: number;
	orientation: TimelineOrientation;
	variant: TimelineScaleVariant;
	active?: string;
	register: (item: ScaleItem) => () => void;
	entries: () => ScaleItem[];
	select: (id: string, focus?: boolean) => void;
	move: (event: KeyboardEvent<HTMLButtonElement>, id: string) => void;
	syncViewport: (viewport: HTMLElement) => void;
	release: () => void;
};

const TimelineScaleContext = createContext<TimelineScaleContextValue | null>(null);

function useTimelineScale(part: string) {
	const context = useContext(TimelineScaleContext);
	if (!context) throw new Error(`${part} must be used inside <TimelineScale>`);
	return context;
}

export interface TimelineScaleProps extends ComponentProps<"section"> {
	orientation?: TimelineOrientation;
	variant?: TimelineScaleVariant;
	/** Active item id. */
	value?: string;
	/** Initially active item id. The first registered item is used when omitted. */
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Preferred horizontal item width. */
	itemSize?: number | string;
	children: ReactNode;
}

export function TimelineScale({
	orientation = "horizontal",
	variant = "default",
	value,
	defaultValue,
	onValueChange,
	itemSize = "18rem",
	className,
	style,
	children,
	...props
}: TimelineScaleProps) {
	const [ownValue, setOwnValue] = useState(defaultValue);
	const active = value ?? ownValue;
	const items = useRef(new Map<string, ScaleItem>());
	// Set while select() smooth-scrolls, so items passed on the way never become active.
	const pending = useRef<string | null>(null);
	const [itemVersion, refreshItems] = useReducer((version: number) => version + 1, 0);
	const setValue = useCallback(
		(next: string) => {
			if (value === undefined) setOwnValue(next);
			onValueChange?.(next);
		},
		[value, onValueChange],
	);
	const register = useCallback(
		(item: ScaleItem) => {
			items.current.set(item.id, item);
			refreshItems();
			if (value === undefined && ownValue === undefined && items.current.size === 1)
				setOwnValue(item.id);
			return () => {
				if (items.current.get(item.id)?.element !== item.element) return;
				items.current.delete(item.id);
				refreshItems();
			};
		},
		[ownValue, value],
	);
	const select = useCallback(
		(id: string, focus = false) => {
			const entry = items.current.get(id);
			if (!entry) return;
			const { element: item } = entry;
			setValue(id);
			pending.current = id;
			const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
			item.scrollIntoView({
				behavior: reduced ? "auto" : "smooth",
				block: "nearest",
				inline: "nearest",
			});
			if (focus) item.focus({ preventScroll: true });
		},
		[setValue],
	);
	const move = useCallback(
		(event: KeyboardEvent<HTMLButtonElement>, id: string) => {
			const forward = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
			const backward = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
			if (![forward, backward, "Home", "End"].includes(event.key)) return;
			const ids = [...items.current.keys()];
			const index = ids.indexOf(id);
			if (index < 0) return;
			const last = ids.length - 1;
			const next =
				event.key === "Home"
					? 0
					: event.key === "End"
						? last
						: Math.min(Math.max(index + (event.key === forward ? 1 : -1), 0), last);
			if (next === index) return;
			event.preventDefault();
			const nextId = ids[next];
			if (nextId) select(nextId, true);
		},
		[orientation, select],
	);
	const syncViewport = useCallback(
		(viewport: HTMLElement) => {
			const viewportRect = viewport.getBoundingClientRect();
			const center =
				orientation === "horizontal"
					? viewportRect.left + viewportRect.width / 2
					: viewportRect.top + viewportRect.height / 2;
			let nearest = "";
			let distance = Number.POSITIVE_INFINITY;
			for (const [id, item] of items.current) {
				const rect = item.element.getBoundingClientRect();
				const itemCenter =
					orientation === "horizontal"
						? rect.left + rect.width / 2
						: rect.top + rect.height / 2;
				const nextDistance = Math.abs(itemCenter - center);
				if (nextDistance >= distance) continue;
				distance = nextDistance;
				nearest = id;
			}
			if (pending.current) {
				if (nearest === pending.current) pending.current = null;
				return;
			}
			if (nearest && nearest !== active) setValue(nearest);
		},
		[active, orientation, setValue],
	);
	const context = useMemo(
		() => ({
			itemVersion,
			orientation,
			variant,
			active,
			register,
			entries: () => [...items.current.values()],
			select,
			move,
			syncViewport,
			release: () => {
				pending.current = null;
			},
		}),
		[orientation, variant, active, register, select, move, syncViewport, itemVersion],
	);
	const size = typeof itemSize === "number" ? `${itemSize}px` : itemSize;
	const s = timelineScale({ orientation, variant });

	return (
		<TimelineScaleContext.Provider value={context}>
			<section
				data-slot="timeline-scale"
				data-orientation={orientation}
				className={cn(s.root(), className)}
				style={{ ...style, "--timeline-item-size": size } as CSSProperties}
				{...props}
			>
				{children}
			</section>
		</TimelineScaleContext.Provider>
	);
}

export function TimelineScaleHeader({ className, ...props }: ComponentProps<"div">) {
	const context = useTimelineScale("TimelineScaleHeader");
	return (
		<div
			data-slot="timeline-scale-header"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).header(),
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineScaleViewport({
	className,
	onScroll,
	onScrollEnd,
	onWheel,
	onPointerDown,
	...props
}: ComponentProps<"div">) {
	const context = useTimelineScale("TimelineScaleViewport");
	const frame = useRef<number | null>(null);
	useEffect(
		() => () => {
			if (frame.current !== null) cancelAnimationFrame(frame.current);
		},
		[],
	);
	const s = timelineScale({ orientation: context.orientation, variant: context.variant });
	return (
		<div
			data-slot="timeline-scale-viewport"
			className={cn(s.viewport(), className)}
			onScroll={(event) => {
				if (frame.current !== null) cancelAnimationFrame(frame.current);
				const viewport = event.currentTarget;
				frame.current = requestAnimationFrame(() => context.syncViewport(viewport));
				onScroll?.(event);
			}}
			onScrollEnd={(event) => {
				context.release();
				onScrollEnd?.(event);
			}}
			onWheel={(event) => {
				context.release();
				onWheel?.(event);
			}}
			onPointerDown={(event) => {
				context.release();
				onPointerDown?.(event);
			}}
			{...props}
		/>
	);
}

export function TimelineScaleTrack({ className, ...props }: ComponentProps<"ol">) {
	const context = useTimelineScale("TimelineScaleTrack");
	return (
		<ol
			data-slot="timeline-scale-track"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).track(),
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineScaleRail({ className, ...props }: ComponentProps<"span">) {
	const context = useTimelineScale("TimelineScaleRail");
	return (
		<span
			aria-hidden
			data-slot="timeline-scale-rail"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).rail(),
				className,
			)}
			{...props}
		/>
	);
}

export interface TimelineScaleItemProps extends Omit<ComponentProps<"li">, "children"> {
	value: string;
	label: string;
	description?: string;
	children: ReactNode;
}

export function TimelineScaleItem({
	value,
	label,
	description,
	className,
	children,
	...props
}: TimelineScaleItemProps) {
	const context = useTimelineScale("TimelineScaleItem");
	const descriptionId = useId();
	const active = context.active === value;
	const s = timelineScale({ orientation: context.orientation, variant: context.variant });
	const registerRef = useCallback(
		(element: HTMLButtonElement | null) =>
			element ? context.register({ id: value, label, description, element }) : undefined,
		[context.register, description, label, value],
	);
	return (
		<li
			data-slot="timeline-scale-item"
			data-active={active || undefined}
			className={cn(s.item(), className)}
			{...props}
		>
			<button
				ref={registerRef}
				type="button"
				data-slot="timeline-scale-item-trigger"
				aria-current={active ? "step" : undefined}
				aria-label={label}
				aria-describedby={description ? descriptionId : undefined}
				tabIndex={active ? 0 : -1}
				className={s.itemTrigger()}
				onClick={() => context.select(value)}
				onKeyDown={(event) => context.move(event, value)}
			>
				{children}
			</button>
			{description ? (
				<span id={descriptionId} className="sr-only">
					{description}
				</span>
			) : null}
		</li>
	);
}

export function TimelineScaleTick({ className, ...props }: ComponentProps<"span">) {
	const context = useTimelineScale("TimelineScaleTick");
	return (
		<span
			aria-hidden
			data-slot="timeline-scale-tick"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).tick(),
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineScaleDate({ className, ...props }: ComponentProps<"time">) {
	const context = useTimelineScale("TimelineScaleDate");
	return (
		<time
			data-slot="timeline-scale-date"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).date(),
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineScaleYear({ className, ...props }: ComponentProps<"span">) {
	const context = useTimelineScale("TimelineScaleYear");
	return (
		<span
			aria-hidden
			data-slot="timeline-scale-year"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).year(),
				className,
			)}
			{...props}
		/>
	);
}

export function TimelineScaleContent({ className, ...props }: ComponentProps<"div">) {
	const context = useTimelineScale("TimelineScaleContent");
	return (
		<div
			data-slot="timeline-scale-content"
			className={cn(
				timelineScale({
					orientation: context.orientation,
					variant: context.variant,
				}).content(),
				className,
			)}
			{...props}
		/>
	);
}
