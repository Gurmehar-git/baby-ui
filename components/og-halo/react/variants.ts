import { tv, type VariantProps } from "tailwind-variants";

export const ogHalo = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] items-center justify-center overflow-hidden bg-background font-sans text-foreground",
		halo: "absolute top-[95px] left-[380px] h-[440px] w-[440px] rounded-full opacity-70 blur-[70px]",
		logo: "relative h-[240px] w-[240px] object-contain",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		// The light behind the mark; the mark itself stays the colour of its own file.
		tone: {
			neutral: { halo: "bg-foreground" },
			primary: { halo: "bg-primary" },
			chart: { halo: "bg-chart-3" },
		},
	},
	defaultVariants: { mode: "dark", tone: "neutral" },
});

export type OgHaloMode = NonNullable<VariantProps<typeof ogHalo>["mode"]>;
export type OgHaloTone = NonNullable<VariantProps<typeof ogHalo>["tone"]>;
