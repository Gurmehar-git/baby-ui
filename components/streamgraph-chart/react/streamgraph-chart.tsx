"use client";

import {
	type CSSProperties,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ActivePoint, Datum, TooltipRow } from "../../chart/core";
import { CHART_DURATION, tween } from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	axisPicks,
	blendLayers,
	layerAt,
	type StreamLayers,
	streamExtent,
	streamLayers,
	streamPath,
	widestStretch,
} from "../stream";
import { type StreamgraphVariant, streamgraphChart } from "../variants";

export type { StreamgraphVariant };

export interface StreamgraphChartProps {
	data: Datum[];
	/** Key holding each row's label, shown on the axis and in the tooltip. */
	xKey: string;
	/** Stack offset: a flowing `wiggle`, a centred `silhouette`, or a flat `zero` baseline. */
	variant?: StreamgraphVariant;
	/** Names each layer inside its widest stretch when it is thick enough. */
	directLabels?: boolean;
	animate?: boolean;
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

const AXIS = 22;
const PAD = 8;

/** How the mix of several parts changes over time; series come from the chart config, the legend thins them out. */
export function StreamgraphChart({
	data,
	xKey,
	variant = "wiggle",
	directLabels = true,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "streamgraph",
	className,
}: StreamgraphChartProps) {
	const { config, hidden, format, description } = useChart();
	const keys = Object.keys(config);
	const label = (key: string) => {
		const entry = config[key]?.label;
		return typeof entry === "string" ? entry : key;
	};
	const keySignature = keys.join("|");
	const layers = useMemo(
		() => streamLayers(data, keySignature.split("|").filter(Boolean), hidden, variant),
		[data, keySignature, hidden, variant],
	);
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	const at = (index: number, key: string) => {
		const raw = data[index]?.[key];
		return typeof raw === "number" ? raw : 0;
	};
	const visible = keys.filter((key) => !hidden.has(key));
	const total = (index: number) => visible.reduce((sum, key) => sum + at(index, key), 0);
	const describe = (index: number) =>
		`${String(data[index]?.[xKey] ?? "")}: ${visible.map((key) => `${label(key)} ${format.number(at(index, key))}`).join(", ")}`;

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(data.length
					? `${visible.length} layers over ${data.length} points, from ${String(data[0]?.[xKey] ?? "")} to ${String(data[data.length - 1]?.[xKey] ?? "")}.`
					: "No data.")
			}
			table={{
				columns: [xKey, ...visible.map(label), "Total"],
				rows: data.map((datum, index) => ({
					header: String(datum[xKey] ?? ""),
					cells: [
						...visible.map((key) => format.number(at(index, key))),
						format.number(total(index)),
					],
				})),
			}}
			count={data.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={data.length > 0}
			announcement={activeIndex !== null && instant ? describe(activeIndex) : ""}
			className={className}
		>
			{(frame) => (
				<StreamPlot
					frame={frame}
					data={data}
					xKey={xKey}
					layers={layers}
					label={label}
					at={at}
					variant={variant}
					directLabels={directLabels}
					animate={animate}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function StreamPlot({
	frame,
	data,
	xKey,
	layers,
	label,
	at,
	variant,
	directLabels,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: Datum[];
	xKey: string;
	layers: StreamLayers;
	label: (key: string) => string;
	at: (index: number, key: string) => number;
	variant: StreamgraphVariant;
	directLabels: boolean;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { highlighted } = useChart();
	const [reveal, setReveal] = useState(animate ? 0 : 1);
	const [shown, setShown] = useState<StreamLayers>(layers);
	const [hoverKey, setHoverKey] = useState<string | null>(null);
	const previous = useRef<StreamLayers | null>(null);
	useLayoutEffect(() => {
		if (!animate) return setReveal(1);
		const playback = tween({ duration: CHART_DURATION.enter, onUpdate: setReveal });
		return () => playback.stop();
	}, [animate]);
	useLayoutEffect(() => {
		const from = previous.current;
		previous.current = layers;
		if (!from) return setShown(layers);
		const playback = tween({
			duration: CHART_DURATION.update,
			onUpdate: (t) => setShown(blendLayers(from, layers, t)),
		});
		return () => playback.stop();
	}, [layers]);
	const [lo, hi] = streamExtent(shown);
	const plotHeight = Math.max(1, frame.height - AXIS - PAD * 2);
	const step = data.length > 1 ? frame.width / (data.length - 1) : 0;
	const sx = (index: number) => index * step;
	const sy = (v: number) => PAD + (1 - (v - lo) / (hi - lo)) * plotHeight;
	const focus = hoverKey ?? highlighted;
	const s = streamgraphChart({ variant });
	const clipId = `stream-${useId().replace(/:/g, "")}`;
	const activePoint: ActivePoint | null =
		activeIndex !== null && data[activeIndex]
			? {
					index: activeIndex,
					datum: { ...data[activeIndex], index: activeIndex },
					x: sx(activeIndex),
					y: { value: PAD + plotHeight / 2 },
				}
			: null;
	const activeValue = {
		active: activePoint,
		instant,
		title: (datum: Datum) => String(datum[xKey] ?? ""),
		rows: (datum: Datum): TooltipRow[] => {
			const index = Number(datum.index);
			return [...layers]
				.reverse()
				.filter(
					(layer) =>
						layer.points[index] &&
						(layer.points[index]?.[1] ?? 0) - (layer.points[index]?.[0] ?? 0) > 0,
				)
				.map((layer) => ({
					key: layer.key,
					label: label(layer.key),
					color: `var(--color-${layer.key})`,
					value: at(index, layer.key),
				}));
		},
	};

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block touch-pan-y overflow-visible"
				onPointerMove={(event) => {
					if ((event.pointerType !== "mouse" && !event.buttons) || !step) return;
					const box = event.currentTarget.getBoundingClientRect();
					const index = Math.min(
						data.length - 1,
						Math.max(0, Math.round((event.clientX - box.left) / step)),
					);
					const valueAt =
						lo + (1 - (event.clientY - box.top - PAD) / plotHeight) * (hi - lo);
					setHoverKey(layerAt(shown, index, valueAt));
					setActive(index, false);
				}}
				onPointerLeave={() => {
					setHoverKey(null);
					if (activeIndex !== null) setActive(null, false);
				}}
			>
				<defs>
					<clipPath id={clipId}>
						<rect x={0} y={0} width={frame.width * reveal} height={frame.height} />
					</clipPath>
				</defs>
				<g clipPath={`url(#${clipId})`}>
					{shown.map((layer) => (
						<path
							key={layer.key}
							data-slot="streamgraph-layer"
							data-dim={focus != null && focus !== layer.key}
							d={streamPath(layer.points, sx, sy)}
							className={s.layer()}
							style={{ "--stream-color": `var(--color-${layer.key})` } as CSSProperties}
						/>
					))}
					{directLabels &&
						shown.map((layer) => {
							const widest = widestStretch(layer.points);
							const thick = (widest.thickness / (hi - lo)) * plotHeight;
							if (thick < 18 || !step) return null;
							const x = Math.min(Math.max(sx(widest.index), 32), frame.width - 32);
							return (
								<text
									key={`label-${layer.key}`}
									x={x}
									y={sy(widest.middle)}
									textAnchor="middle"
									dominantBaseline="central"
									className={s.label()}
									style={
										{ "--stream-color": `var(--color-${layer.key})` } as CSSProperties
									}
								>
									{label(layer.key)}
								</text>
							);
						})}
				</g>
				{activeIndex !== null && (
					<line
						x1={sx(activeIndex)}
						x2={sx(activeIndex)}
						y1={PAD}
						y2={PAD + plotHeight}
						className={s.cursor()}
					/>
				)}
				{axisPicks(data.length, frame.width).map((index) => (
					<text
						key={index}
						x={sx(index)}
						y={frame.height - 6}
						textAnchor={
							index === 0 ? "start" : index === data.length - 1 ? "end" : "middle"
						}
						className={s.tick()}
					>
						{String(data[index]?.[xKey] ?? "")}
					</text>
				))}
			</svg>
			<ChartTooltipPanel
				anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
				instant={instant}
				bounds={frame}
			>
				<ChartTooltipContent />
			</ChartTooltipPanel>
		</ActivePointProvider>
	);
}
