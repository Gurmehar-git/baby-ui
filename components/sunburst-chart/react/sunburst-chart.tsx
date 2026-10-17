"use client";

import {
	type KeyboardEvent,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ActivePoint, Datum } from "../../chart/core";
import {
	CHART_DURATION,
	CHART_EASE,
	cubicBezier,
	type Playback,
	tween,
} from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	type ArcDatum,
	applyHoverGrow,
	arcColor,
	arcPath,
	buildLayout,
	centroid,
	DEFAULT_HOVER_POP,
	enterDelays,
	FADE_MS,
	type Focus,
	focusTrail,
	GROW_MS,
	growPadding,
	hoverGrowTargets,
	hubRadius,
	isDescendant,
	isOnPath,
	labelFits,
	labelRotation,
	localProgress,
	maxHoverThickness,
	relativeOpacity,
	SUNBURST_CURVE,
	type SunburstNode,
	transitionGeometry,
	visibleArcs,
	ZOOM_MS,
} from "../geometry";
import { SUNBURST_HUB, type SunburstVariant, sunburstChart } from "../variants";

const SUNBURST_EASE = cubicBezier(...SUNBURST_CURVE);

export type { SunburstNode };

export interface SunburstChartProps {
	/** Root of the tree; leaves carry `value`, branches sum their children. */
	data: SunburstNode;
	variant?: SunburstVariant;
	/** Names along arcs wide enough to hold them. */
	labels?: boolean;
	/** Drill-down path above the chart, one button per level. */
	breadcrumb?: boolean;
	/** Pixels the hovered path grows outward. */
	hoverPop?: number;
	/** Multiplies the ring and clockwise stagger; floored at 0.25. */
	staggerScale?: number;
	/** Id of the node the chart is zoomed into: names joined by " / ". */
	focus?: string;
	defaultFocus?: string;
	onFocusChange?: (id: string) => void;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	animate?: boolean;
	/** Screen-reader table headers: path, value, share. */
	tableHeaders?: [string, string, string];
	breadcrumbLabel?: string;
	roleDescription?: string;
	className?: string;
}

export function SunburstChart({
	data,
	variant = "sunburst",
	labels = true,
	breadcrumb = true,
	hoverPop = DEFAULT_HOVER_POP,
	staggerScale = 1,
	focus: focusProp,
	defaultFocus,
	onFocusChange,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	animate = true,
	tableHeaders = ["Path", "Value", "Share"],
	breadcrumbLabel = "Drill-down path",
	roleDescription = "sunburst chart",
	className,
}: SunburstChartProps) {
	const { config, hidden, format, description } = useChart();
	const layout = useMemo(() => buildLayout(data, hidden), [data, hidden]);
	const { arcs, focusById, rootId, total } = layout;
	const [internalFocus, setInternalFocus] = useState(defaultFocus ?? rootId);
	const requested = focusProp ?? internalFocus;
	const focus = focusById.get(requested) ?? (focusById.get(rootId) as Focus);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);

	const zoomTo = useCallback(
		(id: string) => {
			if (id === focus.id || !focusById.has(id)) return;
			if (focusProp === undefined) setInternalFocus(id);
			onFocusChange?.(id);
		},
		[focus.id, focusById, focusProp, onFocusChange],
	);

	const visible = useMemo(() => visibleArcs(arcs, focus), [arcs, focus]);
	const active = activeIndex !== null ? visible[activeIndex] : undefined;
	const share = (arc: ArcDatum, of: number) =>
		format.percent(of > 0 ? arc.value / of : 0);

	const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.defaultPrevented) return;
		if ((event.key === "Enter" || event.key === " ") && active?.hasChildren) {
			event.preventDefault();
			zoomTo(active.id);
			setActive(0, true);
		} else if ((event.key === "Backspace" || event.key === "Escape") && focus.parentId) {
			event.preventDefault();
			zoomTo(focus.parentId);
			setActive(null, true);
		}
	};

	const styles = sunburstChart({ variant });
	const trail = focusTrail(focus, focusById);
	const largest = arcs
		.filter((arc) => arc.depth === 1)
		.reduce<ArcDatum | undefined>(
			(best, a) => (!best || a.value > best.value ? a : best),
			undefined,
		);

	return (
		<>
			{breadcrumb ? (
				<nav
					aria-label={breadcrumbLabel}
					data-slot="sunburst-breadcrumb"
					className={styles.breadcrumb()}
				>
					{trail.map((crumb, index) => {
						const current = index === trail.length - 1;
						return (
							<span key={crumb.id} className="flex items-center gap-1">
								{index > 0 ? (
									<span aria-hidden="true" className={styles.separator()}>
										/
									</span>
								) : null}
								<button
									type="button"
									className={styles.crumb()}
									aria-current={current ? "page" : undefined}
									onClick={() => {
										zoomTo(crumb.id);
										setActive(null, false);
									}}
								>
									{crumb.name}
								</button>
							</span>
						);
					})}
				</nav>
			) : null}
			{/* biome-ignore lint/a11y/noStaticElementInteractions: forwards drill keys from the focusable plot inside */}
			<div className="contents" onKeyDown={onKeyDown}>
				<ChartFrame
					roleDescription={roleDescription}
					summary={
						description ??
						(largest
							? `${arcs.filter((a) => a.depth === 1).length} branches over ${layout.maxDepth} rings totalling ${format.number(total)}. Largest: ${largest.name}, ${share(largest, total)}.`
							: "No data.")
					}
					table={{
						columns: tableHeaders,
						rows: arcs.map((arc) => ({
							header: arc.trail.join(" / "),
							cells: [format.number(arc.value), share(arc, total)],
						})),
					}}
					count={visible.length}
					activeIndex={activeIndex}
					onActiveChange={setActive}
					interactive={visible.length > 0}
					announcement={
						active && instant
							? `${active.trail.join(" / ")}: ${format.number(active.value)}, ${share(active, focus.value)}`
							: ""
					}
					className={className}
				>
					{(frame) => (
						<SunburstPlot
							frame={frame}
							layout={layout}
							focus={focus}
							visible={visible}
							configured={config}
							variant={variant}
							labels={labels}
							hoverPop={hoverPop}
							staggerScale={staggerScale}
							animate={animate}
							activeIndex={activeIndex}
							instant={instant}
							setActive={setActive}
							zoomTo={zoomTo}
						/>
					)}
				</ChartFrame>
			</div>
		</>
	);
}

function SunburstPlot({
	frame,
	layout,
	focus,
	visible,
	configured,
	variant,
	labels,
	hoverPop,
	staggerScale,
	animate,
	activeIndex,
	instant,
	setActive,
	zoomTo,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	layout: ReturnType<typeof buildLayout>;
	focus: Focus;
	visible: ArcDatum[];
	configured: Record<string, { color?: string; theme?: unknown }>;
	variant: SunburstVariant;
	labels: boolean;
	hoverPop: number;
	staggerScale: number;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
	zoomTo: (id: string) => void;
}) {
	const { format } = useChart();
	const { arcs, focusById, maxDepth } = layout;
	const hub = SUNBURST_HUB[variant];
	const styles = sunburstChart({ variant });
	const size = Math.min(frame.width, frame.height);
	const radius = Math.max(8, size / 2 - growPadding(maxDepth, size, hoverPop));
	const cx = frame.width / 2;
	const cy = frame.height / 2;
	const colored = useMemo(
		() =>
			new Set(
				Object.entries(configured)
					.filter(([, entry]) => entry.color || entry.theme)
					.map(([key]) => key),
			),
		[configured],
	);

	const { delays, maxDelay } = useMemo(
		() => enterDelays(arcs, staggerScale),
		[arcs, staggerScale],
	);
	const labelsDelay = maxDelay + CHART_DURATION.enter * 0.85;
	const enterTotal = labelsDelay + CHART_DURATION.enter;
	const signature = arcs.map((a) => `${a.id}:${a.value}`).join("|");
	const [elapsed, setElapsed] = useState(animate ? 0 : enterTotal);
	// biome-ignore lint/correctness/useExhaustiveDependencies: signature is a content key, so equal data does not re-run; enterTotal left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		if (!animate) {
			setElapsed(Number.POSITIVE_INFINITY);
			return;
		}
		setElapsed(0);
		const playback = tween({
			duration: enterTotal,
			ease: (t) => t,
			onUpdate: (p) => setElapsed(p * enterTotal),
		});
		return () => playback.stop();
		// Only a change to what is drawn replays the enter; the total follows from it.
	}, [signature, animate]);

	const [prevFocusId, setPrevFocusId] = useState(focus.id);
	const [zoomT, setZoomT] = useState(1);
	const shownFocus = useRef(focus.id);
	useLayoutEffect(() => {
		if (shownFocus.current === focus.id) return;
		const from = shownFocus.current;
		shownFocus.current = focus.id;
		setPrevFocusId(from);
		setZoomT(0);
		const playback = tween({
			duration: animate ? ZOOM_MS : 0,
			ease: SUNBURST_EASE,
			onUpdate: setZoomT,
			onComplete: () => setPrevFocusId(focus.id),
		});
		return () => playback.stop();
	}, [focus.id, animate]);
	const prevFocus = focusById.get(prevFocusId) ?? focus;

	const active = activeIndex !== null ? visible[activeIndex] : undefined;
	const [grow, setGrow] = useState<Map<string, number>>(() => new Map());
	const growRef = useRef(grow);
	growRef.current = grow;
	useLayoutEffect(() => {
		const targets = active
			? hoverGrowTargets(arcs, active, focus, maxDepth, radius, hoverPop, hub)
			: new Map<string, number>();
		const starts = new Map(growRef.current);
		const ids = new Set([...starts.keys(), ...targets.keys()]);
		let playback: Playback | null = null;
		playback = tween({
			duration: instant || !animate ? 0 : GROW_MS,
			ease: SUNBURST_EASE,
			onUpdate: (p) => {
				const next = new Map<string, number>();
				for (const id of ids) {
					const value =
						(starts.get(id) ?? 0) + ((targets.get(id) ?? 0) - (starts.get(id) ?? 0)) * p;
					if (value > 0.01) next.set(id, value);
				}
				setGrow(next);
			},
		});
		return () => playback?.stop();
	}, [active, arcs, focus, maxDepth, radius, hoverPop, hub, instant, animate]);

	const cap = maxHoverThickness(maxDepth, radius, hoverPop, hub);
	const growFor = (id: string) => grow.get(id) ?? 0;
	const geometry = (arc: ArcDatum) => {
		const base = transitionGeometry(arc, prevFocus, focus, maxDepth, radius, hub, zoomT);
		return base ? applyHoverGrow(base, arc.id, growFor, cap) : null;
	};
	const related = (arc: ArcDatum) =>
		!active || isDescendant(arc, active.id) || isOnPath(arc, active.id);
	const color = (arc: ArcDatum) => arcColor(arc, colored);
	const fade = SUNBURST_EASE(localProgress(elapsed, 0, FADE_MS));
	const labelOpacity = CHART_EASE(
		localProgress(elapsed, labelsDelay, CHART_DURATION.enter),
	);

	const activeGeometry = active ? geometry(active) : null;
	const activePoint = useMemo<ActivePoint | null>(() => {
		if (!active || !activeGeometry || activeIndex === null) return null;
		const at = centroid(activeGeometry);
		return {
			index: activeIndex,
			datum: {
				id: active.id,
				name: active.trail.join(" / "),
				value: active.value,
				category: active.category,
			},
			x: cx + at.x,
			y: { value: cy + at.y },
		};
	}, [active, activeGeometry, activeIndex, cx, cy]);
	const activeColor = active ? color(active) : "currentColor";
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => String(datum.name ?? ""),
			rows: (datum: Datum) => [
				{
					key: String(datum.category ?? ""),
					label: format.percent(focus.value > 0 ? Number(datum.value) / focus.value : 0),
					color: activeColor,
					value: Number(datum.value),
				},
			],
		}),
		[activePoint, instant, format, focus.value, activeColor],
	);

	const hubR = hubRadius(focus, prevFocus, maxDepth, radius, hub, zoomT);
	const focusArc = arcs.find((arc) => arc.id === focus.id);
	const drawOrder = useMemo(() => [...arcs].sort((a, b) => b.depth - a.depth), [arcs]);
	const shown = active ?? focus;

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block overflow-visible"
				style={{ opacity: fade }}
				onPointerLeave={() => activeIndex !== null && setActive(null, false)}
			>
				<g transform={`translate(${cx},${cy})`}>
					{drawOrder.map((arc) => {
						const g = geometry(arc);
						if (!g) return null;
						const p = CHART_EASE(
							localProgress(elapsed, delays.get(arc.id) ?? 0, CHART_DURATION.enter),
						);
						const d = arcPath(g, p);
						if (!d) return null;
						const index = visible.indexOf(arc);
						return (
							// biome-ignore lint/a11y/noStaticElementInteractions: pointer shortcut; the plot owns keyboard drill-down
							<g
								key={arc.id}
								data-slot="sunburst-segment"
								data-id={arc.id}
								data-active={active === arc ? "" : undefined}
								className={styles.segment()}
								style={{
									opacity: related(arc) ? 1 : 0.25,
									transform: p < 1 ? `scale(${0.9 + 0.1 * p})` : undefined,
									transformOrigin: "0 0",
									cursor: arc.hasChildren ? "pointer" : "default",
								}}
								onPointerEnter={() => index >= 0 && setActive(index, false)}
								onClick={() => {
									if (!arc.hasChildren) return;
									zoomTo(arc.id);
									setActive(null, false);
								}}
							>
								<path
									d={d}
									fill={color(arc)}
									fillOpacity={relativeOpacity(arc.depth - focus.depth)}
									className={styles.path()}
								/>
							</g>
						);
					})}
					{hubR > 1 ? (
						// biome-ignore lint/a11y/noStaticElementInteractions: pointer shortcut; Backspace and the breadcrumb zoom out from the keyboard
						<circle
							data-slot="sunburst-hub"
							r={Math.max(hubR - 2, 0)}
							className={styles.hub()}
							style={{
								fill: focus.depth > 0 && focusArc ? color(focusArc) : undefined,
								cursor: focus.parentId ? "pointer" : "default",
							}}
							onClick={() => focus.parentId && zoomTo(focus.parentId)}
						/>
					) : null}
					{labels
						? drawOrder.map((arc) => {
								const g = geometry(arc);
								if (!g || !labelFits(g, arc.name) || !related(arc)) return null;
								const at = centroid(g);
								return (
									<text
										key={arc.id}
										x={at.x}
										y={at.y}
										textAnchor="middle"
										dominantBaseline="middle"
										transform={`rotate(${labelRotation(at.angle)} ${at.x} ${at.y})`}
										className={styles.label()}
										style={{ opacity: labelOpacity }}
									>
										{arc.name}
									</text>
								);
							})
						: null}
				</g>
			</svg>
			{hubR > 24 ? (
				<div
					data-slot="sunburst-center"
					className={styles.center()}
					style={{ left: cx - hubR, top: cy - hubR, width: hubR * 2, height: hubR * 2 }}
				>
					<span className={styles.value()}>{format.number(shown.value)}</span>
					<span className={styles.caption()}>{shown.name}</span>
				</div>
			) : null}
			{frame.el ? (
				<ChartTooltipPanel
					anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? cy } : null}
					instant={instant}
					bounds={frame}
				>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			) : null}
		</ActivePointProvider>
	);
}
