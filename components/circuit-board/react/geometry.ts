import type { CircuitNodeStatus } from "./variants";

export type CircuitNode = {
	id: string;
	/** Centre in board units (see `width`/`height`). */
	x: number;
	y: number;
	label?: string;
	status?: CircuitNodeStatus;
};

export type CircuitConnection = {
	from: string;
	to: string;
	/** A second pulse runs back from `to` to `from`. */
	bidirectional?: boolean;
	/** Set false for a static trace with no pulse. */
	animated?: boolean;
};

export type CircuitTrace = CircuitConnection & { key: string; d: string; index: number };

/** Right-angled route between two node edges: along the longer axis first, jog at the midpoint. */
export function tracePath(from: CircuitNode, to: CircuitNode, half: number): string {
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	if (Math.abs(dx) > Math.abs(dy)) {
		const sx = from.x + Math.sign(dx) * half;
		const ex = to.x - Math.sign(dx) * half;
		return `M ${sx} ${from.y} H ${from.x + dx / 2} V ${to.y} H ${ex}`;
	}
	const sy = from.y + Math.sign(dy) * half;
	const ey = to.y - Math.sign(dy) * half;
	return `M ${from.x} ${sy} V ${from.y + dy / 2} H ${to.x} V ${ey}`;
}

/** Connections whose endpoints exist, with their paths; unknown ids are skipped. */
export function buildTraces(
	nodes: CircuitNode[],
	connections: CircuitConnection[],
	nodeSize: number,
): CircuitTrace[] {
	const byId = new Map(nodes.map((n) => [n.id, n]));
	const half = nodeSize / 2 + 4;
	const out: CircuitTrace[] = [];
	connections.forEach((c, i) => {
		const a = byId.get(c.from);
		const b = byId.get(c.to);
		if (!a || !b) return;
		out.push({
			...c,
			key: `${c.from}-${c.to}-${i}`,
			d: tracePath(a, b, half),
			index: out.length,
		});
	});
	return out;
}

/** Stagger delays in seconds, so traces draw in, then nodes pop, then pulses start. */
export const circuitDelay = {
	trace: (i: number) => i * 0.15,
	node: (i: number) => 0.3 + i * 0.08,
	pulse: (i: number) => 1 + i * 0.3,
};
