import { tv, type VariantProps } from "tailwind-variants";

export const ogTestimonial = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[72px] font-sans text-foreground",
		header: "flex items-start justify-between gap-8",
		mark: "font-heading font-normal text-[160px] leading-[0.72] tracking-tight",
		stars: "flex items-center gap-[6px] pt-[8px]",
		star: "h-[22px] w-[22px] shrink-0",
		quote:
			"mt-[40px] line-clamp-4 font-heading font-semibold text-[54px] leading-[1.14] tracking-[-0.025em]",
		footer: "mt-auto flex items-center gap-[20px]",
		avatar: "h-[64px] w-[64px] shrink-0 rounded-full object-cover",
		person: "flex min-w-0 flex-col gap-[8px]",
		name: "line-clamp-1 font-semibold text-[26px] leading-none tracking-tight",
		role: "line-clamp-1 text-[22px] text-muted-foreground leading-none",
		logo: "h-[40px] max-w-[180px] shrink-0 object-contain",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		// Accent colours the quote mark only; the canvas stays plain in every tone.
		tone: {
			neutral: { mark: "text-muted-foreground" },
			chart: { mark: "text-chart-1" },
			primary: { mark: "text-primary" },
		},
		align: {
			left: {
				logo: "ml-auto",
			},
			center: {
				root: "items-center text-center",
				header: "flex-col items-center gap-[16px]",
				stars: "pt-0",
				quote: "max-w-[960px]",
				person: "items-start text-left",
				logo: "ml-[24px]",
			},
		},
		star: {
			full: { star: "text-foreground" },
			half: { star: "text-foreground" },
			empty: { star: "text-foreground/20" },
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", align: "left", star: "full" },
});

export type OgTestimonialMode = NonNullable<VariantProps<typeof ogTestimonial>["mode"]>;
export type OgTestimonialTone = NonNullable<VariantProps<typeof ogTestimonial>["tone"]>;
export type OgTestimonialAlign = NonNullable<VariantProps<typeof ogTestimonial>["align"]>;
export type OgTestimonialStar = NonNullable<VariantProps<typeof ogTestimonial>["star"]>;
