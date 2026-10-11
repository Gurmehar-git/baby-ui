import { tv, type VariantProps } from "tailwind-variants";

// Every dimension is in em so the board scales with the fitted font-size.
// Fit: a row is ~1.3em per column plus 2.4em; sm and md fill 70% and 85% of it.
export const splitFlap = tv({
	slots: {
		root: "@container w-full font-bold font-mono",
		board:
			"mx-auto flex w-fit max-w-full flex-col rounded-[0.6em] px-[0.6em] pt-[0.3em] pb-[0.6em]",
		rowShell:
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-(--duration-dropdown) ease-(--ease-ui-out) data-[open]:grid-rows-[1fr] starting:data-[enter]:grid-rows-[0fr] motion-reduce:transition-none",
		rowClip: "min-h-0 overflow-hidden",
		row: "flex items-stretch gap-[0.3em] pt-[0.3em]",
		cells: "flex",
		cellShell:
			"grid shrink-0 grid-cols-[0fr] transition-[grid-template-columns] duration-(--duration-dropdown) ease-(--ease-ui-out) data-[open]:grid-cols-[1fr] starting:data-[enter]:grid-cols-[0fr] motion-reduce:transition-none",
		cellClip: "min-w-0 overflow-hidden",
		cell: "relative block h-[1.75em] w-[1.3em] select-none px-[0.05em]",
		tile: "relative block size-full rounded-[0.14em] perspective-[8em]",
		top: "absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[0.14em]",
		bottom: "absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rounded-b-[0.14em]",
		glyphTop:
			"absolute inset-x-0 top-0 flex h-[200%] items-center justify-center leading-none",
		glyphBottom:
			"absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center leading-none",
		char: "block tabular-nums [text-box:trim-both_cap_alphabetic]",
		flapTop: "split-flap-top z-10 origin-bottom backface-hidden",
		flapBottom: "split-flap-bottom z-10 origin-top backface-hidden",
		divider:
			"pointer-events-none absolute inset-x-0 top-1/2 z-20 h-[max(1px,0.05em)] -translate-y-1/2",
		indicator: "w-[0.2em] shrink-0 rounded-[0.08em]",
	},
	variants: {
		variant: {
			solid: {
				board: "bg-foreground text-background shadow-xl",
				tile: "shadow-[inset_0_1px_0_color-mix(in_oklab,var(--background)_12%,transparent)]",
				top: "bg-linear-to-b from-[color-mix(in_oklab,var(--foreground)_90%,var(--background))] to-[color-mix(in_oklab,var(--foreground)_86%,var(--background))]",
				bottom:
					"bg-linear-to-b from-[color-mix(in_oklab,var(--foreground)_81%,var(--background))] to-[color-mix(in_oklab,var(--foreground)_77%,var(--background))]",
				divider: "bg-foreground",
			},
			card: {
				board: "border border-border bg-muted text-foreground",
				tile: "shadow-sm ring-1 ring-border",
				top: "bg-linear-to-b from-card to-[color-mix(in_oklab,var(--card)_96%,var(--foreground))]",
				bottom:
					"bg-linear-to-b from-[color-mix(in_oklab,var(--card)_92%,var(--foreground))] to-[color-mix(in_oklab,var(--card)_88%,var(--foreground))]",
				divider: "bg-border",
			},
		},
		size: {
			sm: {
				board:
					"text-[length:min(16px,calc(70cqi/(var(--split-flap-columns)*1.3_+_2.4)))]",
			},
			md: {
				board:
					"text-[length:min(22px,calc(85cqi/(var(--split-flap-columns)*1.3_+_2.4)))]",
			},
			lg: {
				board:
					"text-[length:min(30px,calc(100cqi/(var(--split-flap-columns)*1.3_+_2.4)))]",
			},
		},
		indicator: {
			none: {},
			success: {
				indicator:
					"bg-(--success) shadow-[0_0_0.35em_color-mix(in_oklab,var(--success)_45%,transparent)]",
			},
			primary: {
				indicator:
					"bg-primary shadow-[0_0_0.35em_color-mix(in_oklab,var(--primary)_45%,transparent)]",
			},
			warning: {
				indicator:
					"bg-(--warning) shadow-[0_0_0.35em_color-mix(in_oklab,var(--warning)_45%,transparent)]",
			},
			destructive: {
				indicator:
					"bg-(--destructive) shadow-[0_0_0.35em_color-mix(in_oklab,var(--destructive)_45%,transparent)]",
			},
		},
	},
	defaultVariants: { variant: "solid", size: "md", indicator: "success" },
});

export type SplitFlapVariant = NonNullable<VariantProps<typeof splitFlap>["variant"]>;
export type SplitFlapSize = NonNullable<VariantProps<typeof splitFlap>["size"]>;
export type SplitFlapIndicator = NonNullable<VariantProps<typeof splitFlap>["indicator"]>;
