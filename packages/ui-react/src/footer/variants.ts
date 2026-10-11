import { tv, type VariantProps } from "tailwind-variants";

export const footer = tv({
	slots: {
		root: "@container relative w-full border-border border-t bg-background",
		notch: "hidden",
		topLink:
			"group/top inline-flex h-9 items-center gap-2 rounded-full px-5 font-medium text-foreground text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
		topIcon:
			"size-4 transition-transform duration-[var(--duration-press)] ease-[var(--ease-ui-out)] group-hover/top:-translate-y-0.5 motion-reduce:transition-none",
		inner: "mx-auto max-w-6xl px-6 pt-20 pb-10 @3xl:pt-24 @3xl:pb-12",
		grid: "grid gap-14",
		brandBlock: "",
		description: "mt-6 max-w-sm text-pretty text-muted-foreground text-sm",
		socials: "mt-7 flex items-center gap-2",
		social:
			"grid size-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground motion-reduce:transition-none [&_svg]:size-4",
		copyright: "mt-7 text-muted-foreground text-xs",
		legal: "mt-3 flex flex-wrap gap-x-4 gap-y-1",
		actions: "mt-4 flex items-center gap-1",
		columns: "grid gap-10 @xl:grid-cols-3",
		columnTitle: "font-semibold text-foreground text-sm",
		links: "mt-4 space-y-3",
		link: "inline-flex items-center gap-1 rounded-sm text-muted-foreground text-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		linkDescription: "block text-muted-foreground text-xs",
		rule: "hidden",
		bottom: "hidden",
		bottomLink:
			"rounded-sm text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		wordmarkWrap: "relative overflow-hidden px-4 pb-8 @3xl:pb-10",
		wordmark:
			"footer-wordmark block select-none text-center font-semibold text-[22cqw] leading-[0.82] tracking-tight",
	},
	variants: {
		/** Brand beside the columns, centred above them, or nexonauts' notched shelf with a
		 * back-to-top tab and a ruled bottom row. */
		layout: {
			split: {
				grid: "@3xl:grid-cols-12",
				brandBlock: "@3xl:col-span-5",
				columns: "@3xl:col-span-7",
			},
			centered: {
				grid: "justify-items-center text-center",
				brandBlock: "flex flex-col items-center",
				description: "mx-auto",
				socials: "justify-center",
				legal: "justify-center",
				actions: "justify-center",
				columns: "w-full max-w-3xl justify-items-center",
			},
			notched: {
				root: "mt-auto rounded-t-[2rem]",
				notch: "block",
				inner: "pt-14 pb-0 @3xl:pt-20 @3xl:pb-0",
				grid: "gap-10 pb-14 @3xl:grid-cols-[1fr_1.5fr] @3xl:gap-16 @3xl:pb-20",
				description:
					"mt-5 max-w-[24ch] text-balance font-medium text-foreground text-lg @5xl:text-xl",
				socials: "flex-wrap gap-x-6 gap-y-2",
				columns: "gap-8",
				columnTitle:
					"font-mono font-normal text-muted-foreground text-xs uppercase tracking-wider",
				links: "space-y-2.5",
				rule: "block h-px w-full bg-border",
				bottom:
					"flex flex-col items-start gap-4 py-5 text-muted-foreground text-xs @xl:flex-row @xl:items-center @xl:justify-between",
				legal: "mt-0 gap-x-5",
				actions: "mt-0",
			},
		},
	},
	defaultVariants: { layout: "split" },
});

export type FooterLayout = NonNullable<VariantProps<typeof footer>["layout"]>;
