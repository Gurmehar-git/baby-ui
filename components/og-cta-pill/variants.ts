import { tv, type VariantProps } from "tailwind-variants";

export const ogCtaPill = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col items-center overflow-hidden pt-[86px] font-sans text-foreground",
		// A fine dot screen over the field, the printed grain of the reference.
		texture:
			"absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.16)_1px,transparent_1.4px)] bg-[size:7px_7px]",
		glow: "absolute bottom-[-260px] left-[330px] h-[560px] w-[540px] rounded-full opacity-95 blur-[80px]",
		logo: "relative h-[84px] w-[150px] object-contain",
		pill: "relative mt-[72px] flex h-[228px] w-[740px] items-center justify-center rounded-full shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]",
		label:
			"line-clamp-1 max-w-[640px] font-heading font-bold text-[108px] leading-none tracking-[-0.045em]",
	},
	variants: {
		mode: {
			light: { pill: "bg-[color-mix(in_oklab,white_92%,var(--chart-2))]" },
			dark: { root: "dark", pill: "bg-[color-mix(in_oklab,black_80%,var(--chart-2))]" },
		},
		// The field colour; the label ink and glow are mixed from the same hue.
		tone: {
			chart: {
				root: "bg-chart-2",
				glow: "bg-[color-mix(in_oklab,var(--chart-4)_30%,white)]",
				label: "text-[color-mix(in_oklab,var(--chart-2)_28%,black)]",
			},
			primary: {
				root: "bg-primary",
				glow: "bg-[color-mix(in_oklab,var(--primary)_25%,white)]",
				label: "text-[color-mix(in_oklab,var(--primary)_30%,black)]",
			},
			success: {
				root: "bg-success",
				glow: "bg-[color-mix(in_oklab,var(--success)_25%,white)]",
				label: "text-[color-mix(in_oklab,var(--success)_30%,black)]",
			},
		},
	},
	compoundVariants: [{ mode: "dark", class: { label: "text-white" } }],
	defaultVariants: { mode: "light", tone: "chart" },
});

export type OgCtaPillMode = NonNullable<VariantProps<typeof ogCtaPill>["mode"]>;
export type OgCtaPillTone = NonNullable<VariantProps<typeof ogCtaPill>["tone"]>;
