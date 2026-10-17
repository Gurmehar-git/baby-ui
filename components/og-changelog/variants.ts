import { tv, type VariantProps } from "tailwind-variants";

export const ogChangelog = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
		ghost:
			"absolute right-[-24px] bottom-[-64px] line-clamp-1 whitespace-nowrap font-bold font-heading text-[240px] text-foreground/[0.05] leading-none tracking-tighter",
		stub: "relative flex w-[340px] shrink-0 flex-col border-border border-r-2 border-dashed bg-card p-[56px]",
		notch:
			"absolute left-[312px] h-14 w-14 rounded-full border-2 border-border bg-background",
		brand: "flex items-center gap-4 font-semibold text-[26px] tracking-tight",
		site: "line-clamp-1",
		logo: "h-11 w-11 rounded-xl object-cover",
		pill: "mt-auto flex max-w-full self-start rounded-full px-6 py-2.5 font-bold font-mono text-[30px] tracking-tight",
		pillText: "line-clamp-1",
		date: "mt-5 line-clamp-2 font-semibold text-[30px] text-muted-foreground leading-tight",
		rail: "mt-10 flex items-center gap-3",
		railDot: "h-3 w-3 rounded-full bg-foreground/20",
		railHead: "h-5 w-5 rounded-full",
		railLine: "h-0.5 flex-1 bg-foreground/15",
		main: "relative flex flex-1 flex-col justify-center gap-10 py-[64px] pr-[72px] pl-[72px]",
		headline:
			"line-clamp-2 font-bold font-heading text-[58px] leading-[1.05] tracking-tight",
		list: "flex flex-col gap-6",
		item: "flex items-start gap-5",
		text: "line-clamp-2 pt-0.5 text-[26px] leading-snug",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: {
				pill: "border-2 border-chart-1/40 bg-chart-1/15 text-chart-1",
				railHead: "bg-chart-1",
			},
			primary: { pill: "bg-primary text-primary-foreground", railHead: "bg-primary" },
			neutral: {
				pill: "border-2 border-border bg-muted text-foreground",
				railHead: "bg-muted-foreground",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral" },
});

// Chips stay neutral so three entries never read as three accents; the icon carries the kind.
export const ogChangelogMarker = tv({
	slots: {
		marker:
			"flex w-[150px] shrink-0 items-center justify-center gap-2 rounded-xl border border-border py-1.5 font-semibold text-[20px] text-foreground",
		icon: "h-5 w-5",
	},
	variants: {
		kind: {
			added: { icon: "text-success" },
			changed: { icon: "text-info" },
			fixed: { icon: "text-warning" },
			removed: { icon: "text-destructive" },
		},
	},
	defaultVariants: { kind: "added" },
});

/** Tabler glyph paths per marker kind. */
export const OG_CHANGELOG_ICONS: Record<OgChangelogKind, string[]> = {
	added: ["M12 5v14", "M5 12h14"],
	changed: [
		"M4 12a8 8 0 0 1 14-5.3L20 9",
		"M20 4v5h-5",
		"M20 12a8 8 0 0 1-14 5.3L4 15",
		"M4 20v-5h5",
	],
	fixed: ["M5 12l5 5L20 7"],
	removed: ["M5 12h14"],
};

export type OgChangelogMode = NonNullable<VariantProps<typeof ogChangelog>["mode"]>;
export type OgChangelogTone = NonNullable<VariantProps<typeof ogChangelog>["tone"]>;
export type OgChangelogKind = NonNullable<VariantProps<typeof ogChangelogMarker>["kind"]>;
