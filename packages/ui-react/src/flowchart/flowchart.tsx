"use client";

import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { Badge } from "../badge/badge";
import { cn } from "../lib/cn";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../select/select";
import { type FlowchartBackground, flowchartCanvas } from "./variants";

export type { FlowchartBackground };

const PAD_Y = 24;
const ROW_GAP = 64;
const PILL_OFFSET = 30;

const mix = (hue: string, pct: number, base = "var(--card)") =>
	`color-mix(in srgb, ${hue} ${pct}%, ${base})`;

export type FlowchartOption = { value: string; label: string; tag?: string };

export type FlowchartConditionRow = {
	id: string;
	connector: string;
	source: string;
	property: string;
	propertyOptions: FlowchartOption[];
	comparator?: string;
	value: string;
	valueOptions: FlowchartOption[];
	dot?: boolean;
};

export type StepNode = {
	id: string;
	row: number;
	x: number;
	w: number;
	hue: string;
	kindLabel?: string;
	icon?: ReactNode;
	title?: string;
	caption?: string;
	conditions?: FlowchartConditionRow[];
};

export type FlowchartEdge = { from: string; to: string };

const EST_HEIGHT = 92;

function BoltIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="currentColor" />
		</svg>
	);
}

function ConditionChip({
	value,
	options,
	onValueChange,
	dot,
	width,
}: {
	value: string;
	options: FlowchartOption[];
	onValueChange: (value: string) => void;
	dot?: boolean;
	width: string;
}) {
	const current = options.find((o) => o.value === value);
	return (
		<span data-ui className="relative inline-flex min-w-0">
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className="h-6 min-w-0 gap-1 rounded-md border-none bg-muted px-1.5 font-medium text-xs text-foreground [&>svg]:size-3">
					{dot ? <span className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
					<SelectValue>{current?.label ?? value}</SelectValue>
				</SelectTrigger>
				<SelectContent className={width}>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<span className="flex min-w-0 flex-1 items-center justify-between gap-2">
								<span className="truncate">{option.label}</span>
								{option.tag ? (
									<span className="shrink-0 text-xs text-muted-foreground">
										{option.tag}
									</span>
								) : null}
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</span>
	);
}

function ConditionRows({
	nodeId,
	conditions,
	onConditionChange,
}: {
	nodeId: string;
	conditions: FlowchartConditionRow[];
	onConditionChange?: (
		nodeId: string,
		rowId: string,
		field: "property" | "value",
		value: string,
	) => void;
}) {
	function update(rowId: string, field: "property" | "value", value: string) {
		onConditionChange?.(nodeId, rowId, field, value);
	}

	return (
		<div className="flex flex-col gap-1.5 px-3 py-2.5">
			{conditions.map((row) => (
				<div
					key={row.id}
					className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1.5"
				>
					<span className="w-8 shrink-0 text-xs text-muted-foreground">
						{row.connector}
					</span>
					<Badge variant="secondary" size="sm">
						{row.source}
					</Badge>
					<ConditionChip
						value={row.property}
						options={row.propertyOptions}
						onValueChange={(v) => update(row.id, "property", v)}
						width="w-36"
					/>
					<span className="text-xs text-muted-foreground">{row.comparator ?? "is"}</span>
					<ConditionChip
						value={row.value}
						options={row.valueOptions}
						onValueChange={(v) => update(row.id, "value", v)}
						dot={row.dot}
						width="w-56"
					/>
				</div>
			))}
		</div>
	);
}

function StepBody({ node }: { node: StepNode }) {
	return (
		<div className="flex items-center gap-2.5 p-2.5">
			<span
				className="flex size-9 shrink-0 items-center justify-center rounded-lg"
				style={{
					background: mix(node.hue, 12),
					color: node.hue,
					boxShadow: `0 0 0 1px ${mix(node.hue, 20)}`,
				}}
			>
				{node.icon ?? <BoltIcon />}
			</span>
			<span className="min-w-0 text-left">
				<span className="block truncate font-semibold text-sm text-foreground leading-tight">
					{node.title}
				</span>
				<span className="mt-0.5 block text-xs text-muted-foreground leading-snug">
					{node.caption}
				</span>
			</span>
		</div>
	);
}

export interface FlowchartProps {
	/** Every node on the canvas; each is draggable and positioned from its own `row`/`x`. */
	steps: StepNode[];
	/** Connectors drawn between nodes, by id. */
	edges?: FlowchartEdge[];
	background?: FlowchartBackground;
	onConditionChange?: (
		nodeId: string,
		rowId: string,
		field: "property" | "value",
		value: string,
	) => void;
	className?: string;
}

/** A workflow canvas: nodes drag anywhere, the bezier connector follows, condition rows
 * pick real values through the real Select rather than a hand-rolled anchored popup. */
export function Flowchart({
	steps,
	edges = [],
	background = "dots",
	onConditionChange,
	className,
}: FlowchartProps) {
	const canvasRef = useRef<HTMLDivElement>(null);
	const nodeRefs = useRef(new Map<string, HTMLElement>());
	const [width, setWidth] = useState(0);
	const [heights, setHeights] = useState<Record<string, number>>({});
	const [selected, setSelected] = useState<string | null>(null);
	const [offsets, setOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
	const drag = useRef<{
		id: string;
		startX: number;
		startY: number;
		baseDx: number;
		baseDy: number;
		moved: boolean;
	} | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: steps.
	useLayoutEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		function measure() {
			if (!canvas) return;
			setWidth(canvas.clientWidth);
			setHeights((prev) => {
				const next = { ...prev };
				let changed = false;
				nodeRefs.current.forEach((el, id) => {
					const h = el.offsetHeight;
					if (h && Math.abs(h - (next[id] ?? 0)) > 0.5) {
						next[id] = h;
						changed = true;
					}
				});
				return changed ? next : prev;
			});
		}

		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(canvas);
		nodeRefs.current.forEach((el) => {
			observer.observe(el);
		});
		return () => observer.disconnect();
	}, [steps]);

	const rows = [...new Set(steps.map((n) => n.row))].sort((a, b) => a - b);
	const rowH = rows.map((r) =>
		Math.max(...steps.filter((n) => n.row === r).map((n) => heights[n.id] ?? EST_HEIGHT)),
	);
	const rowY: number[] = [];
	rows.forEach((_, i) => {
		rowY[i] =
			i === 0 ? PAD_Y : (rowY[i - 1] ?? 0) + (rowH[i - 1] ?? EST_HEIGHT) + ROW_GAP;
	});
	const canvasH =
		(rowY[rows.length - 1] ?? 0) + (rowH[rows.length - 1] ?? EST_HEIGHT) + PAD_Y;

	const cw = width || 480;
	function place(n: StepNode) {
		const w = Math.min(n.w, cw * 0.92);
		const off = offsets[n.id];
		return {
			w,
			cx: n.x * cw + (off?.dx ?? 0),
			top: (rowY[rows.indexOf(n.row)] ?? 0) + (off?.dy ?? 0),
		};
	}

	function anchors(n: StepNode) {
		const { cx, top } = place(n);
		return {
			top: { x: cx, y: top + (n.kindLabel ? PILL_OFFSET : 0) },
			bottom: { x: cx, y: top + (heights[n.id] ?? EST_HEIGHT) },
		};
	}

	function bezier(edge: FlowchartEdge) {
		const fromNode = steps.find((n) => n.id === edge.from);
		const toNode = steps.find((n) => n.id === edge.to);
		if (!fromNode || !toNode) return "";
		const from = anchors(fromNode).bottom;
		const to = anchors(toNode).top;
		const k = Math.min(Math.max(Math.abs(to.y - from.y) * 0.55, 24), 84);
		return `M ${from.x} ${from.y} C ${from.x} ${from.y + k}, ${to.x} ${to.y - k}, ${to.x} ${to.y}`;
	}

	function onPointerDown(node: StepNode) {
		return (event: ReactPointerEvent<HTMLDivElement>) => {
			if ((event.target as Element).closest("[data-ui]")) return;
			const off = offsets[node.id];
			drag.current = {
				id: node.id,
				startX: event.clientX,
				startY: event.clientY,
				baseDx: off?.dx ?? 0,
				baseDy: off?.dy ?? 0,
				moved: false,
			};
			event.currentTarget.setPointerCapture(event.pointerId);
		};
	}

	function onPointerMove(node: StepNode) {
		return (event: ReactPointerEvent<HTMLDivElement>) => {
			const d = drag.current;
			if (!d || d.id !== node.id) return;
			const dx = d.baseDx + event.clientX - d.startX;
			const dy = d.baseDy + event.clientY - d.startY;
			if (!d.moved && Math.hypot(dx - d.baseDx, dy - d.baseDy) < 3) return;
			d.moved = true;

			const { w } = place(node);
			const h = heights[node.id] ?? EST_HEIGHT;
			const baseCx = node.x * cw;
			const baseTop = rowY[rows.indexOf(node.row)] ?? 0;
			const cx = Math.min(Math.max(baseCx + dx, w / 2 + 8), cw - w / 2 - 8);
			const top = Math.min(Math.max(baseTop + dy, 8), canvasH - h - 8);
			setOffsets((current) => ({
				...current,
				[node.id]: { dx: cx - baseCx, dy: top - baseTop },
			}));
		};
	}

	function onPointerUp(node: StepNode) {
		return () => {
			const d = drag.current;
			if (d?.id === node.id) {
				if (d.moved) {
					setTimeout(() => (drag.current = null), 0);
				} else {
					drag.current = null;
					if (!node.conditions) {
						setSelected((current) => (current === node.id ? null : node.id));
					}
				}
			}
		};
	}

	function isLit(edge: FlowchartEdge) {
		return selected === edge.from || selected === edge.to;
	}

	return (
		<div
			ref={canvasRef}
			data-slot="flowchart"
			className={cn(flowchartCanvas({ background }), className)}
			style={{ height: canvasH }}
		>
			<svg
				width={cw}
				height={canvasH}
				aria-hidden
				className="pointer-events-none absolute inset-0"
			>
				{edges.map((edge) => (
					<path
						key={`${edge.from}-${edge.to}`}
						d={bezier(edge)}
						fill="none"
						stroke={isLit(edge) ? "var(--primary)" : "var(--border)"}
						strokeWidth="1.25"
						className="transition-[stroke] duration-(--duration-fast)"
					/>
				))}
			</svg>

			{steps.map((node) => {
				const { w, cx, top } = place(node);
				const active = selected === node.id;
				return (
					<div
						key={node.id}
						ref={(el) => {
							if (el) nodeRefs.current.set(node.id, el);
							else nodeRefs.current.delete(node.id);
						}}
						onPointerDown={onPointerDown(node)}
						onPointerMove={onPointerMove(node)}
						onPointerUp={onPointerUp(node)}
						className="absolute flex touch-none -translate-x-1/2 flex-col items-start gap-1.5"
						style={{
							left: cx,
							top,
							width: w,
							zIndex: drag.current?.id === node.id ? 2 : 1,
						}}
					>
						{node.kindLabel ? (
							<span
								className="inline-flex h-6 items-center rounded-md px-2 font-medium text-xs"
								style={{
									background: mix(node.hue, 14, "var(--background)"),
									color: mix(node.hue, 80, "var(--foreground)"),
								}}
							>
								{node.kindLabel}
							</span>
						) : null}
						{node.conditions ? (
							<div className="w-full rounded-2xl bg-card shadow-sm transition-shadow duration-(--duration-fast) hover:shadow-md">
								<ConditionRows
									nodeId={node.id}
									conditions={node.conditions}
									onConditionChange={onConditionChange}
								/>
							</div>
						) : (
							<button
								type="button"
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										event.preventDefault();
										setSelected(active ? null : node.id);
									}
								}}
								aria-pressed={active}
								className={cn(
									"w-full cursor-pointer rounded-2xl bg-card text-left outline-none transition-shadow duration-(--duration-fast) focus-visible:shadow-[0_0_0_1.5px_var(--primary)]",
									active
										? "shadow-[0_0_0_1.5px_var(--primary),0_2px_10px_rgba(0,0,0,0.045)]"
										: "shadow-sm hover:shadow-md",
								)}
							>
								<StepBody node={node} />
							</button>
						)}
					</div>
				);
			})}
		</div>
	);
}
