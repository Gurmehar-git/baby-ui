"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../breadcrumb/breadcrumb";
import { breadcrumb } from "../breadcrumb/variants";
import { useChart } from "../chart/chart";
import type { ActivePoint, Datum, TooltipRow } from "../chart/core";
import { ActivePointProvider, ChartFrame } from "../chart/frame";
import { ChartTooltipContent, ChartTooltipPanel } from "../chart/tooltip";
import { cn } from "../lib/cn";
import {
	branchHue,
	createTreemapStage,
	type FlatNode,
	flattenTree,
	layoutFrom,
	nearestTile,
	type Rect,
	SHADE_STEPS,
	shadeFor,
	type TreemapNode,
	topOf,
} from "./layout";
import { type TreemapVariant, treemapChart } from "./variants";

export type { TreemapNode, TreemapVariant };

export interface TreemapChartProps {
	/** The root; its label names the whole in the first breadcrumb. */
	data: TreemapNode;
	/** Names the shading measure, such as "Growth"; tiles deepen with it. Leave out for one depth. */
	colorLabel?: string;
	formatColor?: (value: number) => string;
	/** Range of the colour measure; defaults to the leaves' range. */
	colorDomain?: [number, number];
	/** Id of the node that fills the view. */
	focus?: string;
	defaultFocus?: string;
	onFocusChange?: (id: string) => void;
	variant?: TreemapVariant;
	/** Screen-reader table headers: path, value, share of parent. */
	tableHeaders?: [string, string, string];
	roleDescription?: string;
	className?: string;
}

const DIRS: Record<string, [number, number]> = {
	ArrowRight: [1, 0],
	ArrowLeft: [-1, 0],
	ArrowDown: [0, 1],
	ArrowUp: [0, -1],
};

/** A zoomable hierarchy of parts: click or Enter drills into a branch, Escape or a breadcrumb climbs back. */
export function TreemapChart({
	data,
	colorLabel,
	formatColor,
	colorDomain,
	focus,
	defaultFocus,
	onFocusChange,
	variant = "default",
	tableHeaders = ["Path", "Value", "Share of parent"],
	roleDescription = "treemap",
	className,
}: TreemapChartProps) {
	const { format, description } = useChart();
	const flat = useMemo(() => flattenTree(data), [data]);
	const root = flat.get(data.id);
	const nodes = useMemo(
		() => [...flat.values()].filter((node) => node.depth > 0),
		[flat],
	);
	const [ownFocus, setOwnFocus] = useState(defaultFocus ?? data.id);
	const wanted = flat.get(focus ?? ownFocus);
	const center = wanted?.children.length ? wanted : root;
	const [active, setActive] = useState<string | null>(null);
	const [instant, setInstant] = useState(false);
	const zoomTo = (id: string) => {
		if (focus === undefined) setOwnFocus(id);
		onFocusChange?.(id);
	};
	const leaves = nodes.filter((node) => !node.children.length && node.color !== null);
	const domain: [number, number] | null =
		colorLabel === undefined || !leaves.length
			? null
			: (colorDomain ?? [
					Math.min(...leaves.map((node) => node.color ?? 0)),
					Math.max(...leaves.map((node) => node.color ?? 0)),
				]);
	const colour = (value: number) =>
		formatColor ? formatColor(value) : format.number(value);
	const parentOf = (node: FlatNode) =>
		node.parent ? (flat.get(node.parent) ?? node) : node;
	const share = (node: FlatNode) => {
		const parent = parentOf(node);
		return format.percent(parent.value ? node.value / parent.value : 0);
	};
	const tops = center
		? center.children
				.map((id) => flat.get(id))
				.filter((node): node is FlatNode => !!node && node.value > 0)
		: [];
	const activeNode = active ? flat.get(active) : undefined;
	const describe = (node: FlatNode) =>
		`${node.path.join(", ")}, ${format.number(node.value)}, ${share(node)} of ${parentOf(node).label}${domain && node.color !== null ? `, ${colorLabel} ${colour(node.color)}` : ""}`;
	const trail: FlatNode[] = [];
	for (let at = center; at; at = at.parent ? flat.get(at.parent) : undefined)
		trail.unshift(at);
	const crumbLink = breadcrumb().link();
	const keys = useRef<((key: string) => boolean) | null>(null);
	const onKey = (key: string, rects: Map<string, Rect>) => {
		if (!center) return false;
		const current = topOf(flat, active, center.id);
		const dir = DIRS[key];
		if (dir) {
			const next = current
				? nearestTile(
						rects,
						tops.map((node) => node.id),
						current.id,
						dir[0],
						dir[1],
					)
				: tops[0]?.id;
			if (next) {
				setInstant(true);
				setActive(next);
			}
			return true;
		}
		if ((key === "Enter" || key === " ") && current?.children.length) {
			zoomTo(current.id);
			setActive(current.children[0] ?? null);
			return true;
		}
		if ((key === "Escape" || key === "Backspace") && center.parent) {
			const from = center.id;
			zoomTo(center.parent);
			setActive(from);
			return true;
		}
		return false;
	};
	const s = treemapChart({ variant });

	if (!root || !center) return null;
	return (
		<>
			<div className={s.bar()}>
				<Breadcrumb aria-label={`${root.label} path`}>
					<BreadcrumbList>
						{trail.map((node, index) => (
							<BreadcrumbItem key={node.id}>
								{index > 0 && <BreadcrumbSeparator />}
								{index < trail.length - 1 ? (
									<button
										type="button"
										className={cn(crumbLink, s.crumb())}
										onClick={() => {
											zoomTo(node.id);
											setActive(null);
										}}
									>
										{node.label}
									</button>
								) : (
									<BreadcrumbPage className={s.crumb()}>{node.label}</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<span className={s.total()}>{format.number(center.value)}</span>
			</div>
			<ChartFrame
				roleDescription={roleDescription}
				summary={
					description ??
					`${center.label}, ${format.number(center.value)}, in ${tops.length} parts. Enter zooms in, Escape zooms out.`
				}
				table={{
					columns: tableHeaders,
					rows: nodes.map((node) => ({
						header: node.path.join(" / "),
						cells: [format.number(node.value), share(node)],
					})),
				}}
				count={tops.length}
				activeIndex={
					activeNode
						? tops.findIndex(
								(node) => node.id === topOf(flat, activeNode.id, center.id)?.id,
							)
						: null
				}
				onActiveChange={(index, fromKeyboard) => {
					setInstant(fromKeyboard);
					setActive(index === null ? null : (tops[index]?.id ?? null));
				}}
				interactive={tops.length > 0}
				announcement={instant && activeNode ? describe(activeNode) : ""}
				onKey={(event) => keys.current?.(event.key) ?? false}
				className={className}
			>
				{(frame) => (
					<TreemapPlot
						frame={frame}
						flat={flat}
						nodes={nodes}
						center={center}
						active={active}
						instant={instant}
						domain={domain}
						colorLabel={colorLabel}
						colour={colour}
						share={share}
						variant={variant}
						bindKeys={(handler) => {
							keys.current = handler;
						}}
						onKey={onKey}
						setActive={(id, fromKeyboard) => {
							setInstant(fromKeyboard);
							setActive(id);
						}}
						onTile={(node) => {
							const top = topOf(flat, node.id, center.id);
							if (top?.children.length) zoomTo(top.id);
							else setActive(node.id);
						}}
					/>
				)}
			</ChartFrame>
			{domain && (
				<div aria-hidden className={s.scale()}>
					<span>{colorLabel}</span>
					<span className="tabular-nums">{colour(domain[0])}</span>
					<span className={s.steps()}>
						{Array.from({ length: SHADE_STEPS }, (_, step) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: fixed scale steps
								key={step}
								className={s.step()}
								style={
									{
										"--treemap-fill": `color-mix(in oklab, var(--color-foreground) ${Math.round(14 + (step / (SHADE_STEPS - 1)) * 44)}%, var(--color-background))`,
									} as CSSProperties
								}
							/>
						))}
					</span>
					<span className="tabular-nums">{colour(domain[1])}</span>
				</div>
			)}
		</>
	);
}

function TreemapPlot({
	frame,
	flat,
	nodes,
	center,
	active,
	instant,
	domain,
	colorLabel,
	colour,
	share,
	variant,
	bindKeys,
	onKey,
	setActive,
	onTile,
}: {
	frame: { width: number; height: number; el: HTMLDivElement | null };
	flat: Map<string, FlatNode>;
	nodes: FlatNode[];
	center: FlatNode;
	active: string | null;
	instant: boolean;
	domain: [number, number] | null;
	colorLabel?: string;
	colour: (value: number) => string;
	share: (node: FlatNode) => string;
	variant: TreemapVariant;
	bindKeys: (handler: (key: string) => boolean) => void;
	onKey: (key: string, rects: Map<string, Rect>) => boolean;
	setActive: (id: string | null, fromKeyboard: boolean) => void;
	onTile: (node: FlatNode) => void;
}) {
	const { format } = useChart();
	const tiles = useRef(new Map<string, HTMLDivElement>());
	const stage = useRef<ReturnType<typeof createTreemapStage> | null>(null);
	stage.current ??= createTreemapStage((id) => tiles.current.get(id));
	const view = useMemo<Rect>(
		() => ({ x: 0, y: 0, w: frame.width, h: frame.height }),
		[frame.width, frame.height],
	);
	const target = useMemo(
		() => layoutFrom(flat, center.id, view),
		[flat, center.id, view],
	);
	const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
	bindKeys((key) => {
		setPointer(null);
		return onKey(key, target);
	});
	useEffect(() => {
		if (view.w > 0) stage.current?.show(flat, center.id, target, view);
	}, [flat, center.id, target, view]);
	useEffect(() => () => stage.current?.destroy(), []);
	const branchOf = useMemo(() => {
		const map = new Map<string, number>();
		const root = [...flat.values()].find((node) => node.depth === 0);
		root?.children.forEach((id, index) => {
			const walk = (at: string) => {
				map.set(at, index);
				for (const child of flat.get(at)?.children ?? []) walk(child);
			};
			walk(id);
		});
		return map;
	}, [flat]);
	const activeNode = active ? flat.get(active) : undefined;
	const focusTop = topOf(flat, active, center.id);
	const rect = activeNode ? target.get(activeNode.id) : undefined;
	const activePoint: ActivePoint | null =
		activeNode && rect
			? {
					index: 0,
					datum: { ...activeNode },
					x: pointer?.x ?? rect.x + rect.w / 2,
					y: { value: pointer?.y ?? rect.y + Math.min(rect.h / 2, 28) },
				}
			: null;
	const activeValue = {
		active: activePoint,
		instant,
		title: (datum: Datum) =>
			(Array.isArray(datum.path) ? datum.path.slice(0, -1).join(" / ") : "") ||
			String(datum.label ?? ""),
		rows: (datum: Datum): TooltipRow[] => {
			const node = flat.get(String(datum.id));
			if (!node) return [];
			const rows: TooltipRow[] = [
				{
					key: node.id,
					label: `${node.label}, ${share(node)}`,
					color: branchHue(branchOf.get(node.id) ?? -1),
					value: node.value,
				},
			];
			if (domain && node.color !== null)
				rows.push({
					key: `${node.id}-color`,
					label: `${colorLabel} ${colour(node.color)}`,
					color: "transparent",
					value: null,
				});
			return rows;
		},
	};

	return (
		<ActivePointProvider value={activeValue}>
			<div
				aria-hidden="true"
				className="absolute inset-0"
				onPointerLeave={() => {
					setActive(null, false);
					setPointer(null);
				}}
			>
				{nodes.map((node) => {
					const top = topOf(flat, node.id, center.id);
					const hue = branchHue(branchOf.get(node.id) ?? -1);
					return (
						// biome-ignore lint/a11y/useKeyWithClickEvents: the chart frame handles keys for every tile
						// biome-ignore lint/a11y/noStaticElementInteractions: tiles are pointer shortcuts for the focusable plot
						<div
							key={node.id}
							ref={(el) => {
								if (el) tiles.current.set(node.id, el);
								else tiles.current.delete(node.id);
							}}
							data-slot="treemap-tile"
							data-branch={node.children.length > 0}
							data-active={active === node.id}
							data-dim={!!focusTop && !!top && focusTop.id !== top.id}
							className={treemapChart({ variant }).tile()}
							style={
								{
									"--treemap-hue": hue,
									"--treemap-fill": `color-mix(in oklab, ${hue} ${shadeFor(node.color, domain)}%, var(--color-background))`,
									zIndex: node.depth,
									visibility: "hidden",
								} as CSSProperties
							}
							onPointerMove={(event) => {
								event.stopPropagation();
								if (event.pointerType !== "mouse") return;
								const box = event.currentTarget.parentElement?.getBoundingClientRect();
								if (box)
									setPointer({ x: event.clientX - box.left, y: event.clientY - box.top });
								setActive(node.id, false);
							}}
							onClick={(event) => {
								event.stopPropagation();
								onTile(node);
							}}
						>
							<span className={treemapChart().label()}>{node.label}</span>
							<span className={treemapChart().value()}>{format.number(node.value)}</span>
						</div>
					);
				})}
			</div>
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
