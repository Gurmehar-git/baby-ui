import { tv, type VariantProps } from "tailwind-variants";

export const ogBlogPost = tv({
	slots: {
		root: "relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-background font-sans text-foreground",
		ruleTop: "absolute inset-x-0 top-[44px] h-px bg-border",
		ruleBottom: "absolute inset-x-0 bottom-[44px] h-px bg-border",
		ruleLeft: "absolute inset-y-0 left-[44px] w-px bg-border",
		ruleRight: "absolute inset-y-0 right-[44px] w-px bg-border",
		cover:
			"absolute inset-x-0 bottom-0 h-[360px] w-full object-cover [mask-image:linear-gradient(to_bottom,transparent,black_55%)]",
		header: "relative flex items-center",
		brand: "flex items-center gap-4 font-semibold text-[28px] tracking-tight",
		logo: "h-12 w-12 rounded-xl object-cover",
		category:
			"flex items-center gap-3 font-medium text-[20px] text-muted-foreground uppercase tracking-[0.14em]",
		dot: "h-2.5 w-2.5 rounded-full",
		body: "relative flex flex-col",
		lead: "line-clamp-1 font-medium text-[40px] text-muted-foreground tracking-tight",
		title: "font-heading font-semibold leading-[1.02]",
		excerpt: "line-clamp-2 text-[28px] text-muted-foreground leading-snug",
		footer: "relative mt-10 flex items-center gap-5 text-[24px]",
		avatar: "h-14 w-14 rounded-full object-cover",
		author: "font-semibold",
		meta: "text-muted-foreground",
		sep: "h-1.5 w-1.5 rounded-full bg-muted-foreground/60",
	},
	variants: {
		mode: {
			light: {},
			dark: { root: "dark" },
		},
		// Colours one mark, the category dot; the canvas stays neutral.
		tone: {
			neutral: { dot: "bg-foreground" },
			primary: { dot: "bg-primary" },
			chart: { dot: "bg-chart-1" },
		},
		variant: {
			default: {
				root: "p-[88px]",
				header: "justify-between",
				body: "mt-auto gap-6",
				title: "line-clamp-3 max-w-[1000px] text-[72px] tracking-[-0.035em]",
				excerpt: "max-w-[900px]",
			},
			cover: {
				root: "items-center px-[120px] pt-[64px] text-center",
				brand: "font-medium font-mono text-[34px] tracking-[-0.02em]",
				logo: "h-10 w-10 rounded-lg",
				body: "mt-[44px] items-center gap-3",
				title: "line-clamp-2 text-[66px] tracking-[-0.045em]",
				excerpt: "mt-4 line-clamp-1 text-[26px]",
			},
		},
	},
	defaultVariants: { mode: "light", tone: "neutral", variant: "default" },
});

export type OgBlogPostMode = NonNullable<VariantProps<typeof ogBlogPost>["mode"]>;
export type OgBlogPostTone = NonNullable<VariantProps<typeof ogBlogPost>["tone"]>;
export type OgBlogPostVariant = NonNullable<VariantProps<typeof ogBlogPost>["variant"]>;
