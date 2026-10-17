import { tv, type VariantProps } from "tailwind-variants";

export const ogNewsletterIssue = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[72px] font-sans text-foreground",
		masthead: "flex items-center justify-between gap-10 border-border border-b pb-[24px]",
		brand: "flex min-w-0 items-center gap-4",
		logo: "h-10 w-10 shrink-0 rounded-lg object-cover",
		publication: "line-clamp-1 font-semibold text-[26px] leading-none tracking-tight",
		issue: "line-clamp-1 shrink-0 font-medium text-[22px] leading-none tabular-nums",
		headline:
			"mt-[48px] font-bold font-heading text-[80px] leading-[1.02] tracking-[-0.04em]",
		inside: "mt-auto flex flex-col gap-[16px]",
		insideLabel:
			"font-semibold text-[18px] text-muted-foreground uppercase leading-none tracking-[0.14em]",
		list: "flex flex-col gap-[12px]",
		item: "flex min-w-0 items-baseline gap-[20px]",
		number: "w-[32px] shrink-0 font-semibold text-[22px] tabular-nums leading-none",
		itemText: "line-clamp-1 text-[26px] text-muted-foreground leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		// Accent colours two small typographic marks only; the canvas stays plain in every tone.
		tone: {
			neutral: { issue: "text-muted-foreground", number: "text-muted-foreground" },
			chart: { issue: "text-chart-1", number: "text-chart-1" },
			primary: { issue: "text-primary", number: "text-primary" },
		},
		// Without a list the headline sits on the baseline and gets a third line.
		list: {
			true: { headline: "line-clamp-2" },
			false: { headline: "mt-auto line-clamp-3" },
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", list: false },
});

export type OgNewsletterIssueMode = NonNullable<
	VariantProps<typeof ogNewsletterIssue>["mode"]
>;
export type OgNewsletterIssueTone = NonNullable<
	VariantProps<typeof ogNewsletterIssue>["tone"]
>;
