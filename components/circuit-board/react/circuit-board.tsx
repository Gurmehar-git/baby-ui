"use client";

import { type CSSProperties, useId } from "react";
import { cn } from "../../lib/cn";
import {
	buildTraces,
	type CircuitConnection,
	type CircuitNode,
	circuitDelay,
} from "../geometry";
import {
	type CircuitBoardSpeed,
	type CircuitBoardTone,
	type CircuitNodeStatus,
	circuitBoard,
	circuitNode,
} from "../variants";

export type {
	CircuitBoardSpeed,
	CircuitBoardTone,
	CircuitConnection,
	CircuitNode,
	CircuitNodeStatus,
};

export interface CircuitBoardProps {
	nodes: CircuitNode[];
	connections: CircuitConnection[];
	/** Board width in the units node positions use; the SVG scales to its container. */
	width?: number;
	height?: number;
	/** Node square side, in board units. */
	nodeSize?: number;
	/** Dot grid spacing, in board units. */
	gridSize?: number;
	showGrid?: boolean;
	tone?: CircuitBoardTone;
	speed?: CircuitBoardSpeed;
	/** Accessible name; without it the board is decorative. */
	label?: string;
	className?: string;
}

const delay = (seconds: number | string) =>
	({
		"--circuit-board-delay": typeof seconds === "number" ? `${seconds}s` : seconds,
	}) as CSSProperties;

/** Nodes joined by right-angled traces that draw in, then carry travelling pulses. */
export function CircuitBoard({
	nodes,
	connections,
	width = 600,
	height = 400,
	nodeSize = 32,
	gridSize = 20,
	showGrid = true,
	tone = "primary",
	speed = "normal",
	label,
	className,
}: CircuitBoardProps) {
	const uid = useId().replace(/:/g, "");
	const s = circuitBoard({ tone, speed });
	const traces = buildTraces(nodes, connections, nodeSize);
	const half = nodeSize / 2;

	return (
		<div data-slot="circuit-board" className={cn(s.root(), className)}>
			<svg
				viewBox={`0 0 ${width} ${height}`}
				className={s.svg()}
				role={label ? "img" : undefined}
				aria-label={label}
				aria-hidden={label ? undefined : true}
			>
				<defs>
					<filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="2.5" result="blur" />
						<feMerge>
							<feMergeNode in="blur" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
					{showGrid ? (
						<pattern
							id={`${uid}-grid`}
							width={gridSize}
							height={gridSize}
							patternUnits="userSpaceOnUse"
						>
							<circle cx={gridSize / 2} cy={gridSize / 2} r="0.8" className={s.grid()} />
						</pattern>
					) : null}
				</defs>
				{showGrid ? (
					<rect width={width} height={height} fill={`url(#${uid}-grid)`} />
				) : null}
				{traces.map((t) => (
					<g key={t.key}>
						<path
							d={t.d}
							pathLength={100}
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className={s.trace()}
							style={delay(circuitDelay.trace(t.index))}
						/>
						{t.animated !== false ? (
							<path
								d={t.d}
								pathLength={100}
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								filter={`url(#${uid}-glow)`}
								className={s.pulse()}
								style={delay(circuitDelay.pulse(t.index))}
							/>
						) : null}
						{t.animated !== false && t.bidirectional ? (
							<path
								d={t.d}
								pathLength={100}
								strokeWidth={3}
								strokeLinecap="round"
								strokeLinejoin="round"
								filter={`url(#${uid}-glow)`}
								className={s.pulseBack()}
								style={delay(
									`calc(${circuitDelay.pulse(t.index)}s + var(--circuit-board-speed) / 2)`,
								)}
							/>
						) : null}
					</g>
				))}
				{nodes.map((node, i) => {
					const n = circuitNode({ status: node.status });
					return (
						<g
							key={node.id}
							data-status={node.status ?? "idle"}
							className={n.node()}
							style={delay(circuitDelay.node(i))}
						>
							<rect
								x={node.x - half}
								y={node.y - half}
								width={nodeSize}
								height={nodeSize}
								rx={nodeSize / 5}
								className={n.box()}
							/>
							{node.label ? (
								<text
									x={node.x}
									y={node.y + half + 16}
									textAnchor="middle"
									className={n.label()}
								>
									{node.label}
								</text>
							) : null}
						</g>
					);
				})}
			</svg>
		</div>
	);
}
