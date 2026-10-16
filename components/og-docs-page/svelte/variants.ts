import { tv, type VariantProps } from "tailwind-variants";

export const ogDocsPage = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-sans text-foreground",
		dots: "absolute inset-y-0 right-0 w-[640px] bg-[radial-gradient(var(--border)_2px,transparent_2px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_right,transparent,black_40%)]",
		column: "relative flex w-[640px] flex-col p-[72px] pr-0",
		brand: "flex items-center gap-4 font-semibold text-[28px] tracking-tight",
		site: "line-clamp-1",
		logo: "h-12 w-12 rounded-xl object-cover",
		crumbs:
			"mt-auto flex items-center gap-3 font-medium text-[24px] text-muted-foreground",
		crumb: "line-clamp-1 max-w-[220px]",
		crumbCurrent: "line-clamp-1 max-w-[260px] font-semibold",
		chevron: "h-5 w-5 shrink-0 opacity-60",
		title:
			"mt-5 line-clamp-3 font-bold font-heading text-[64px] leading-[1.04] tracking-tight",
		description: "mt-6 line-clamp-3 text-[26px] text-muted-foreground leading-snug",
		window:
			"absolute top-[104px] right-[-64px] flex h-[430px] w-[580px] flex-col overflow-hidden rounded-[28px] border border-border [box-shadow:0_32px_96px_-12px_rgb(0_0_0/0.35)]",
		bar: "flex h-[60px] shrink-0 items-center gap-3 border-border border-b px-7",
		light: "h-3.5 w-3.5 rounded-full bg-foreground/15",
		filename: "ml-4 line-clamp-1 font-medium font-mono text-[20px] text-muted-foreground",
		lines: "flex flex-col gap-2 px-7 pt-7 font-mono text-[24px] leading-[1.4]",
		line: "flex items-center gap-5",
		gutter: "w-7 shrink-0 text-right text-muted-foreground/60",
		prompt: "shrink-0 font-semibold",
		code: "line-clamp-1 whitespace-pre",
		comment: "line-clamp-1 whitespace-pre text-muted-foreground",
		bone: "h-4 rounded-full bg-foreground/15",
		boneAccent: "h-4 w-16 shrink-0 rounded-full",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		tone: {
			neutral: {
				crumbCurrent: "text-foreground underline decoration-2 underline-offset-8",
				prompt: "text-muted-foreground",
				boneAccent: "bg-muted-foreground",
			},
			chart: {
				crumbCurrent: "text-chart-2",
				prompt: "text-chart-2",
				boneAccent: "bg-chart-2",
			},
			primary: {
				crumbCurrent: "text-primary",
				prompt: "text-primary",
				boneAccent: "bg-primary",
			},
		},
		motif: {
			code: { window: "bg-card text-card-foreground" },
			terminal: { window: "dark bg-background text-foreground", gutter: "hidden" },
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", motif: "code" },
});

/** Placeholder line widths (px) drawn when no snippet is passed. */
export const OG_DOCS_PAGE_BONES = [260, 340, 200, 380, 300, 160, 320, 240];

export type OgDocsPageMode = NonNullable<VariantProps<typeof ogDocsPage>["mode"]>;
export type OgDocsPageTone = NonNullable<VariantProps<typeof ogDocsPage>["tone"]>;
export type OgDocsPageMotif = NonNullable<VariantProps<typeof ogDocsPage>["motif"]>;
