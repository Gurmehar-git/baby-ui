import { tv, type VariantProps } from "tailwind-variants";

const EASE = "duration-500 ease-[var(--ease-ui-out)] motion-reduce:transition-none";

/** The fill is always --primary and the base derives from it, so any primary keeps them distinct.
 * clip-path reveals only the icon tile until hover or focus. */
export const fillButton = tv({
	slots: {
		root: [
			"group/fill relative isolate inline-flex shrink-0 select-none items-center overflow-hidden whitespace-nowrap p-1 font-medium text-foreground",
			"outline-none transition-[scale] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] active:scale-[var(--press-scale)]",
			"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"aria-disabled:pointer-events-none aria-disabled:opacity-50",
		],
		fill: [
			"pointer-events-none absolute inset-1 -z-10 bg-primary [clip-path:inset(0_calc(100%-var(--fill-tile))_0_0_round_var(--fill-radius))]",
			"transition-[clip-path]",
			EASE,
			"group-hover/fill:[clip-path:inset(0_0_0_0_round_var(--fill-radius))] group-focus-visible/fill:[clip-path:inset(0_0_0_0_round_var(--fill-radius))]",
		],
		track: [
			"pointer-events-none absolute inset-1 flex transition-transform",
			EASE,
			"group-hover/fill:translate-x-[calc(100%-var(--fill-tile))] group-focus-visible/fill:translate-x-[calc(100%-var(--fill-tile))]",
		],
		icon: "grid h-full w-(--fill-tile) shrink-0 place-items-center text-primary-foreground",
		label: [
			"pl-[calc(var(--fill-tile)+var(--fill-gap))] transition-[translate,opacity]",
			EASE,
			"group-hover/fill:translate-x-full group-hover/fill:opacity-0 group-focus-visible/fill:translate-x-full group-focus-visible/fill:opacity-0",
		],
		fillLabel: [
			"pointer-events-none absolute inset-y-1 left-1 flex -translate-x-full items-center pl-(--fill-gap) text-primary-foreground opacity-0 transition-[translate,opacity]",
			EASE,
			"group-hover/fill:translate-x-0 group-hover/fill:opacity-100 group-focus-visible/fill:translate-x-0 group-focus-visible/fill:opacity-100",
		],
	},
	variants: {
		tone: {
			soft: { root: "bg-[color-mix(in_oklch,var(--primary)_14%,var(--background))]" },
			outline: { root: "border border-border bg-background" },
		},
		size: {
			sm: {
				root: "h-9 rounded-lg pr-3.5 text-sm [--fill-gap:0.625rem] [--fill-radius:0.375rem] [--fill-tile:1.75rem] [&_svg]:size-3.5",
			},
			default: {
				root: "h-11 rounded-xl pr-4.5 text-sm [--fill-gap:0.875rem] [--fill-radius:0.5rem] [--fill-tile:2.25rem] [&_svg]:size-4",
			},
			lg: {
				root: "h-14 rounded-2xl pr-6 text-base [--fill-gap:1.125rem] [--fill-radius:0.75rem] [--fill-tile:3rem] [&_svg]:size-5",
			},
		},
	},
	defaultVariants: { tone: "soft", size: "default" },
});

export type FillButtonTone = NonNullable<VariantProps<typeof fillButton>["tone"]>;
export type FillButtonSize = NonNullable<VariantProps<typeof fillButton>["size"]>;
