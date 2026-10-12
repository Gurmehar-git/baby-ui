import { tv, type VariantProps } from "tailwind-variants";

export const orbitCardStack = tv({
	slots: {
		root: "relative flex w-full items-center justify-center overflow-hidden p-6",
		stage: "@container relative w-full max-w-[980px]",
		card: "absolute top-1/2 left-1/2 w-[min(var(--orbit-card-w),78cqw)] origin-bottom cursor-pointer rounded-[1.75rem] border border-border bg-card p-3 text-card-foreground shadow-xl outline-none transition-transform duration-[420ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
		portrait:
			"relative grid aspect-[1.36] w-full place-items-center overflow-hidden rounded-[1.35rem] border border-border bg-muted",
		portraitImage: "size-full object-cover",
		monogram: "font-semibold text-4xl text-muted-foreground tracking-tight",
		initials: "absolute right-3 bottom-3 tracking-widest",
		link: "absolute top-6 right-6 rounded-full shadow-lg",
		body: "px-2 pt-5 pb-2",
		role: "font-semibold text-xs text-muted-foreground uppercase tracking-widest",
		name: "mt-2 font-semibold leading-none tracking-tighter",
		description: "mt-3 font-medium text-muted-foreground leading-[1.42]",
		stat: "mt-4 border-border border-t pt-3 font-bold text-xs text-muted-foreground uppercase tracking-widest",
	},
	variants: {
		size: {
			sm: {
				stage: "h-[26rem] [--orbit-card-w:14rem]",
				name: "text-xl",
				description: "text-xs",
			},
			default: {
				stage: "h-[30rem] [--orbit-card-w:17rem]",
				name: "text-2xl",
				description: "text-sm",
			},
			lg: {
				stage: "h-[34rem] [--orbit-card-w:21rem]",
				name: "text-[2rem]",
				description: "text-base",
			},
		},
		/** Open cards curve like a hand of cards, sit in a near-flat row, or tile into a grid. */
		layout: {
			arc: {},
			row: {},
			grid: {},
		},
	},
	defaultVariants: { size: "default", layout: "arc" },
});

export type OrbitCardStackSize = NonNullable<VariantProps<typeof orbitCardStack>["size"]>;
export type OrbitCardStackLayout = NonNullable<
	VariantProps<typeof orbitCardStack>["layout"]
>;

export interface OrbitStackItem {
	name: string;
	role?: string;
	description?: string;
	image?: string;
	/** Two letters for the badge; derived from `name` when omitted. */
	initials?: string;
	stat?: string;
	/** Renders a real link button on the card when set. */
	href?: string;
}

export interface OrbitCardStackLabels {
	/** Accessible name of the card list. */
	group: string;
	/** Prefix for each card's link, followed by the person's name. */
	link: string;
}

export const DEFAULT_ORBIT_LABELS: OrbitCardStackLabels = {
	group: "Profile cards",
	link: "Open",
};

export function initialsFor(item: OrbitStackItem): string {
	return (
		item.initials ??
		item.name
			.split(/\s+/)
			.map((part) => part.charAt(0))
			.join("")
			.slice(0, 2)
			.toUpperCase()
	);
}

export function clampIndex(index: number, total: number): number {
	return Math.min(Math.max(0, index), Math.max(0, total - 1));
}

/**
 * The card's CSS transform: open cards spread around the centre (the step shrinks to fit the
 * stage via cqw, leaving room for the tilt), closed cards pile up around `active`.
 */
export function orbitTransform(
	index: number,
	total: number,
	active: number,
	open: boolean,
	layout: OrbitCardStackLayout,
	spread: number,
	lift: number,
	fit?: GridFit,
): string {
	if (open && layout === "grid" && fit) {
		const col = index % fit.cols;
		const row = Math.floor(index / fit.cols);
		const scale = fit.scale * (index === active ? 1.04 : 1);
		// Cards scale from origin-bottom, so lift each one back by the height it lost.
		const sink = ((1 - scale) * fit.cardH) / 2;
		const x = (col - (fit.cols - 1) / 2) * fit.cellW;
		const y = (row - (fit.rows - 1) / 2) * fit.cellH - sink;
		return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
	}
	if (open) {
		const orbit = index - (total - 1) / 2;
		const far = Math.abs(orbit);
		const y = layout === "arc" ? far * 30 + Math.max(0, far - 1) * 10 : 0;
		const rotate = orbit * (layout === "arc" ? 8.5 : 2);
		const raise = index === active ? lift : 0;
		const step = `min(${spread}px, (100cqw - 1.7 * min(var(--orbit-card-w), 78cqw)) / ${Math.max(1, total - 1)})`;
		return `translate(calc(-50% + ${orbit} * ${step}), calc(-50% + ${y - raise}px)) rotate(${rotate}deg) scale(0.985)`;
	}
	const stack = index - active;
	return `translate(calc(-50% + ${stack * 10}px), calc(-50% + ${Math.abs(stack) * 5}px)) rotate(${stack * 2.8}deg) scale(0.97)`;
}

/** The roving index after `key`, or undefined when the key does not move focus. */
export function nextIndex(key: string, index: number, total: number): number | undefined {
	if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % total;
	if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + total) % total;
	if (key === "Home") return 0;
	if (key === "End") return total - 1;
	return undefined;
}

export type GridFit = {
	cols: number;
	rows: number;
	scale: number;
	cellW: number;
	cellH: number;
	cardH: number;
};

/** The column count that lets the open grid's cards scale largest inside the stage. */
export function gridFit(
	stageW: number,
	stageH: number,
	cardW: number,
	cardH: number,
	total: number,
	gap = 12,
): GridFit {
	let best: GridFit = { cols: 1, rows: total, scale: 0, cellW: 0, cellH: 0, cardH };
	for (let cols = 1; cols <= Math.max(1, total); cols++) {
		const rows = Math.ceil(total / cols);
		const scale = Math.min(
			1,
			(stageW - gap * (cols - 1)) / (cols * cardW),
			(stageH - gap * (rows - 1)) / (rows * cardH),
		);
		if (scale > best.scale)
			best = {
				cols,
				rows,
				scale,
				cellW: cardW * scale + gap,
				cellH: cardH * scale + gap,
				cardH,
			};
	}
	return best;
}
