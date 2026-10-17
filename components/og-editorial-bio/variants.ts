import { tv, type VariantProps } from "tailwind-variants";

export const ogEditorialBio = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
		circle: "absolute top-[2px] left-[572px] h-[628px] w-[628px] rounded-full",
		crossX: "absolute top-[315px] left-[588px] h-px w-6 bg-foreground/60",
		crossY: "absolute top-[303px] left-[600px] h-6 w-px bg-foreground/60",
		lines: "absolute top-[52px] left-[68px] flex max-w-[1060px] flex-col overflow-hidden",
		line: "line-clamp-1 text-[66px] leading-[1.37] tracking-[-0.025em]",
		indent: "pl-[94px]",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			neutral: { circle: "bg-foreground/[0.08]" },
			chart: { circle: "bg-chart-4" },
			primary: { circle: "bg-primary" },
		},
	},
	defaultVariants: { mode: "light", tone: "chart" },
});

export type OgEditorialBioMode = NonNullable<VariantProps<typeof ogEditorialBio>["mode"]>;
export type OgEditorialBioTone = NonNullable<VariantProps<typeof ogEditorialBio>["tone"]>;
