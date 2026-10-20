import { tv, type VariantProps } from "tailwind-variants";

export const animatedBeam = tv({
	slots: {
		root: "relative w-full",
		svg: "pointer-events-none absolute inset-0 size-full overflow-visible",
		track: "fill-none stroke-border [stroke-width:1.5]",
		pulse: "fill-none [stroke-linecap:round] [stroke-width:2] motion-reduce:hidden",
		list: "relative size-full",
		hubItem: "flex flex-col items-center",
		satelliteItem: "flex flex-col items-center",
		node: "relative z-10 grid shrink-0 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-xs",
		center:
			"relative z-10 grid shrink-0 place-items-center rounded-2xl border border-border bg-background text-foreground shadow-sm ring-4 ring-(--beam-a)/10",
		icon: "pointer-events-none size-1/2 object-contain select-none",
		label: "mt-2 whitespace-nowrap text-center text-muted-foreground text-xs",
	},
	variants: {
		layout: {
			hub: {
				root: "aspect-[16/10]",
				hubItem: "absolute top-1/2 left-1/2 -translate-1/2",
				satelliteItem: "absolute -translate-1/2",
			},
			row: {
				list: "grid grid-cols-[auto_1fr_auto] items-center gap-y-4",
				hubItem: "col-start-3",
				satelliteItem: "col-start-1",
			},
		},
		size: {
			sm: { node: "size-10 rounded-xl", center: "size-14 rounded-xl" },
			md: { node: "size-12", center: "size-16" },
			lg: { node: "size-14", center: "size-20" },
		},
		tone: {
			primary: { root: "[--beam-a:var(--primary)] [--beam-b:var(--primary)]" },
			spectrum: { root: "[--beam-a:var(--success)] [--beam-b:var(--violet)]" },
		},
	},
	defaultVariants: { layout: "hub", size: "md", tone: "primary" },
});

export type AnimatedBeamLayout = NonNullable<VariantProps<typeof animatedBeam>["layout"]>;
export type AnimatedBeamSize = NonNullable<VariantProps<typeof animatedBeam>["size"]>;
export type AnimatedBeamTone = NonNullable<VariantProps<typeof animatedBeam>["tone"]>;
