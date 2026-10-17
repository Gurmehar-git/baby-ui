"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { SlotText } from "../../slot-text/react/slot-text";
import { createSparkline, pointAt, scrubKey } from "../spark";
import { type SparklineVariant, sparkline } from "../variants";

export type { SparklineVariant };

export interface SparklineProps {
	data: number[];
	label: string;
	/** Headline value, such as "$12.4k"; scrubbing swaps in the point's value. */
	value?: string;
	/** Context beside the value, such as "+8.2%". */
	change?: string;
	/** One label per point, such as a date, shown while that point is scrubbed. */
	labels?: string[];
	formatValue?: (value: number, index: number) => string;
	/** Width and height ratio of the plot; it fills its container's width. */
	width?: number;
	height?: number;
	/** A faint fill under the line. */
	area?: boolean;
	/** Pointer and keyboard scrubbing through the points. */
	interactive?: boolean;
	variant?: SparklineVariant;
	className?: string;
}

const grouped = new Intl.NumberFormat("en-US");

/** A small trend line with a headline: it draws in once seen, morphs on new data and scrubs by pointer or keys. */
export function Sparkline({
	data,
	label,
	value,
	change,
	labels,
	formatValue,
	width = 160,
	height = 52,
	area = true,
	interactive = true,
	variant = "default",
	className,
}: SparklineProps) {
	const uid = `spark${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
	const rootRef = useRef<HTMLElement>(null);
	const plotRef = useRef<HTMLDivElement>(null);
	const refs = {
		svg: useRef<SVGSVGElement>(null),
		line: useRef<SVGPathElement>(null),
		trail: useRef<SVGPathElement>(null),
		area: useRef<SVGPathElement>(null),
		cursor: useRef<SVGLineElement>(null),
		dot: useRef<SVGPathElement>(null),
		lit: useRef<SVGRectElement>(null),
		dim: useRef<SVGRectElement>(null),
		fill: useRef<SVGRectElement>(null),
		baseline: useRef<SVGLineElement>(null),
	};
	const engine = useRef<ReturnType<typeof createSparkline> | null>(null);
	const [initialData] = useState(data);
	const [active, setActive] = useState<number | null>(null);
	const [landed, setLanded] = useState(false);
	const last = Math.max(1, data.length - 1);
	const index = active === null ? null : Math.min(active, last);
	const key = data.join(",");

	// biome-ignore lint/correctness/useExhaustiveDependencies: the engine mounts once and owns the drawing after
	useLayoutEffect(() => {
		const { svg, line, trail, cursor, dot, lit, dim, fill, baseline } = refs;
		const plot = plotRef.current;
		const root = rootRef.current;
		if (
			!svg.current ||
			!line.current ||
			!trail.current ||
			!cursor.current ||
			!dot.current
		)
			return;
		if (
			!lit.current ||
			!dim.current ||
			!fill.current ||
			!baseline.current ||
			!plot ||
			!root
		)
			return;
		const spark = createSparkline(
			{
				svg: svg.current,
				line: line.current,
				trail: trail.current,
				area: refs.area.current,
				cursor: cursor.current,
				dot: dot.current,
				lit: lit.current,
				dim: dim.current,
				fill: fill.current,
				baseline: baseline.current,
			},
			initialData,
			() => setLanded(true),
		);
		engine.current = spark;
		const ro = new ResizeObserver(() =>
			spark.resize(plot.clientWidth, (plot.clientWidth * height) / width),
		);
		ro.observe(plot);
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				io.disconnect();
				spark.reveal();
			},
			{ threshold: 0.5 },
		);
		io.observe(root);
		return () => {
			ro.disconnect();
			io.disconnect();
			spark.destroy();
		};
	}, []);
	// biome-ignore lint/correctness/useExhaustiveDependencies: the joined key stands in for the array
	useEffect(() => engine.current?.setData(data), [key]);
	useEffect(
		() => engine.current?.setCursor(index === null ? 1 : index / last),
		[index, last],
	);

	const s = sparkline({ variant });
	const format = (at: number) =>
		formatValue ? formatValue(data[at] ?? 0, at) : grouped.format(data[at] ?? 0);
	const scrubbing = index !== null;
	const point = format(index ?? last);
	const when = labels?.[index ?? last];
	const headline = value === undefined ? undefined : scrubbing ? point : value;
	const aside = !scrubbing
		? (change ?? "")
		: value === undefined
			? [point, when].filter(Boolean).join(" · ")
			: (when ?? `${index + 1} of ${last + 1}`);

	return (
		<figure
			ref={rootRef}
			data-slot="sparkline"
			aria-label={`${label}: ${value ?? data[last]}. ${change ?? ""}`.trim()}
			className={cn(s.root(), className)}
		>
			<figcaption className={s.caption()}>
				<span className={s.label()}>{label}</span>
				{headline !== undefined && (
					<strong className={s.value()}>
						<SlotText value={headline} spins={0} duration={0.35} stagger={0.02} />
					</strong>
				)}
				<small className={cn(s.aside(), scrubbing && "text-muted-foreground")}>
					<SlotText value={aside} spins={0} duration={0.35} stagger={0.02} />
				</small>
			</figcaption>
			<div
				ref={plotRef}
				className={s.plot()}
				{...(interactive && {
					role: "slider",
					tabIndex: 0,
					"aria-label": `${label}, explore values`,
					"aria-valuemin": 1,
					"aria-valuemax": last + 1,
					"aria-valuenow": (index ?? last) + 1,
					"aria-valuetext": `${when ?? (index === null ? "Latest" : `Point ${index + 1} of ${last + 1}`)}: ${point}`,
					onPointerDown: (event: React.PointerEvent<HTMLDivElement>) =>
						setActive(pointAt(event.currentTarget, event.clientX, last)),
					onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
						if (event.pointerType === "mouse" || event.buttons)
							setActive(pointAt(event.currentTarget, event.clientX, last));
					},
					onPointerUp: (event: React.PointerEvent<HTMLDivElement>) =>
						event.pointerType !== "mouse" && setActive(null),
					onPointerLeave: () => setActive(null),
					onPointerCancel: () => setActive(null),
					onBlur: () => setActive(null),
					onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
						if (event.key === "Escape" && scrubbing) {
							event.preventDefault();
							setActive(null);
							return;
						}
						const next = scrubKey(event.key, index ?? last, last);
						if (next === null) return;
						event.preventDefault();
						setActive(next);
					},
				})}
			>
				<svg
					ref={refs.svg}
					aria-hidden
					focusable="false"
					viewBox={`0 0 ${width} ${height}`}
					className={s.chart()}
				>
					<defs>
						<clipPath id={`${uid}-lit`} clipPathUnits="userSpaceOnUse">
							<rect ref={refs.lit} x={-16} y={-16} />
						</clipPath>
						<clipPath id={`${uid}-dim`} clipPathUnits="userSpaceOnUse">
							<rect ref={refs.dim} y={-16} />
						</clipPath>
						<clipPath id={`${uid}-fill`} clipPathUnits="userSpaceOnUse">
							<rect ref={refs.fill} x={-16} y={-16} />
						</clipPath>
					</defs>
					{area && (
						<path ref={refs.area} clipPath={`url(#${uid}-fill)`} className={s.area()} />
					)}
					<line ref={refs.baseline} x1={0} className={s.baseline()} />
					<path
						ref={refs.trail}
						data-on={scrubbing && landed}
						clipPath={`url(#${uid}-dim)`}
						className={s.trail()}
					/>
					<path
						ref={refs.line}
						pathLength={1}
						clipPath={`url(#${uid}-lit)`}
						className={s.line()}
					/>
					<line ref={refs.cursor} y1={0} data-on={scrubbing} className={s.cursor()} />
					<path
						ref={refs.dot}
						data-landed={landed}
						data-scrub={scrubbing}
						className={s.dot()}
					/>
				</svg>
			</div>
		</figure>
	);
}
