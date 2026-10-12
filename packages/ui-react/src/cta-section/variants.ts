import { tv, type VariantProps } from "tailwind-variants";

export const ctaSection = tv({
	slots: {
		root: "@container/cta w-full bg-background text-foreground",
		wrap: "mx-auto w-full max-w-280 px-4 py-10 @xl/cta:px-8 @xl/cta:py-16",
		panel: "",
		copy: "grid gap-4",
		title:
			"max-w-[18ch] text-balance font-semibold text-3xl tracking-tight @3xl/cta:text-4xl",
		description:
			"max-w-136 text-pretty text-base text-muted-foreground leading-relaxed @xl/cta:text-lg",
		actions:
			"mt-4 flex w-full flex-col gap-3 @xl/cta:w-auto @xl/cta:flex-row @xl/cta:flex-wrap",
		action: "group/cta-action w-full @xl/cta:w-auto",
		arrow:
			"transition-transform duration-(--duration-fast) group-hover/cta-action:translate-x-0.5 motion-reduce:transition-none",
		note: "mt-3 inline-flex flex-wrap items-center justify-center gap-3 text-muted-foreground text-sm",
		points: "mt-2 grid gap-2",
		point:
			"flex items-center gap-3 text-muted-foreground text-sm [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-success",
		stage:
			"grid min-h-80 place-items-center rounded-3xl border border-border bg-background p-5 @xl/cta:p-8",
		// The banner folds its own row closed on dismiss, so the page below rises instead of jumping.
		collapse:
			"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[open=false]:grid-rows-[0fr] data-[open=false]:opacity-0 motion-reduce:transition-none",
		collapseInner: "min-h-0 overflow-hidden",
		banner:
			"flex flex-col items-start gap-4 rounded-2xl border border-border bg-background p-4 @xl/cta:flex-row @xl/cta:items-center @xl/cta:justify-between @xl/cta:py-2.5 @xl/cta:pr-2.5 @xl/cta:pl-5",
		bannerText:
			"flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-relaxed",
		bannerTitle: "font-medium",
		bannerDescription: "text-muted-foreground",
		bannerActions:
			"flex w-full shrink-0 items-center justify-between gap-1 @xl/cta:w-auto",
	},
	variants: {
		variant: {
			centered: {
				panel:
					"grid justify-items-center gap-4 rounded-3xl border border-border bg-background px-5 py-16 text-center @xl/cta:px-8 @xl/cta:py-24",
				copy: "justify-items-center",
				actions: "@xl/cta:justify-center",
			},
			split: {
				panel: "grid items-center gap-10 @3xl/cta:grid-cols-2 @3xl/cta:gap-16",
				copy: "justify-items-start",
				wrap: "@xl/cta:py-24",
			},
			banner: { wrap: "py-4 @xl/cta:py-6" },
		},
	},
	defaultVariants: { variant: "centered" },
});

export type CtaSectionVariant = NonNullable<VariantProps<typeof ctaSection>["variant"]>;
