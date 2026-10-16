<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	buildTraces,
	type CircuitConnection,
	type CircuitNode,
	circuitDelay,
} from "./geometry";
import {
	type CircuitBoardSpeed,
	type CircuitBoardTone,
	circuitBoard,
	circuitNode,
} from "./variants";

let {
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
	class: classProp,
}: {
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
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(circuitBoard({ tone, speed }));
const traces = $derived(buildTraces(nodes, connections, nodeSize));
const half = $derived(nodeSize / 2);
</script>

<div data-slot="circuit-board" class={cn(s.root(), classProp)}>
	<svg
		viewBox="0 0 {width} {height}"
		class={s.svg()}
		role={label ? "img" : undefined}
		aria-label={label}
		aria-hidden={label ? undefined : "true"}
	>
		<defs>
			<filter id="{uid}-glow" x="-50%" y="-50%" width="200%" height="200%">
				<feGaussianBlur stdDeviation="2.5" result="blur" />
				<feMerge>
					<feMergeNode in="blur" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
			{#if showGrid}
				<pattern id="{uid}-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
					<circle cx={gridSize / 2} cy={gridSize / 2} r="0.8" class={s.grid()} />
				</pattern>
			{/if}
		</defs>
		{#if showGrid}<rect {width} {height} fill="url(#{uid}-grid)" />{/if}
		{#each traces as t (t.key)}
			<g>
				<path
					d={t.d}
					pathLength="100"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class={s.trace()}
					style:--circuit-board-delay="{circuitDelay.trace(t.index)}s"
				/>
				{#if t.animated !== false}
					<path
						d={t.d}
						pathLength="100"
						stroke-width="3"
						stroke-linecap="round"
						stroke-linejoin="round"
						filter="url(#{uid}-glow)"
						class={s.pulse()}
						style:--circuit-board-delay="{circuitDelay.pulse(t.index)}s"
					/>
					{#if t.bidirectional}
						<path
							d={t.d}
							pathLength="100"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
							filter="url(#{uid}-glow)"
							class={s.pulseBack()}
							style:--circuit-board-delay="calc({circuitDelay.pulse(t.index)}s + var(--circuit-board-speed) / 2)"
						/>
					{/if}
				{/if}
			</g>
		{/each}
		{#each nodes as node, i (node.id)}
			{@const n = circuitNode({ status: node.status })}
			<g
				data-status={node.status ?? "idle"}
				class={n.node()}
				style:--circuit-board-delay="{circuitDelay.node(i)}s"
			>
				<rect
					x={node.x - half}
					y={node.y - half}
					width={nodeSize}
					height={nodeSize}
					rx={nodeSize / 5}
					class={n.box()}
				/>
				{#if node.label}
					<text x={node.x} y={node.y + half + 16} text-anchor="middle" class={n.label()}>
						{node.label}
					</text>
				{/if}
			</g>
		{/each}
	</svg>
</div>
