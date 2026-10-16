import { tv, type VariantProps } from "tailwind-variants";

export const ogBigIcon = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-[color-mix(in_oklab,var(--primary)_3%,var(--background))] p-[64px] font-sans text-foreground",
		pattern:
			"absolute inset-0 flex flex-wrap content-start gap-x-[60px] gap-y-[56px] p-[24px] opacity-[0.06]",
		patternIcon: "h-[40px] w-[40px] object-contain",
		icon: "absolute top-[56px] right-[-120px] h-[560px] w-[560px] object-contain",
		brand: "relative flex items-center gap-4",
		logo: "h-[68px] w-[68px] shrink-0 rounded-[18px] object-contain",
		names: "flex flex-col",
		name: "line-clamp-1 font-semibold text-[48px] leading-none tracking-[-0.03em]",
		label: "self-end text-[18px] text-muted-foreground uppercase tracking-[0.12em]",
		body: "relative flex max-w-[620px] flex-col gap-5",
		title:
			"line-clamp-2 font-heading font-bold text-[50px] leading-[1.15] tracking-[-0.02em]",
		description: "line-clamp-3 text-[28px] text-muted-foreground leading-[1.45]",
	},
	variants: {
		mode: {
			light: {},
			// Icon sets ship dark monochrome glyphs, so the dark card flips them light; the logo keeps its colours.
			dark: { root: "dark", icon: "invert", patternIcon: "invert" },
		},
	},
	defaultVariants: { mode: "light" },
});

export type OgBigIconMode = NonNullable<VariantProps<typeof ogBigIcon>["mode"]>;
