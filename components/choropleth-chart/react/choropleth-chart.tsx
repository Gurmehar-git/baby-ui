"use client";

import {
	type KeyboardEvent,
	type PointerEvent,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useChart } from "../../chart/react/chart";
import type { ActivePoint, Datum } from "../../chart/react/core";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { CHART_DURATION, prefersReducedMotion, tween } from "../../chart/react/motion";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import { cn } from "../../lib/react/cn";
import {
	clampZoom,
	DIM_TRANSITION,
	featureKey,
	featureLabel,
	type GeoCollection,
	IDENTITY_ZOOM,
	KEY_PAN_STEP,
	KEY_ZOOM_STEP,
	layoutMap,
	type MapFeature,
	scaleFill,
	WHEEL_STEP,
	ZOOM_TRANSITION,
	type ZoomState,
	zoomAt,
	zoomTransform,
} from "./geometry";
import { type ChoroplethProjection, choroplethChart } from "./variants";

export interface ChoroplethLabels {
	value: string;
	noData: string;
	zoomIn: string;
	zoomOut: string;
	resetZoom: string;
	region: string;
}

const DEFAULT_LABELS: ChoroplethLabels = {
	value: "Value",
	noData: "No data",
	zoomIn: "Zoom in",
	zoomOut: "Zoom out",
	resetZoom: "Reset zoom",
	region: "Region",
};

export interface ChoroplethChartProps {
	/** GeoJSON features to draw; bring your own boundaries. */
	data: GeoCollection;
	/** Value per feature, keyed by `keyProp` (falls back to the feature id). */
	values: Record<string, number>;
	keyProp?: string;
	labelProp?: string;
	projection?: ChoroplethProjection;
	graticule?: boolean;
	legend?: boolean;
	/** Opacity of the other features while one is active. */
	dimOpacity?: number;
	/** Wheel, drag and pinch zoom plus +, -, 0 and shift+arrow keys. */
	zoomable?: boolean;
	zoomMin?: number;
	zoomMax?: number;
	zoom?: ZoomState;
	defaultZoom?: ZoomState;
	onZoomChange?: (zoom: ZoomState) => void;
	labels?: Partial<ChoroplethLabels>;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

interface Entry {
	key: string;
	label: string;
	value: number;
}

export function ChoroplethChart({
	data,
	values,
	keyProp = "name",
	labelProp = "name",
	projection = "equalEarth",
	graticule = true,
	legend = true,
	dimOpacity = 0.4,
	zoomable = false,
	zoomMin = 1,
	zoomMax = 8,
	zoom: zoomProp,
	defaultZoom = IDENTITY_ZOOM,
	onZoomChange,
	labels: labelsProp,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "map",
	className,
}: ChoroplethChartProps) {
	const { format, description } = useChart();
	const labels = { ...DEFAULT_LABELS, ...labelsProp };
	const entries = useMemo<Entry[]>(() => {
		const out: Entry[] = [];
		for (const feature of data.features) {
			const key = featureKey(feature, keyProp);
			const value = values[key];
			if (typeof value === "number" && Number.isFinite(value))
				out.push({ key, label: featureLabel(feature, labelProp, key), value });
		}
		return out.sort((a, b) => a.label.localeCompare(b.label));
	}, [data, values, keyProp, labelProp]);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const [internalZoom, setInternalZoom] = useState(defaultZoom);
	const zoom = zoomProp ?? internalZoom;
	const setZoom = useCallback(
		(next: ZoomState) => {
			if (zoomProp === undefined) setInternalZoom(next);
			onZoomChange?.(next);
		},
		[zoomProp, onZoomChange],
	);

	const active = activeIndex !== null ? entries[activeIndex] : undefined;
	const highest = entries.reduce<Entry | undefined>(
		(best, e) => (!best || e.value > best.value ? e : best),
		undefined,
	);
	const lowest = entries.reduce<Entry | undefined>(
		(best, e) => (!best || e.value < best.value ? e : best),
		undefined,
	);
	const plotSize = useRef({ width: 0, height: 0 });

	const onKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!zoomable) return;
		const { width, height } = plotSize.current;
		const cx = width / 2;
		const cy = height / 2;
		let next: ZoomState | null = null;
		if (event.key === "+" || event.key === "=")
			next = zoomAt(zoom, KEY_ZOOM_STEP, cx, cy, zoomMin, zoomMax);
		else if (event.key === "-" || event.key === "_")
			next = zoomAt(zoom, 1 / KEY_ZOOM_STEP, cx, cy, zoomMin, zoomMax);
		else if (event.key === "0") next = IDENTITY_ZOOM;
		else if (event.shiftKey && event.key.startsWith("Arrow")) {
			const dx = event.key === "ArrowLeft" ? 1 : event.key === "ArrowRight" ? -1 : 0;
			const dy = event.key === "ArrowUp" ? 1 : event.key === "ArrowDown" ? -1 : 0;
			next = { ...zoom, x: zoom.x + dx * KEY_PAN_STEP, y: zoom.y + dy * KEY_PAN_STEP };
		}
		if (!next) return;
		event.preventDefault();
		event.stopPropagation();
		setZoom(next);
	};

	return (
		<div className="contents" onKeyDownCapture={onKeyDownCapture}>
			<ChartFrame
				roleDescription={roleDescription}
				summary={
					description ??
					(highest && lowest
						? `${entries.length} regions with data. Highest: ${highest.label}, ${format.number(highest.value)}. Lowest: ${lowest.label}, ${format.number(lowest.value)}.`
						: labels.noData)
				}
				table={{
					columns: [labels.region, labels.value],
					rows: entries.map((e) => ({
						header: e.label,
						cells: [format.number(e.value)],
					})),
				}}
				count={entries.length}
				activeIndex={activeIndex}
				onActiveChange={setActive}
				interactive={entries.length > 0}
				announcement={
					active && instant ? `${active.label}: ${format.number(active.value)}` : ""
				}
				className={className}
			>
				{(frame) => {
					plotSize.current = { width: frame.width, height: frame.height };
					return (
						<MapPlot
							frame={frame}
							data={data}
							values={values}
							keyProp={keyProp}
							labelProp={labelProp}
							projection={projection}
							graticule={graticule}
							dimOpacity={dimOpacity}
							zoomable={zoomable}
							zoomMin={zoomMin}
							zoomMax={zoomMax}
							zoom={zoom}
							setZoom={setZoom}
							labels={labels}
							animate={animate}
							activeKey={active?.key ?? null}
							entries={entries}
							activeIndex={activeIndex}
							instant={instant}
							setActive={setActive}
						/>
					);
				}}
			</ChartFrame>
			{legend ? <MapLegend values={values} noData={labels.noData} /> : null}
		</div>
	);
}

function MapLegend({
	values,
	noData,
}: {
	values: Record<string, number>;
	noData: string;
}) {
	const { format } = useChart();
	const styles = choroplethChart();
	const known = Object.values(values).filter((v) => Number.isFinite(v));
	if (!known.length) return null;
	const min = Math.min(...known);
	const max = Math.max(...known);
	const steps = [0, 1, 2, 3, 4];
	return (
		<div data-slot="choropleth-legend" className={styles.legend()}>
			<div className={styles.scale()}>
				<span>{format.compact(min)}</span>
				{steps.map((step) => (
					<span
						key={step}
						aria-hidden="true"
						className={styles.swatch()}
						style={{ background: scaleFill(step) }}
					/>
				))}
				<span>{format.compact(max)}</span>
			</div>
			<div className={styles.scale()}>
				<span
					aria-hidden="true"
					className={cn(styles.swatch(), "border border-border bg-muted")}
				/>
				<span>{noData}</span>
			</div>
		</div>
	);
}

function MapPlot({
	frame,
	data,
	values,
	keyProp,
	labelProp,
	projection,
	graticule,
	dimOpacity,
	zoomable,
	zoomMin,
	zoomMax,
	zoom,
	setZoom,
	labels,
	animate,
	activeKey,
	entries,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: GeoCollection;
	values: Record<string, number>;
	keyProp: string;
	labelProp: string;
	projection: ChoroplethProjection;
	graticule: boolean;
	dimOpacity: number;
	zoomable: boolean;
	zoomMin: number;
	zoomMax: number;
	zoom: ZoomState;
	setZoom: (zoom: ZoomState) => void;
	labels: ChoroplethLabels;
	animate: boolean;
	activeKey: string | null;
	entries: Entry[];
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const styles = choroplethChart({ projection, zoomable });
	const layout = useMemo(
		() =>
			layoutMap({
				data,
				values,
				keyProp,
				labelProp,
				projection,
				width: frame.width,
				height: frame.height,
			}),
		[data, values, keyProp, labelProp, projection, frame.width, frame.height],
	);
	const svgRef = useRef<SVGSVGElement>(null);
	const layerRef = useRef<SVGGElement>(null);
	const [dragging, setDragging] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: data.
	useLayoutEffect(() => {
		const layer = layerRef.current;
		if (!layer) return;
		if (!animate) {
			layer.style.opacity = "1";
			return;
		}
		layer.style.opacity = "0";
		const playback = tween({
			duration: CHART_DURATION.enter,
			onUpdate: (p) => {
				layer.style.opacity = String(p);
			},
		});
		return () => playback.stop();
	}, [data, animate]);

	const zoomRef = useRef(zoom);
	zoomRef.current = zoom;
	useEffect(() => {
		const svg = svgRef.current;
		if (!svg || !zoomable) return;
		const onWheel = (event: WheelEvent) => {
			event.preventDefault();
			const bounds = svg.getBoundingClientRect();
			const factor = event.deltaY > 0 ? 1 / WHEEL_STEP : WHEEL_STEP;
			setZoom(
				zoomAt(
					zoomRef.current,
					factor,
					event.clientX - bounds.left,
					event.clientY - bounds.top,
					zoomMin,
					zoomMax,
				),
			);
		};
		svg.addEventListener("wheel", onWheel, { passive: false });
		return () => svg.removeEventListener("wheel", onWheel);
	}, [zoomable, zoomMin, zoomMax, setZoom]);

	const pointers = useRef(new Map<number, { x: number; y: number }>());
	const gesture = useRef<{
		zoom: ZoomState;
		x: number;
		y: number;
		distance: number;
	} | null>(null);
	const startGesture = () => {
		const points = [...pointers.current.values()];
		const [a, b] = points;
		if (!a) {
			gesture.current = null;
			return;
		}
		const x = b ? (a.x + b.x) / 2 : a.x;
		const y = b ? (a.y + b.y) / 2 : a.y;
		const distance = b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
		gesture.current = { zoom: zoomRef.current, x, y, distance };
	};
	const local = (event: PointerEvent<SVGSVGElement>) => {
		const bounds = event.currentTarget.getBoundingClientRect();
		return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
	};
	const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
		if (!zoomable) return;
		event.currentTarget.setPointerCapture(event.pointerId);
		pointers.current.set(event.pointerId, local(event));
		startGesture();
	};
	const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
		const start = gesture.current;
		if (!zoomable || !start || !pointers.current.has(event.pointerId)) return;
		pointers.current.set(event.pointerId, local(event));
		const [a, b] = [...pointers.current.values()];
		if (!a) return;
		const x = b ? (a.x + b.x) / 2 : a.x;
		const y = b ? (a.y + b.y) / 2 : a.y;
		if (!dragging && Math.hypot(x - start.x, y - start.y) > 3) setDragging(true);
		let next: ZoomState = {
			...start.zoom,
			x: start.zoom.x + x - start.x,
			y: start.zoom.y + y - start.y,
		};
		if (b && start.distance > 0) {
			const factor = Math.hypot(a.x - b.x, a.y - b.y) / start.distance;
			next = zoomAt(next, factor, x, y, zoomMin, zoomMax);
		}
		setZoom(clampZoom(next, zoomMin, zoomMax));
	};
	const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
		pointers.current.delete(event.pointerId);
		startGesture();
		if (pointers.current.size === 0) setDragging(false);
	};

	const byKey = useMemo(
		() => new Map(layout.features.map((f) => [f.key, f])),
		[layout.features],
	);
	const activeFeature = activeKey ? byKey.get(activeKey) : undefined;
	const indexOf = useMemo(() => new Map(entries.map((e, i) => [e.key, i])), [entries]);
	const onEnter = (feature: MapFeature) => {
		if (dragging) return;
		const index = indexOf.get(feature.key);
		setActive(index ?? null, false);
	};

	const anchor = activeFeature
		? {
				x: activeFeature.centroid[0] * zoom.k + zoom.x,
				y: activeFeature.centroid[1] * zoom.k + zoom.y,
			}
		: null;
	// biome-ignore lint/correctness/useExhaustiveDependencies: anchor left out on purpose, the listed values decide when it runs.
	const activePoint = useMemo<ActivePoint | null>(
		() =>
			activeFeature && activeIndex !== null && anchor
				? {
						index: activeIndex,
						datum: {
							key: activeFeature.key,
							label: activeFeature.label,
							value: activeFeature.value,
							fill: activeFeature.fill,
						},
						x: anchor.x,
						y: { value: anchor.y },
					}
				: null,
		[activeFeature, activeIndex, anchor?.x, anchor?.y],
	);
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) => String(datum.label ?? ""),
			rows: (datum: Datum) => [
				{
					key: String(datum.key),
					label: labels.value,
					color: String(datum.fill ?? "currentColor"),
					value: typeof datum.value === "number" ? datum.value : null,
				},
			],
		}),
		[activePoint, instant, labels.value],
	);

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				ref={svgRef}
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className={styles.svg()}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				onPointerLeave={() => !dragging && activeIndex !== null && setActive(null, false)}
			>
				<g
					data-slot="choropleth-layer"
					style={{
						transform: zoomTransform(zoom),
						transformOrigin: "0 0",
						transition: dragging || prefersReducedMotion() ? "none" : ZOOM_TRANSITION,
					}}
				>
					<g ref={layerRef}>
						{graticule ? (
							<path
								data-slot="choropleth-graticule"
								d={layout.graticule}
								className={styles.graticule()}
							/>
						) : null}
						{layout.features.map((feature) => (
							<path
								key={`${feature.index}-${feature.key}`}
								data-slot="choropleth-feature"
								data-key={feature.key}
								d={feature.path}
								fill={feature.fill}
								className={styles.feature()}
								style={{
									opacity: activeFeature && activeFeature !== feature ? dimOpacity : 1,
									transition: DIM_TRANSITION,
								}}
								onPointerEnter={() => onEnter(feature)}
							/>
						))}
						{activeFeature ? (
							<path
								d={activeFeature.path}
								fill="none"
								className="pointer-events-none stroke-foreground [stroke-width:1] [vector-effect:non-scaling-stroke]"
							/>
						) : null}
					</g>
				</g>
			</svg>
			{zoomable ? (
				<div className={styles.controls()}>
					<button
						type="button"
						aria-label={labels.zoomIn}
						className={styles.control()}
						disabled={zoom.k >= zoomMax}
						onClick={() =>
							setZoom(
								zoomAt(
									zoom,
									KEY_ZOOM_STEP,
									frame.width / 2,
									frame.height / 2,
									zoomMin,
									zoomMax,
								),
							)
						}
					>
						<svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
							<path
								d="M8 3v10M3 8h10"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								strokeLinecap="round"
							/>
						</svg>
					</button>
					<button
						type="button"
						aria-label={labels.zoomOut}
						className={styles.control()}
						disabled={zoom.k <= zoomMin}
						onClick={() =>
							setZoom(
								zoomAt(
									zoom,
									1 / KEY_ZOOM_STEP,
									frame.width / 2,
									frame.height / 2,
									zoomMin,
									zoomMax,
								),
							)
						}
					>
						<svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
							<path
								d="M3 8h10"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								strokeLinecap="round"
							/>
						</svg>
					</button>
					<button
						type="button"
						aria-label={labels.resetZoom}
						className={styles.control()}
						onClick={() => setZoom(IDENTITY_ZOOM)}
					>
						<svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
							<path
								d="M3 8a5 5 0 1 0 1.5-3.5M3 3v2.5h2.5"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>
			) : null}
			{frame.el ? (
				<ChartTooltipPanel anchor={anchor} instant={instant} bounds={frame}>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			) : null}
		</ActivePointProvider>
	);
}
