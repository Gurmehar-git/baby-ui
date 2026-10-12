"use client";

import {
	type CSSProperties,
	type KeyboardEvent,
	type ReactNode,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useChart } from "../chart/chart";
import { toDate } from "../chart/core";
import { useActivePoint } from "../chart/frame";
import { Spring, type SpringConfig } from "../chart/motion";
import { usePlot } from "../chart/time-series";
import { cn } from "../lib/cn";
import {
	type ChartMarkerBase,
	dayKey,
	discStyle,
	FAN_RADIUS,
	FAN_STAGGER,
	fanPosition,
	GROUP_STAGGER,
	GUIDE_TRANSITION,
	groupMarkers,
	MARKER_OFFSET,
	MARKER_SPRING,
	type MarkerGroup,
	popStyle,
} from "./geometry";
import {
	type ChartMarkerAppearance,
	type ChartMarkerSize,
	chartMarkers,
	MARKER_PX,
} from "./variants";

export interface ChartMarker extends ChartMarkerBase {
	icon?: ReactNode;
	onClick?: () => void;
}

function useSpring(config: SpringConfig, apply: (value: number) => void) {
	const applyRef = useRef(apply);
	applyRef.current = apply;
	const ref = useRef<Spring | null>(null);
	if (!ref.current) ref.current = new Spring(0, config, (v) => applyRef.current(v));
	useLayoutEffect(() => () => ref.current?.stop(), []);
	return ref.current;
}

function assign(el: HTMLElement | null, style: Partial<CSSStyleDeclaration>) {
	if (el) Object.assign(el.style, style);
}

const actionable = (marker: ChartMarker) => Boolean(marker.onClick || marker.href);

function MarkerFace({ marker }: { marker: ChartMarker }) {
	return <>{marker.icon ?? marker.title.slice(0, 1).toUpperCase()}</>;
}

/** Link, button or plain disc; hover and press use a 400/17 spring. */
function MarkerDisc({
	marker,
	label,
	className,
	tabIndex,
	children,
}: {
	marker: ChartMarker;
	label: string;
	className: string;
	tabIndex?: number;
	children?: ReactNode;
}) {
	const ref = useRef<HTMLElement | null>(null);
	const press = useSpring(MARKER_SPRING.press, (v) =>
		assign(ref.current, { scale: String(v) }),
	);
	const hovered = useRef(false);
	useLayoutEffect(() => press.jump(1), [press]);
	const face = children ?? <MarkerFace marker={marker} />;
	const style = marker.color
		? ({ background: marker.color } as CSSProperties)
		: undefined;
	if (!actionable(marker))
		return (
			<span role="img" aria-label={label} className={className} style={style}>
				{face}
			</span>
		);
	const handlers = {
		onPointerEnter: () => {
			hovered.current = true;
			press.set(1.15);
		},
		onPointerLeave: () => {
			hovered.current = false;
			press.set(1);
		},
		onPointerDown: () => press.set(0.95),
		onPointerUp: () => press.set(hovered.current ? 1.15 : 1),
	};
	const classes = cn(className, "cursor-pointer transition-shadow hover:shadow-lg");
	if (marker.href)
		return (
			<a
				ref={(el) => {
					ref.current = el;
				}}
				href={marker.href}
				target={marker.target}
				rel={marker.target === "_blank" ? "noopener noreferrer" : undefined}
				aria-label={label}
				tabIndex={tabIndex}
				className={classes}
				style={style}
				onClick={marker.onClick}
				{...handlers}
			>
				{face}
			</a>
		);
	return (
		<button
			ref={(el) => {
				ref.current = el;
			}}
			type="button"
			aria-label={label}
			tabIndex={tabIndex}
			className={classes}
			style={style}
			onClick={marker.onClick}
			{...handlers}
		>
			{face}
		</button>
	);
}

function FanItem({
	marker,
	index,
	total,
	open,
	label,
	styles,
}: {
	marker: ChartMarker;
	index: number;
	total: number;
	open: boolean;
	label: string;
	styles: ReturnType<typeof chartMarkers>;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const pos = fanPosition(index, total);
	const spring = useSpring(MARKER_SPRING.fan, (v) =>
		assign(ref.current, popStyle(v, pos.x, pos.y)),
	);
	useLayoutEffect(() => {
		spring.jump(0);
	}, [spring]);
	useLayoutEffect(() => {
		const timer = setTimeout(() => spring.set(open ? 1 : 0), index * FAN_STAGGER);
		return () => clearTimeout(timer);
	}, [open, index, spring]);
	return (
		<div
			ref={ref}
			data-slot="chart-marker-fan-item"
			className={cn(styles.fanItem(), "size-full", open ? "pointer-events-auto" : "")}
			style={{ opacity: 0 }}
		>
			<MarkerDisc
				marker={marker}
				label={label}
				className={styles.disc()}
				tabIndex={open ? 0 : -1}
			/>
		</div>
	);
}

function Group({
	group,
	index,
	left,
	top,
	visible,
	animate,
	size,
	appearance,
	groupLabel,
	onHoverChange,
}: {
	group: MarkerGroup<ChartMarker>;
	index: number;
	left: number;
	top: number;
	visible: boolean;
	animate: boolean;
	size: ChartMarkerSize;
	appearance: ChartMarkerAppearance;
	groupLabel: (count: number, date: Date) => string;
	onHoverChange: (key: string | null) => void;
}) {
	const styles = chartMarkers({ size, appearance });
	const px = MARKER_PX[size];
	const multiple = group.items.length > 1;
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const [pinned, setPinned] = useState(false);
	const open = multiple && (hovered || focused || pinned);
	const bodyRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLSpanElement>(null);
	const dotRef = useRef<HTMLDivElement>(null);
	const progress = useRef({ enter: 0, fan: 0 });
	const paint = () =>
		assign(bodyRef.current, discStyle(progress.current.enter, progress.current.fan));
	const enter = useSpring(MARKER_SPRING.enter, (v) => {
		progress.current.enter = v;
		paint();
	});
	const fan = useSpring(MARKER_SPRING.fan, (v) => {
		progress.current.fan = v;
		paint();
	});
	const badge = useSpring(MARKER_SPRING.badge, (v) =>
		assign(badgeRef.current, popStyle(v)),
	);
	const dot = useSpring(MARKER_SPRING.badge, (v) =>
		assign(dotRef.current, popStyle(v, 0, 0, 0.5)),
	);

	useLayoutEffect(() => {
		if (!animate) {
			enter.jump(visible ? 1 : 0);
			return;
		}
		if (!visible) {
			enter.set(0);
			return;
		}
		const timer = setTimeout(() => enter.set(1), index * GROUP_STAGGER);
		return () => clearTimeout(timer);
	}, [visible, animate, index, enter]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: badge.jump, multiple, paint left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		paint();
		badge.jump(multiple ? 1 : 0);
	}, []);
	useLayoutEffect(() => {
		fan.set(open ? 1 : 0);
		badge.set(multiple && !open ? 1 : 0);
		dot.set(open ? 1 : 0);
	}, [open, multiple, fan, badge, dot]);

	const first = group.items[0];
	if (!first) return null;
	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape" && open) {
			setPinned(false);
			setFocused(false);
			setHovered(false);
		}
		if (event.key !== "Tab") event.stopPropagation();
	};
	const span = FAN_RADIUS * 2 + px;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover and focus only preview the fan; the disc and fan items are the controls
		<div
			data-slot="chart-marker"
			data-open={open ? "" : undefined}
			className={styles.group()}
			style={{ left, top }}
			onPointerEnter={() => {
				setHovered(true);
				onHoverChange(group.key);
			}}
			onPointerLeave={() => {
				setHovered(false);
				onHoverChange(null);
			}}
			onFocus={() => setFocused(true)}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
			}}
			onKeyDown={onKeyDown}
		>
			{multiple ? (
				<div
					aria-hidden="true"
					className={cn(
						"-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2",
						open ? "pointer-events-auto" : "pointer-events-none",
					)}
					style={{ width: span, height: span }}
				/>
			) : null}
			<div ref={bodyRef} className="relative size-full">
				{multiple ? (
					<button
						type="button"
						aria-expanded={open}
						aria-label={groupLabel(group.items.length, group.date)}
						className={cn(styles.disc(), "cursor-pointer")}
						style={first.color ? { background: first.color } : undefined}
						onClick={() => setPinned((p) => !p)}
					>
						<MarkerFace marker={first} />
					</button>
				) : (
					<MarkerDisc marker={first} label={first.title} className={styles.disc()} />
				)}
				{multiple ? (
					<span ref={badgeRef} aria-hidden="true" className={styles.badge()}>
						{group.items.length}
					</span>
				) : null}
			</div>
			{multiple ? (
				<div className={styles.fan()}>
					<div ref={dotRef} className={styles.dot()} style={{ opacity: 0 }} />
					{group.items.map((marker, i) => (
						<FanItem
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${marker.title}-${i}`}
							marker={marker}
							index={i}
							total={group.items.length}
							open={open}
							label={marker.title}
							styles={styles}
						/>
					))}
				</div>
			) : null}
		</div>
	);
}

export interface ChartMarkersProps {
	items: ChartMarker[];
	size?: ChartMarkerSize;
	appearance?: ChartMarkerAppearance;
	/** Dashed guide from each marker down to the plot floor. */
	showLines?: boolean;
	/** Accessible name for a stacked group; defaults to a count and the date. */
	groupLabel?: (count: number, date: Date) => string;
}

export function ChartMarkers({
	items,
	size = "default",
	appearance = "solid",
	showLines = true,
	groupLabel,
}: ChartMarkersProps) {
	const { xScale, xKey, innerWidth, innerHeight, margin, plotEl, phase, animate } =
		usePlot();
	const { active } = useActivePoint();
	const { format } = useChart();
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);
	const groups = useMemo(() => groupMarkers(items), [items]);
	const styles = chartMarkers({ size, appearance });
	const px = MARKER_PX[size];
	const activeKey = active ? dayKey(toDate(active.datum[xKey])) : null;
	const label =
		groupLabel ??
		((count: number, date: Date) => `${count} events, ${format.title(date)}`);
	const visible = phase === "ready";
	const placed = groups
		.map((group) => ({ group, x: xScale(group.date) }))
		.filter(({ x }) => x >= 0 && x <= innerWidth);

	return (
		<>
			{showLines ? (
				<g data-slot="chart-marker-guides">
					{placed.map(({ group, x }) => (
						<line
							key={group.key}
							className={styles.guide()}
							x1={x}
							x2={x}
							y1={MARKER_OFFSET + px / 2 + 4}
							y2={innerHeight}
							style={{
								strokeOpacity: !visible
									? 0
									: hoveredKey === group.key
										? 1
										: activeKey === group.key
											? 0
											: 0.6,
								transition: GUIDE_TRANSITION,
							}}
						/>
					))}
				</g>
			) : null}
			{plotEl
				? createPortal(
						placed.map(({ group, x }, index) => (
							<Group
								key={group.key}
								group={group}
								index={index}
								left={margin.left + x}
								top={margin.top + MARKER_OFFSET}
								visible={visible}
								animate={animate}
								size={size}
								appearance={appearance}
								groupLabel={label}
								onHoverChange={setHoveredKey}
							/>
						)),
						plotEl,
					)
				: null}
		</>
	);
}

export interface ChartMarkerTooltipProps {
	items: ChartMarker[];
	/** How many markers to list before collapsing into a count. */
	max?: number;
	moreLabel?: (hidden: number) => string;
	className?: string;
}

/** Lists the markers on the active date; put it inside a ChartTooltip `content`. */
export function ChartMarkerTooltip({
	items,
	max = 2,
	moreLabel = (hidden) => `+${hidden} more`,
	className,
}: ChartMarkerTooltipProps) {
	const { active } = useActivePoint();
	const { xKey } = usePlot();
	const styles = chartMarkers();
	if (!active) return null;
	const key = dayKey(toDate(active.datum[xKey]));
	const matches = items.filter((m) => dayKey(m.date) === key);
	if (!matches.length) return null;
	return (
		<div data-slot="chart-marker-tooltip" className={cn(styles.tooltip(), className)}>
			{matches.slice(0, max).map((marker) => (
				<div key={marker.title} className={styles.tooltipRow()}>
					<span
						aria-hidden="true"
						className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-border-strong bg-card text-xs"
						style={marker.color ? { background: marker.color } : undefined}
					>
						<MarkerFace marker={marker} />
					</span>
					<div className="min-w-0">
						<div className={styles.tooltipTitle()}>{marker.title}</div>
						{marker.description ? (
							<div className={styles.tooltipText()}>{marker.description}</div>
						) : null}
					</div>
				</div>
			))}
			{matches.length > max ? (
				<div className={styles.tooltipText()}>{moreLabel(matches.length - max)}</div>
			) : null}
		</div>
	);
}
