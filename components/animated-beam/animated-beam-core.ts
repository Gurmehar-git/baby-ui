export type BeamPoint = { x: number; y: number };

export type BeamLink = {
	from: string;
	to: string;
	/** Milliseconds before this beam's first pulse. */
	delay?: number;
	/** Milliseconds for one pulse to travel the beam. */
	duration?: number;
	/** Pulse travels from `to` back to `from`. */
	reverse?: boolean;
};

export type BeamGeometry = {
	key: string;
	d: string;
	start: BeamPoint;
	end: BeamPoint;
	delay: number;
	duration: number;
};

export const BEAM_DURATION = 3200;
/** Share of the path one pulse covers. */
export const PULSE_SHARE = 0.22;

/** Satellite positions around a hub, in percent of the container, starting at 12 o'clock. */
export function hubPositions(count: number, radiusX = 38, radiusY = 36): BeamPoint[] {
	return Array.from({ length: count }, (_, i) => {
		const angle = -Math.PI / 2 + (i / Math.max(1, count)) * Math.PI * 2;
		return { x: 50 + Math.cos(angle) * radiusX, y: 50 + Math.sin(angle) * radiusY };
	});
}

/** Quadratic curve bowed sideways by `curvature` px; positive bows to the left of travel. */
export function beamPath(a: BeamPoint, b: BeamPoint, curvature: number): string {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const length = Math.hypot(dx, dy) || 1;
	const cx = (a.x + b.x) / 2 + (-dy / length) * curvature;
	const cy = (a.y + b.y) / 2 + (dx / length) * curvature;
	const r = (n: number) => Math.round(n * 10) / 10;
	return `M ${r(a.x)} ${r(a.y)} Q ${r(cx)} ${r(cy)} ${r(b.x)} ${r(b.y)}`;
}

/** Beams between measured node centres; links naming a missing node are skipped. */
export function beamGeometry(
	links: BeamLink[],
	centres: Map<string, BeamPoint>,
	curvature: number,
): BeamGeometry[] {
	return links.flatMap((link, index) => {
		const from = centres.get(link.from);
		const to = centres.get(link.to);
		if (!from || !to) return [];
		const [start, end] = link.reverse ? [to, from] : [from, to];
		return [
			{
				key: `${link.from}->${link.to}:${index}`,
				d: beamPath(start, end, link.reverse ? -curvature : curvature),
				start,
				end,
				delay: link.delay ?? 0,
				duration: link.duration ?? BEAM_DURATION,
			},
		];
	});
}

/** Dash keyframes that carry one pulse from the path start to past its end. */
export function pulseKeyframes(length: number): Keyframe[] {
	const pulse = length * PULSE_SHARE;
	return [{ strokeDashoffset: `${pulse}` }, { strokeDashoffset: `${-length}` }];
}

/** Dash pattern for a pulse on a path of `length`: one streak, then a gap longer than the path. */
export function pulseDasharray(length: number): string {
	const pulse = length * PULSE_SHARE;
	return `${pulse} ${length + pulse}`;
}
