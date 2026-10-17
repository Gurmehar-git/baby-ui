import type { HoverTransitionDirection, HoverTransitionEffect } from "./variants";

export type HoverVars = Record<`--ht-${string}`, string>;

export type HoverLayer = {
	content: "default" | "hover";
	vars: HoverVars;
	/** Parallax only: a second transform on a wrapper inside the clipped layer. */
	inner?: HoverVars;
};

const VECTORS: Record<HoverTransitionDirection, [number, number]> = {
	top: [0, -1],
	right: [1, 0],
	bottom: [0, 1],
	left: [-1, 0],
	"top-left": [-1, -1],
	"top-right": [1, -1],
	"bottom-right": [1, 1],
	"bottom-left": [-1, 1],
	center: [0, 0],
};

const HIDDEN: Record<HoverTransitionDirection, string> = {
	top: "inset(0 0 100% 0)",
	right: "inset(0 0 0 100%)",
	bottom: "inset(100% 0 0 0)",
	left: "inset(0 100% 0 0)",
	"top-left": "inset(0 100% 100% 0)",
	"top-right": "inset(0 0 100% 100%)",
	"bottom-right": "inset(100% 0 0 100%)",
	"bottom-left": "inset(100% 100% 0 0)",
	center: "inset(50%)",
};

function vars(partial: {
	clip?: string;
	transform?: string;
	filter?: string;
	opacity?: number;
	radius?: string;
	origin?: string;
	delay?: string;
	scale?: number;
}): HoverVars {
	return {
		"--ht-clip": partial.clip ?? "none",
		"--ht-transform": partial.transform ?? "none",
		"--ht-filter": partial.filter ?? "none",
		"--ht-opacity": String(partial.opacity ?? 1),
		"--ht-radius": partial.radius ?? "0",
		"--ht-origin": partial.origin ?? "50% 50%",
		"--ht-delay": partial.delay ?? "0ms",
		"--ht-dur-scale": String(partial.scale ?? 1),
	};
}

const pct = (n: number) => `${Math.round(n * 100) / 100}%`;

/** Effects where the resting content moves too, so it is drawn by its own layers. */
export function movesDefault(effect: HoverTransitionEffect): boolean {
	return (
		effect === "parallax" ||
		effect === "curtain" ||
		effect === "diagonal" ||
		effect === "slide"
	);
}

/** The resting content, which dims and grows slightly while the hover content is shown. */
export function baseVars(effect: HoverTransitionEffect, active: boolean): HoverVars {
	return vars({
		opacity: movesDefault(effect) ? 0 : 1,
		filter: active ? "brightness(.86) saturate(.88)" : "none",
		transform: active ? "scale(1.025)" : "scale(1)",
	});
}

/** Layers stacked over the resting content, in paint order. */
export function hoverLayers(
	effect: HoverTransitionEffect,
	direction: HoverTransitionDirection,
	active: boolean,
): HoverLayer[] {
	const [vx, vy] = VECTORS[direction];
	const dx = vx * 100;
	const dy = vy * 100;
	const at = "var(--ht-at)";
	const blur = (px: number) => (active ? "blur(0px)" : `blur(${px}px)`);

	switch (effect) {
		case "ripple":
			return [
				{
					content: "hover",
					vars: vars({
						clip: `circle(${active ? 150 : 0}% at ${at})`,
						filter: blur(2),
						transform: active ? "scale(1)" : "scale(1.035)",
						origin: at,
					}),
				},
			];
		case "parallax":
			return [
				{
					content: "default",
					vars: vars({
						transform: active
							? `translate3d(${pct(-dx * 0.12)}, ${pct(-dy * 0.12)}, 0) scale(1.045)`
							: "translate3d(0, 0, 0) scale(1)",
						filter: active ? "brightness(.78) saturate(.75)" : "none",
					}),
				},
				{
					content: "hover",
					vars: vars({ clip: active ? "inset(0)" : HIDDEN[direction], filter: blur(2) }),
					inner: vars({
						transform: active
							? "translate3d(0, 0, 0) scale(1)"
							: `translate3d(${pct(dx * 0.24)}, ${pct(dy * 0.24)}, 0) scale(1.07)`,
					}),
				},
			];
		case "curtain": {
			// Both leaves retract away from the named side, the nearer one first.
			const leaf = (clip: string, x: number, y: number, lead = true) => ({
				content: "default" as const,
				vars: vars({
					clip,
					transform: active ? `translate3d(${x}%, ${y}%, 0)` : "translate3d(0, 0, 0)",
					filter: active ? "blur(1px)" : "blur(0px)",
					delay: lead !== active ? "calc(var(--ht-duration) * 0.12)" : "0ms",
				}),
			});
			const leaves =
				direction === "center"
					? [
							leaf("inset(0 50% 50% 0)", -100, -100),
							leaf("inset(0 0 50% 50%)", 100, -100),
							leaf("inset(50% 0 0 50%)", 100, 100),
							leaf("inset(50% 50% 0 0)", -100, 100),
						]
					: vx === 0
						? [leaf("inset(0 50% 0 0)", 0, -dy), leaf("inset(0 0 0 50%)", 0, -dy, false)]
						: [
								leaf("inset(0 0 50% 0)", -dx, -dy, vy <= 0),
								leaf("inset(50% 0 0 0)", -dx, -dy, vy > 0),
							];
			return [
				{
					content: "hover",
					vars: vars({
						opacity: active ? 1 : 0,
						filter: blur(3),
						transform: active ? "scale(1)" : "scale(.96)",
					}),
				},
				...leaves,
			];
		}
		case "diagonal": {
			const UR = "polygon(0 0, 100% 0, 100% 100%)";
			const LL = "polygon(0 0, 100% 100%, 0 100%)";
			const UL = "polygon(0 0, 100% 0, 0 100%)";
			const LR = "polygon(100% 0, 100% 100%, 0 100%)";
			const shard = (clip: string, move: string, origin = "50% 50%", lead = true) => ({
				content: "default" as const,
				vars: vars({
					clip,
					transform: active ? move : "translate3d(0, 0, 0) rotate(0deg)",
					filter: active ? "blur(1px)" : "blur(0px)",
					origin,
					delay: lead !== active ? "calc(var(--ht-duration) * 0.15)" : "0ms",
				}),
			});
			const go = (x: number, y: number) => `translate3d(${x}%, ${y}%, 0) rotate(0deg)`;
			const spin = (deg: number) => `translate3d(0, 0, 0) rotate(${deg}deg)`;
			const mid = "50% 50%";
			// Corners swing open on a hinge at the opposite corner; edges slide out, named edge first.
			const SHARDS: Record<HoverTransitionDirection, HoverLayer[]> = {
				"top-left": [shard(UR, spin(90), "100% 100%"), shard(LL, spin(-90), "100% 100%")],
				"bottom-right": [shard(UR, spin(-90), "0% 0%"), shard(LL, spin(90), "0% 0%")],
				"top-right": [shard(UL, spin(-90), "0% 100%"), shard(LR, spin(90), "0% 100%")],
				"bottom-left": [shard(UL, spin(90), "100% 0%"), shard(LR, spin(-90), "100% 0%")],
				right: [shard(UR, go(100, 0)), shard(LL, go(0, 100), mid, false)],
				left: [shard(LL, go(-100, 0)), shard(UR, go(0, -100), mid, false)],
				top: [shard(UL, go(0, -100)), shard(LR, go(100, 0), mid, false)],
				bottom: [shard(LR, go(0, 100)), shard(UL, go(-100, 0), mid, false)],
				center: [
					shard("polygon(0 0, 100% 0, 50% 50%)", go(0, -100)),
					shard("polygon(100% 0, 100% 100%, 50% 50%)", go(100, 0)),
					shard("polygon(100% 100%, 0 100%, 50% 50%)", go(0, 100)),
					shard("polygon(0 100%, 0 0, 50% 50%)", go(-100, 0)),
				],
			};
			return [
				{
					content: "hover",
					vars: vars({
						opacity: active ? 1 : 0,
						filter: blur(2),
						transform: active ? "scale(1)" : "scale(.97)",
					}),
				},
				...SHARDS[direction],
			];
		}
		case "morph":
			return [
				{
					content: "hover",
					vars: vars({
						radius: active ? "0%" : "42%",
						clip: active ? "inset(0% round 0%)" : "inset(43% round 42%)",
						filter: blur(3),
						opacity: active ? 1 : 0,
						transform: active
							? "translate3d(0, 0, 0) scale(1) rotate(0deg)"
							: `translate3d(${pct(dx * 0.04)}, ${pct(dy * 0.04)}, 0) scale(.86) rotate(${vx < 0 ? -2 : 2}deg)`,
						origin: at,
					}),
				},
			];
		case "strips": {
			const count = 8;
			const center = direction === "center";
			const vertical = Math.abs(vx) >= Math.abs(vy);
			// Unclipped copy under the strips, shown once they land: the one interactive hover view.
			const underlay: HoverLayer = {
				content: "hover",
				vars: vars({
					opacity: active ? 1 : 0,
					delay: active ? "var(--ht-duration)" : "0ms",
					scale: 0.01,
				}),
			};
			const strips = Array.from({ length: count }, (_, i): HoverLayer => {
				const start = pct((i / count) * 100);
				const end = pct(100 - ((i + 1) / count) * 100);
				// Center: strips alternate up and down, landing from the middle outward.
				const rank = center ? (Math.abs(i - (count - 1) / 2) - 0.5) / 3 : i / (count - 1);
				const order = active ? rank : 1 - rank;
				const ox = center ? 0 : vx * 72;
				const oy = center ? (i % 2 ? 72 : -72) : vy * 72;
				return {
					content: "hover",
					vars: vars({
						clip: vertical ? `inset(0 ${end} 0 ${start})` : `inset(${start} 0 ${end} 0)`,
						filter: blur(1.5),
						opacity: active ? 1 : 0,
						transform: active ? "translate3d(0, 0, 0)" : `translate3d(${ox}%, ${oy}%, 0)`,
						delay: `calc(var(--ht-duration) * ${(order * 0.15).toFixed(4)})`,
						scale: 0.85,
					}),
				};
			});
			return [underlay, ...strips];
		}
		case "slide":
			return [
				{
					content: "default",
					vars: vars({
						transform: active
							? direction === "center"
								? "scale(1.035)"
								: `translate3d(${pct(-dx * 0.16)}, ${pct(-dy * 0.16)}, 0) scale(1.025)`
							: "translate3d(0, 0, 0)",
						filter: active ? "brightness(.72) blur(2px)" : "none",
						opacity: active ? 0 : 1,
					}),
				},
				{
					content: "hover",
					vars: vars({
						opacity: active ? 1 : 0,
						filter: blur(3),
						transform: active
							? "translate3d(0, 0, 0)"
							: direction === "center"
								? "scale(.96)"
								: `translate3d(${pct(dx * 0.16)}, ${pct(dy * 0.16)}, 0) scale(.985)`,
					}),
				},
			];
		default:
			return [
				{
					content: "hover",
					vars: vars({
						clip: active ? "inset(0)" : HIDDEN[direction],
						filter: blur(1.5),
						transform: active ? "scale(1)" : "scale(1.025)",
						origin: at,
					}),
				},
			];
	}
}

/** Custom properties as an inline style string, for Svelte. */
export function styleString(style: Record<string, string>): string {
	return Object.entries(style)
		.map(([key, value]) => `${key}: ${value};`)
		.join(" ");
}
