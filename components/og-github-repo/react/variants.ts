import { tv, type VariantProps } from "tailwind-variants";

export const ogGithubRepo = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background p-[72px] font-sans text-foreground",
		heatmap: "absolute top-[64px] right-[64px] flex gap-1.5",
		week: "flex flex-col gap-1.5",
		cell: "h-[18px] w-[18px] rounded-[5px]",
		owner:
			"relative flex max-w-[520px] items-center gap-4 text-[30px] text-muted-foreground",
		ownerAvatar: "h-14 w-14 shrink-0 rounded-full border-2 border-border object-cover",
		ownerName: "line-clamp-1 font-medium",
		name: "relative mt-auto line-clamp-2 max-w-[1000px] break-words font-bold font-heading text-[80px] leading-[1.02] tracking-tight",
		description:
			"relative mt-5 line-clamp-2 max-w-[960px] text-[28px] text-muted-foreground leading-snug",
		footer:
			"relative mt-10 flex items-center gap-10 border-border border-t pt-8 text-[26px]",
		language: "flex items-center gap-3 font-medium",
		languageDot: "h-5 w-5 shrink-0 rounded-full",
		languageName: "line-clamp-1 max-w-[240px]",
		stat: "flex items-center gap-2.5 font-semibold",
		icon: "h-7 w-7 text-muted-foreground",
		stack: "ml-auto flex items-center",
		avatar: "h-14 w-14 rounded-full border-4 border-background object-cover",
		overlap: "-ml-4",
		more: "flex h-14 min-w-14 items-center justify-center rounded-full border-4 border-background bg-muted px-3 font-semibold text-[20px]",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			chart: { cell: "bg-chart-3", languageDot: "bg-chart-3" },
			primary: { cell: "bg-primary", languageDot: "bg-primary" },
			neutral: { cell: "bg-muted-foreground", languageDot: "bg-muted-foreground" },
		},
	},
	defaultVariants: { mode: "light", tone: "chart" },
});

export const ogGithubRepoCell = tv({
	base: "",
	variants: {
		level: {
			none: "opacity-10",
			low: "opacity-25",
			mid: "opacity-45",
			high: "opacity-70",
			max: "opacity-100",
		},
	},
	defaultVariants: { level: "none" },
});

export type OgGithubRepoMode = NonNullable<VariantProps<typeof ogGithubRepo>["mode"]>;
export type OgGithubRepoTone = NonNullable<VariantProps<typeof ogGithubRepo>["tone"]>;
export type OgGithubRepoLevel = NonNullable<
	VariantProps<typeof ogGithubRepoCell>["level"]
>;

const LEVELS: OgGithubRepoLevel[] = ["none", "low", "mid", "high", "max"];

/** Decorative 20x7 activity grid; a fixed hash so both ports draw the same pattern. */
export const OG_GITHUB_REPO_WEEKS: OgGithubRepoLevel[][] = Array.from(
	{ length: 20 },
	(_, w) =>
		Array.from({ length: 7 }, (_, d) => {
			const hash = ((w * 7 + d + 1) * 2654435761) >>> 0;
			return LEVELS[w < 6 ? hash % 2 : (hash >>> 8) % 5] ?? "none";
		}),
);

/** Tabler glyph paths for the stat row. */
export const OG_GITHUB_REPO_ICONS = {
	stars: [
		"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z",
	],
	forks: [
		"M10 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"M7 8v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2 -2v-2",
		"M12 12v4",
	],
	issues: ["M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0", "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"],
};
