"use client";

import {
	type CSSProperties,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { ActivePoint, Datum, Margin } from "../../chart/core";
import {
	CHART_DURATION,
	CHART_EASE_CSS,
	prefersReducedMotion,
	tween,
} from "../../chart/motion";
import { useChart } from "../../chart/react/chart";
import { ActivePointProvider, ChartFrame } from "../../chart/react/frame";
import { useActiveIndex } from "../../chart/react/time-series";
import { ChartTooltipContent, ChartTooltipPanel } from "../../chart/react/tooltip";
import {
	type LaidLink,
	type LaidNode,
	LINK_OPACITY,
	labelPlacement,
	layoutSankey,
	NODE_FADED,
	SANKEY_MARGIN,
	SANKEY_TEXT,
	SANKEY_TIMING,
	type SankeyData,
	type SankeyText,
	visibleLabels,
} from "../layout";
import { type SankeyLinkColor, type SankeyOrientation, sankeyChart } from "../variants";

export interface SankeyChartProps {
	data: SankeyData;
	orientation?: SankeyOrientation;
	linkColor?: SankeyLinkColor;
	nodeWidth?: number;
	nodePadding?: number;
	/** Node names and values beside each node. */
	labels?: boolean;
	margin?: Partial<Margin>;
	text?: Partial<SankeyText>;
	animate?: boolean;
	/** Index of the highlighted link. */
	activeIndex?: number | null;
	defaultActiveIndex?: number | null;
	onActiveIndexChange?: (index: number | null) => void;
	roleDescription?: string;
	className?: string;
}

export type { SankeyText };

export function SankeyChart({
	data,
	orientation = "horizontal",
	linkColor = "gradient",
	nodeWidth = 16,
	nodePadding = 24,
	labels = true,
	margin,
	text: textProp,
	animate = true,
	activeIndex: activeIndexProp,
	defaultActiveIndex = null,
	onActiveIndexChange,
	roleDescription = "sankey diagram",
	className,
}: SankeyChartProps) {
	const { format, description } = useChart();
	const text = { ...SANKEY_TEXT, ...textProp };
	const { activeIndex, instant, setActive } = useActiveIndex(
		activeIndexProp,
		defaultActiveIndex,
		onActiveIndexChange,
	);
	// Table and summary read the unscaled graph, so they do not wait for layout.
	const flows = useMemo(
		() =>
			layoutSankey(data, {
				width: 1000,
				height: 600,
				nodeWidth,
				nodePadding,
				flow: "horizontal",
			}),
		[data, nodeWidth, nodePadding],
	);
	const name = (index: number) => data.nodes[index]?.name ?? "";
	const largest = flows.links.reduce<LaidLink | undefined>(
		(best, l) => (!best || l.value > best.value ? l : best),
		undefined,
	);
	const active = activeIndex !== null ? flows.links[activeIndex] : undefined;

	return (
		<ChartFrame
			roleDescription={roleDescription}
			summary={
				description ??
				(largest
					? `${data.nodes.length} nodes and ${flows.links.length} flows. Largest flow: ${name(largest.source)} to ${name(largest.target)}, ${format.number(largest.value)}.`
					: "No data.")
			}
			table={{
				columns: text.headers,
				rows: flows.links.map((l) => ({
					header: name(l.source),
					cells: [name(l.target), format.number(l.value), format.percent(l.share)],
				})),
			}}
			count={flows.links.length}
			activeIndex={activeIndex}
			onActiveChange={setActive}
			interactive={flows.links.length > 0}
			announcement={
				active && instant
					? `${name(active.source)} to ${name(active.target)}: ${format.number(active.value)}, ${format.percent(active.share)}`
					: ""
			}
			className={className}
		>
			{(frame) => (
				<SankeyPlot
					frame={frame}
					data={data}
					orientation={orientation}
					linkColor={linkColor}
					nodeWidth={nodeWidth}
					nodePadding={nodePadding}
					labels={labels}
					margin={{ ...SANKEY_MARGIN[orientation], ...margin }}
					text={text}
					animate={animate}
					activeIndex={activeIndex}
					instant={instant}
					setActive={setActive}
				/>
			)}
		</ChartFrame>
	);
}

function SankeyPlot({
	frame,
	data,
	orientation,
	linkColor,
	nodeWidth,
	nodePadding,
	labels,
	margin,
	text,
	animate,
	activeIndex,
	instant,
	setActive,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	data: SankeyData;
	orientation: SankeyOrientation;
	linkColor: SankeyLinkColor;
	nodeWidth: number;
	nodePadding: number;
	labels: boolean;
	margin: Margin;
	text: SankeyText;
	animate: boolean;
	activeIndex: number | null;
	instant: boolean;
	setActive: (index: number | null, fromKeyboard: boolean) => void;
}) {
	const { format } = useChart();
	const styles = sankeyChart({ orientation, linkColor });
	const gid = useId().replace(/:/g, "");
	const innerWidth = Math.max(0, frame.width - margin.left - margin.right);
	const innerHeight = Math.max(0, frame.height - margin.top - margin.bottom);
	const { nodes, links } = useMemo(
		() =>
			layoutSankey(data, {
				width: innerWidth,
				height: innerHeight,
				nodeWidth,
				nodePadding,
				flow: orientation,
			}),
		[data, innerWidth, innerHeight, nodeWidth, nodePadding, orientation],
	);
	const shownLabels = useMemo(
		() =>
			visibleLabels(nodes, orientation, (n) => [n.name, format.number(n.value)], {
				x0: -margin.left,
				x1: innerWidth + margin.right,
				y0: -margin.top,
				y1: innerHeight + margin.bottom,
			}),
		[nodes, orientation, format, margin, innerWidth, innerHeight],
	);
	const [hoveredNode, setHoveredNode] = useState<number | null>(null);

	// Data or flow changes replay the draw; resizes only relayout.
	const signature = `${orientation}|${data.nodes.map((n) => n.name).join(",")}|${data.links
		.map((l) => `${l.source}>${l.target}:${l.value}`)
		.join(",")}`;
	const [epoch, setEpoch] = useState(0);
	const prevSignature = useRef(signature);
	useLayoutEffect(() => {
		if (prevSignature.current === signature) return;
		prevSignature.current = signature;
		setEpoch((e) => e + 1);
	}, [signature]);

	const pathRefs = useRef<(SVGPathElement | null)[]>([]);
	const [lengths, setLengths] = useState<number[]>([]);
	const [entered, setEntered] = useState(!animate);
	const [settled, setSettled] = useState(!animate);
	// biome-ignore lint/correctness/useExhaustiveDependencies: epoch is a content key, so equal data does not re-run; links.length, nodes.length left out on purpose, the listed values decide when it runs.
	useLayoutEffect(() => {
		if (!animate || prefersReducedMotion() || links.length === 0) {
			setEntered(true);
			setSettled(true);
			return;
		}
		setLengths(pathRefs.current.map((p) => p?.getTotalLength() ?? 0));
		setEntered(false);
		setSettled(false);
		let raf = requestAnimationFrame(() => {
			raf = requestAnimationFrame(() => setEntered(true));
		});
		const clock = tween({
			duration: SANKEY_TIMING.total(nodes.length, links.length),
			ease: (t) => t,
			onUpdate: () => {},
			onComplete: () => setSettled(true),
		});
		return () => {
			cancelAnimationFrame(raf);
			clock.stop();
		};
		// Replays per epoch; geometry after that relayouts without redrawing.
	}, [epoch, animate]);

	const activeLink = activeIndex !== null ? links[activeIndex] : undefined;
	const linkLit = (l: LaidLink) =>
		activeIndex === l.index || hoveredNode === l.source || hoveredNode === l.target;
	const anyLit = activeLink !== undefined || hoveredNode !== null;
	const nodeLit = (n: LaidNode) =>
		hoveredNode === n.index ||
		(activeLink !== undefined &&
			(activeLink.source === n.index || activeLink.target === n.index)) ||
		(hoveredNode !== null &&
			links.some(
				(l) =>
					(l.source === hoveredNode && l.target === n.index) ||
					(l.target === hoveredNode && l.source === n.index),
			));

	const hoveredNodeData = hoveredNode !== null ? nodes[hoveredNode] : undefined;
	const activePoint = useMemo<ActivePoint | null>(() => {
		if (activeLink)
			return {
				index: activeLink.index,
				datum: { kind: "link", ...activeLink },
				x: margin.left + activeLink.mid.x,
				y: { value: margin.top + activeLink.mid.y },
			};
		if (hoveredNodeData)
			return {
				index: hoveredNodeData.index,
				datum: { kind: "node", ...hoveredNodeData },
				x: margin.left + (hoveredNodeData.x0 + hoveredNodeData.x1) / 2,
				y: { value: margin.top + (hoveredNodeData.y0 + hoveredNodeData.y1) / 2 },
			};
		return null;
	}, [activeLink, hoveredNodeData, margin.left, margin.top]);
	const name = (index: number) => data.nodes[index]?.name ?? "";
	// biome-ignore lint/correctness/useExhaustiveDependencies: data only invalidate it on change; name left out on purpose, the listed values decide when it runs.
	const activeValue = useMemo(
		() => ({
			active: activePoint,
			instant,
			title: (datum: Datum) =>
				datum.kind === "link"
					? `${name(Number(datum.source))} → ${name(Number(datum.target))}`
					: String(datum.name ?? ""),
			rows: (datum: Datum) =>
				datum.kind === "link"
					? [
							{
								key: "flow",
								label: text.flow,
								color: nodes[Number(datum.source)]?.color ?? "currentColor",
								value: Number(datum.value),
							},
							{
								key: "share",
								label: `${text.share}: ${format.percent(Number(datum.share))}`,
								color: nodes[Number(datum.target)]?.color ?? "currentColor",
								value: null,
							},
						]
					: [
							{
								key: "total",
								label: text.total,
								color: String(datum.color),
								value: Number(datum.value),
							},
						],
		}),
		[activePoint, instant, nodes, text, format, data],
	);

	const enterTransition = (delay: number, props: string[]) =>
		props
			.map((p) => `${p} ${CHART_DURATION.enter}ms ${CHART_EASE_CSS} ${delay}ms`)
			.join(", ");
	const fade = "opacity 180ms cubic-bezier(0, 0, 0.58, 1)";
	const nodeCount = nodes.length;
	const linkCount = links.length;

	return (
		<ActivePointProvider value={activeValue}>
			<svg
				aria-hidden="true"
				width={frame.width}
				height={frame.height}
				className="absolute inset-0 block overflow-visible"
				onPointerLeave={() => {
					setHoveredNode(null);
					if (activeIndex !== null) setActive(null, false);
				}}
			>
				{linkColor === "gradient" ? (
					<defs>
						{links.map((l) => (
							<linearGradient
								key={l.index}
								id={`${gid}-link-${l.index}`}
								gradientUnits="userSpaceOnUse"
								x1={l.from.x}
								y1={l.from.y}
								x2={l.to.x}
								y2={l.to.y}
							>
								<stop offset="0%" stopColor={nodes[l.source]?.color} />
								<stop offset="100%" stopColor={nodes[l.target]?.color} />
							</linearGradient>
						))}
					</defs>
				) : null}
				<g transform={`translate(${margin.left},${margin.top})`}>
					<g data-slot="sankey-links">
						{links.map((l, i) => {
							const length = lengths[i] ?? 0;
							const drawing = !settled && length > 0;
							const stroke =
								linkColor === "gradient"
									? `url(#${gid}-link-${l.index})`
									: (nodes[linkColor === "source" ? l.source : l.target]?.color ??
										"currentColor");
							const style: CSSProperties = {
								opacity: anyLit
									? linkLit(l)
										? LINK_OPACITY.highlight
										: LINK_OPACITY.faded
									: LINK_OPACITY.rest,
								strokeDasharray: drawing ? `${length} ${length}` : undefined,
								strokeDashoffset: drawing ? (entered ? 0 : length) : undefined,
								transition: !entered
									? "none"
									: settled
										? fade
										: `${enterTransition(SANKEY_TIMING.link(i, linkCount), ["stroke-dashoffset"])}, ${fade}`,
							};
							return (
								<path
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									key={`${epoch}-${l.source}-${l.target}-${i}`}
									ref={(node) => {
										pathRefs.current[i] = node;
									}}
									data-slot="sankey-link"
									data-active={activeIndex === l.index ? "" : undefined}
									d={l.path}
									stroke={stroke}
									strokeWidth={l.width}
									className={styles.link()}
									style={style}
									onPointerEnter={() => {
										setHoveredNode(null);
										setActive(l.index, false);
									}}
								/>
							);
						})}
					</g>
					<g data-slot="sankey-nodes">
						{nodes.map((n, i) => {
							const faded = anyLit && !nodeLit(n);
							const nodeDelay = SANKEY_TIMING.node(i, nodeCount);
							return (
								<g
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									key={`${epoch}-${n.name}-${i}`}
									data-slot="sankey-node"
									onPointerEnter={() => {
										if (activeIndex !== null) setActive(null, false);
										setHoveredNode(n.index);
									}}
									onPointerLeave={() => setHoveredNode(null)}
								>
									<rect
										x={n.x0}
										y={n.y0}
										width={Math.max(1, n.x1 - n.x0)}
										height={Math.max(1, n.y1 - n.y0)}
										rx={4}
										fill={n.color}
										className={styles.node()}
										style={{
											opacity: entered ? (faded ? NODE_FADED : 1) : 0,
											transform: entered ? "scaleY(1)" : "scaleY(0.9)",
											transition: !entered
												? "none"
												: settled
													? fade
													: enterTransition(nodeDelay, ["opacity", "transform"]),
										}}
									/>
									{labels
										? ([0, 1] as const).map((line) => {
												if (!shownLabels.get(n.index)?.[line]) return null;
												const at = labelPlacement(n, orientation, line);
												const target = line === 0 ? 1 : 0.6;
												const delay =
													line === 0
														? SANKEY_TIMING.name(i, nodeCount)
														: SANKEY_TIMING.value(i, nodeCount);
												return (
													<text
														key={line}
														x={at.x}
														y={at.y}
														dy="0.35em"
														textAnchor={at.anchor}
														className={line === 0 ? styles.name() : styles.value()}
														style={{
															opacity: entered
																? faded
																	? NODE_FADED * target
																	: target
																: 0,
															transform: entered
																? "translate(0px, 0px)"
																: `translate(${at.dx}px, ${at.dy}px)`,
															transition: !entered
																? "none"
																: settled
																	? fade
																	: enterTransition(delay, ["opacity", "transform"]),
														}}
													>
														{line === 0 ? n.name : format.number(n.value)}
													</text>
												);
											})
										: null}
								</g>
							);
						})}
					</g>
				</g>
			</svg>
			{frame.el ? (
				<ChartTooltipPanel
					anchor={activePoint ? { x: activePoint.x, y: activePoint.y.value ?? 0 } : null}
					instant={instant}
					bounds={frame}
				>
					<ChartTooltipContent />
				</ChartTooltipPanel>
			) : null}
		</ActivePointProvider>
	);
}
