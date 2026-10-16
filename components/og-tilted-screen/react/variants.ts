import { tv, type VariantProps } from "tailwind-variants";

export const ogTiltedScreen = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[80px] font-sans text-foreground",
		glow: "absolute top-[160px] left-[620px] h-[420px] w-[620px] rounded-full opacity-45 blur-[120px]",
		// One explicit transform: takumi has no 3D and rejects calc() angles from `-rotate-*`.
		screen:
			"absolute top-[150px] left-[600px] h-[560px] w-[900px] rounded-[24px] border border-border object-cover object-left-top shadow-[0_40px_80px_-24px_rgb(0_0_0/0.6)] [transform:rotate(-7deg)_skewX(9deg)]",
		brand: "relative flex items-center gap-4",
		logo: "h-12 w-12 shrink-0 rounded-xl object-cover",
		site: "line-clamp-1 max-w-[480px] font-semibold text-[32px] tracking-tight",
		title:
			"relative mt-[96px] line-clamp-3 max-w-[540px] font-heading font-semibold text-[64px] leading-[1.04] tracking-[-0.04em]",
		description:
			"relative mt-6 line-clamp-2 max-w-[480px] text-[24px] text-muted-foreground leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			neutral: { glow: "bg-foreground/40" },
			chart: { glow: "bg-chart-2" },
			primary: { glow: "bg-primary" },
		},
	},
	defaultVariants: { mode: "dark", tone: "primary" },
});

export type OgTiltedScreenMode = NonNullable<VariantProps<typeof ogTiltedScreen>["mode"]>;
export type OgTiltedScreenTone = NonNullable<VariantProps<typeof ogTiltedScreen>["tone"]>;
