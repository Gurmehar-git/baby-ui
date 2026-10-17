import { tv, type VariantProps } from "tailwind-variants";

/** Concentric rings radiating from the bottom right corner, innermost first. */
export const OG_JOB_RINGS = [
	"-bottom-[40px] right-[20px] h-[160px] w-[160px] opacity-70",
	"-bottom-[120px] -right-[60px] h-[320px] w-[320px] opacity-45",
	"-bottom-[200px] -right-[140px] h-[480px] w-[480px] opacity-30",
	"-bottom-[280px] -right-[220px] h-[640px] w-[640px] opacity-20",
];

export const ogJobPosting = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[72px] font-sans text-foreground",
		ring: "absolute rounded-full border-[3px]",
		core: "absolute right-[88px] bottom-[28px] h-6 w-6 rounded-full",
		header: "relative flex items-center justify-between gap-8",
		company: "flex min-w-0 items-center gap-5",
		logoTile:
			"flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card",
		logo: "h-full w-full object-cover",
		companyName: "line-clamp-1 font-semibold text-[30px] tracking-tight",
		badge:
			"flex shrink-0 items-center gap-3 rounded-full px-6 py-3 font-semibold text-[24px]",
		badgeIcon: "h-6 w-6",
		body: "relative mt-auto flex flex-col gap-3",
		team: "line-clamp-1 font-semibold text-[28px]",
		title:
			"line-clamp-2 max-w-[900px] font-bold font-heading text-[80px] leading-[1.02] tracking-tighter",
		strip:
			"relative mt-10 flex self-start overflow-hidden rounded-3xl border border-border bg-card",
		cell: "flex items-center gap-3 px-7 py-5",
		separator: "w-px self-stretch bg-border",
		cellIcon: "h-7 w-7 shrink-0",
		cellText: "line-clamp-1 max-w-[220px] font-semibold text-[26px]",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				ring: "border-chart-1",
				core: "bg-chart-1",
				badge: "bg-chart-1 text-background",
				team: "text-chart-1",
				cellIcon: "text-chart-1",
			},
			primary: {
				ring: "border-primary",
				core: "bg-primary",
				badge: "bg-primary text-primary-foreground",
				team: "text-primary",
				cellIcon: "text-primary",
			},
			neutral: {
				ring: "border-muted-foreground",
				core: "bg-muted-foreground",
				badge: "border border-border bg-muted text-foreground",
				team: "text-muted-foreground",
				cellIcon: "text-muted-foreground",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral" },
});

export type OgJobPostingMode = NonNullable<VariantProps<typeof ogJobPosting>["mode"]>;
export type OgJobPostingTone = NonNullable<VariantProps<typeof ogJobPosting>["tone"]>;
