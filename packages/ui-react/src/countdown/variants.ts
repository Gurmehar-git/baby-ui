import { tv, type VariantProps } from "tailwind-variants";

// Both faces share one grid cell, so the frame holds the wider of them and never jumps on completion.
const FACE =
	"col-start-1 row-start-1 inline-flex items-center justify-center whitespace-nowrap transition-[opacity,scale,filter] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[on=false]:pointer-events-none data-[on=false]:scale-92 data-[on=false]:opacity-0 data-[on=false]:blur-[3px] motion-reduce:transition-none";

export const countdown = tv({
	slots: {
		root: "group/countdown relative min-w-0 text-foreground",
		shell: "inline-grid",
		units: [FACE, "items-start"],
		unit: "inline-flex items-start",
		group: "inline-grid justify-items-center gap-1.5",
		number:
			"inline-flex tabular-nums transition-opacity duration-(--duration-slow) group-data-[pending]/countdown:opacity-30",
		name: "text-muted-foreground text-xs leading-none",
		colon: "text-muted-foreground/60",
		done: [FACE, "gap-[0.4em]"],
		pulse:
			"relative grid size-[0.3em] min-h-2 min-w-2 flex-none rounded-full bg-success *:col-start-1 *:row-start-1",
		ping: "size-full rounded-full bg-success motion-safe:animate-ping",
	},
	variants: {
		variant: {
			default: {
				root: "@container flex w-full justify-center",
				units:
					"font-medium text-[clamp(1.75rem,12.5cqi,3rem)] leading-none tracking-tight",
				group: "min-w-[min(calc((100cqi-1.6em)/4),5rem)]",
				name: "tracking-normal",
				colon: "-translate-y-[0.06em] px-[0.12em] leading-none",
				done: "font-medium text-[clamp(1.75rem,11cqi,2.25rem)] leading-tight tracking-tight",
			},
			compact: {
				root: "inline-flex align-middle",
				shell: [
					"min-h-8 items-center rounded-full border bg-background px-3",
					"transition-[border-color,background-color] duration-(--duration-base) group-data-[complete]/countdown:border-success/35 group-data-[complete]/countdown:bg-success/9",
				],
				units: "gap-1.5 font-medium text-sm leading-[1.3]",
				group: "inline-flex items-baseline gap-px",
				name: "font-normal text-sm leading-[1.3]",
				done: "font-medium text-sm text-success-strong leading-[1.3]",
			},
			// Runs inside a sentence: inherits the text size and sits on its baseline.
			inline: {
				root: "inline-flex align-baseline",
				units: "items-baseline gap-1 font-medium",
				unit: "items-baseline",
				group: "inline-flex items-baseline gap-px",
				name: "font-normal text-[length:inherit] text-current/65 leading-[inherit]",
				done: "font-medium text-success-strong",
			},
		},
	},
	defaultVariants: { variant: "default" },
});

export type CountdownVariant = NonNullable<VariantProps<typeof countdown>["variant"]>;
