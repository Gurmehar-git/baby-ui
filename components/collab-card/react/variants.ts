import { tv, type VariantProps } from "tailwind-variants";

export const collabCard = tv({
	slots: {
		root: "group/collab @container relative isolate aspect-3/2 w-full overflow-hidden rounded-2xl shadow-xl ring-1",
		backdrop: "absolute inset-0 -z-10",
		glow: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_18%_88%,color-mix(in_oklch,var(--chart-4)_42%,transparent)_0%,transparent_70%),radial-gradient(ellipse_60%_50%_at_88%_22%,color-mix(in_oklch,var(--chart-2)_32%,transparent)_0%,transparent_68%)]",
		dots: "pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(currentColor_1px,transparent_1.2px)] opacity-[0.08] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_88%)]",
		status:
			"flex min-w-0 items-center gap-[1.4cqi] font-medium text-[2.4cqi] leading-none tracking-tight",
		livePing: "collab-live-ping absolute inset-0 rounded-full bg-success/70",
		liveDot:
			"relative inline-block h-full w-full rounded-full bg-success shadow-[0_0_6px_color-mix(in_oklch,var(--success)_75%,transparent)]",
		swatch: "block size-full rounded-full shadow-sm ring-2",
		extra:
			"flex size-full items-center justify-center rounded-full font-(family-name:--font-mono) font-medium text-[1.65cqi] leading-none tabular-nums tracking-tight ring-2",
		eyebrow:
			"max-w-[88%] text-center font-medium text-[2.75cqi] text-primary leading-snug tracking-tight",
		frame:
			"relative grid place-items-center rounded-[1.8cqi] border-2 border-primary/75 border-dashed px-[5.5cqi] py-[4.2cqi]",
		handle:
			"absolute h-[1.7cqi] w-[1.7cqi] rounded-[0.25cqi] shadow-sm ring-[1.5px] ring-primary",
		line: "flex max-w-full flex-wrap items-baseline justify-center gap-x-[1.5cqi] gap-y-[1.2cqi] font-medium text-[3.85cqi] leading-none tracking-tight",
		muted: "",
		faint: "",
		cursor:
			"h-[6.5cqi] w-[6.5cqi] drop-shadow-md [stroke-width:1.4] [stroke-linejoin:round]",
		pill: "inline-flex items-center rounded-full px-[2.8cqi] py-[0.55cqi] font-semibold text-[3.5cqi] text-primary-foreground leading-none",
	},
	variants: {
		/** Inverted is the design-tool canvas: dark on a light page, light on a dark one. */
		tone: {
			inverted: {
				root: "bg-foreground text-background ring-background/10",
				backdrop:
					"bg-[linear-gradient(165deg,color-mix(in_oklch,var(--foreground)_88%,var(--background))_0%,var(--foreground)_60%)]",
				status: "text-background/75",
				swatch: "ring-foreground",
				extra: "bg-background/15 text-background/90 ring-foreground",
				handle: "bg-foreground",
				muted: "text-background/80",
				faint: "text-background/55",
				cursor: "stroke-background",
			},
			surface: {
				root: "bg-background text-foreground ring-border",
				backdrop: "bg-[linear-gradient(165deg,var(--card)_0%,var(--background)_100%)]",
				status: "text-muted-foreground",
				swatch: "ring-card",
				extra: "bg-muted text-foreground/90 ring-card",
				handle: "bg-card",
				muted: "text-foreground/80",
				faint: "text-muted-foreground",
				cursor: "stroke-card",
			},
		},
	},
	defaultVariants: { tone: "inverted" },
});

export type CollabCardTone = NonNullable<VariantProps<typeof collabCard>["tone"]>;
