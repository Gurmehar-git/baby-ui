import {
	type Channels,
	flatten,
	type MorphNode,
	mix,
	paint,
	type SpringName,
} from "./icons";

/** A time-defined spring (visual duration, bounce) written as stiffness and damping. */
const physical = (duration: number, bounce: number) => {
	const root = (2 * Math.PI) / (duration * 1.2);
	return { stiffness: root * root, damping: 2 * (1 - bounce) * root };
};
const SPRINGS: Record<SpringName, { stiffness: number; damping: number }> = {
	morph: physical(0.4, 0.2),
	smooth: physical(0.35, 0),
	snappy: physical(0.25, 0.1),
};
const easeOut = (t: number) => 1 - (1 - t) ** 3;

type Live = {
	node: MorphNode;
	el: SVGElement;
	p: number;
	v: number;
	startAt: number;
	kick: number;
	kickV: number;
	kickAt: number;
	burstAt: number;
};

/**
 * Springs every node of a morphing icon between its off and on looks. Each node has one
 * interruptible progress spring, so a quick toggle reverses from wherever it is.
 */
export function createIconMorph(
	svg: SVGSVGElement,
	nodes: MorphNode[],
	initial: boolean,
) {
	let on = initial;
	let frame = 0;
	let then = 0;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	const live: Live[] = [];

	const bind = (tree: MorphNode[]) => {
		live.length = 0;
		for (const node of flatten(tree)) {
			const el = svg.querySelector<SVGElement>(`[data-m="${node.i}"]`);
			if (el)
				live.push({
					node,
					el,
					p: on ? 1 : 0,
					v: 0,
					startAt: 0,
					kick: 0,
					kickV: 0,
					kickAt: 0,
					burstAt: -1,
				});
		}
	};

	const draw = (item: Live, now: number) => {
		const { node } = item;
		let values: Channels;
		if (node.burst && item.burstAt >= 0) {
			const t = Math.min(1, Math.max(0, (now - item.burstAt) / node.burst.duration));
			values = mix(node.burst.from, node.burst.to, easeOut(t));
		} else {
			values = mix(
				node.off ?? {},
				node.on ?? {},
				item.p,
				node.pop && { channel: node.pop.channel, value: item.kick },
			);
		}
		const { attrs, style } = paint(node, values);
		for (const [key, value] of Object.entries(attrs)) item.el.setAttribute(key, value);
		for (const [key, value] of Object.entries(style))
			item.el.style.setProperty(key, value);
	};

	const tick = (now: number) => {
		const dt = Math.min(1 / 30, (now - then) / 1000);
		then = now;
		let moving = false;
		const target = on ? 1 : 0;
		for (const item of live) {
			const { node } = item;
			if (now >= item.startAt) {
				const spring = SPRINGS[node.spring ?? "morph"];
				item.v += (-spring.stiffness * (item.p - target) - spring.damping * item.v) * dt;
				item.p += item.v * dt;
				if (Math.abs(item.p - target) < 0.0005 && Math.abs(item.v) < 0.005) {
					item.p = target;
					item.v = 0;
				} else moving = true;
			} else moving = true;
			if (node.pop && now >= item.kickAt && (item.kick !== 0 || item.kickV !== 0)) {
				const { stiffness, damping } = node.pop.spring;
				item.kickV += (-stiffness * item.kick - damping * item.kickV) * dt;
				item.kick += item.kickV * dt;
				if (Math.abs(item.kick) < 0.0005 && Math.abs(item.kickV) < 0.005) {
					item.kick = 0;
					item.kickV = 0;
				} else moving = true;
			} else if (node.pop && now < item.kickAt) moving = true;
			if (node.burst && item.burstAt >= 0) {
				if (now - item.burstAt < node.burst.duration) moving = true;
				else item.burstAt = -1;
			}
			draw(item, now);
		}
		frame = moving ? requestAnimationFrame(tick) : 0;
	};

	const start = () => {
		if (frame) return;
		then = performance.now();
		frame = requestAnimationFrame(tick);
	};

	bind(nodes);

	return {
		set(next: boolean) {
			if (next === on) return;
			on = next;
			const now = performance.now();
			if (reduced.matches) {
				for (const item of live) {
					item.p = on ? 1 : 0;
					item.v = 0;
					item.kick = 0;
					item.kickV = 0;
					item.burstAt = -1;
					draw(item, now);
				}
				return;
			}
			for (const item of live) {
				const { node } = item;
				item.startAt = on && node.delay ? now + node.delay : 0;
				if (!on) continue;
				if (node.pop) {
					item.kick = node.pop.offset ?? 0;
					item.kickV = node.pop.velocity ?? 0;
					item.kickAt = now + (node.pop.delay ?? 0);
				}
				if (node.burst) item.burstAt = now + (node.burst.delay ?? 0);
			}
			start();
		},
		destroy() {
			cancelAnimationFrame(frame);
		},
	};
}
