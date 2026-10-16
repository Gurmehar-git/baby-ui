import { tv, type VariantProps } from "tailwind-variants";

export const gradientHero01 = tv({
	slots: {
		root: "@container relative isolate w-full overflow-hidden bg-background text-foreground",
		blob: "pointer-events-none absolute inset-x-[-18%] bottom-[-34%] -z-10 h-[78%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,var(--hero-a)_0%,var(--hero-b)_34%,var(--hero-c)_58%,transparent_78%)] blur-3xl",
		wash: "pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[68%] bg-[linear-gradient(to_top,var(--hero-b),var(--hero-c)_42%,transparent_78%)]",
		vignette:
			"pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_55%,color-mix(in_oklab,var(--background)_18%,transparent)_0%,transparent_34%,color-mix(in_oklab,var(--background)_90%,transparent)_78%)]",
		fade: "pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,var(--background)_0%,color-mix(in_oklab,var(--background)_68%,transparent)_38%,color-mix(in_oklab,var(--background)_12%,transparent)_100%)]",
		inner: "mx-auto flex max-w-6xl flex-col items-center justify-center px-6 text-center",
		badge:
			"h-8 rounded-full bg-background/50 px-4 font-medium text-muted-foreground text-sm backdrop-blur-md",
		title:
			"mt-8 max-w-5xl text-balance font-medium text-5xl leading-[0.96] @3xl:text-6xl @5xl:text-7xl",
		description:
			"mt-6 max-w-2xl text-pretty text-base text-muted-foreground leading-7 @3xl:text-lg",
		actions: "mt-10 flex flex-col items-center gap-3 @xl:flex-row",
		action: "min-w-36",
		copy: "flex flex-col items-center",
		install:
			"mt-8 inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background/60 pr-1 pl-4 font-mono text-muted-foreground text-sm backdrop-blur-md",
		meta: "mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-muted-foreground text-xs [&>li+li]:before:mr-3 [&>li+li]:before:content-['·']",
		media: "w-full",
	},
	variants: {
		tone: {
			primary: {
				root: "[--hero-a:color-mix(in_oklch,var(--primary)_58%,transparent)] [--hero-b:color-mix(in_oklch,var(--primary)_34%,transparent)] [--hero-c:color-mix(in_oklch,var(--primary)_18%,transparent)]",
			},
			chart: {
				root: "[--hero-a:color-mix(in_oklch,var(--chart-1)_58%,transparent)] [--hero-b:color-mix(in_oklch,var(--chart-1)_34%,transparent)] [--hero-c:color-mix(in_oklch,var(--chart-1)_20%,transparent)]",
			},
			spectrum: {
				root: "[--hero-a:color-mix(in_oklch,var(--chart-1)_58%,transparent)] [--hero-b:color-mix(in_oklch,var(--chart-2)_36%,transparent)] [--hero-c:color-mix(in_oklch,var(--chart-3)_22%,transparent)]",
			},
		},
		size: {
			screen: { inner: "min-h-svh py-24" },
			section: { inner: "py-28 @3xl:py-36" },
		},
		// Set from `media`: the copy sits beside the visual instead of above nothing.
		split: {
			true: {
				inner:
					"items-stretch @4xl:grid @4xl:text-left @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] @4xl:items-center @4xl:gap-12",
				copy: "items-center @4xl:items-start",
				actions: "@xl:justify-start",
				meta: "@4xl:justify-start",
				media: "mt-12 @4xl:mt-0",
			},
			false: {},
		},
	},
	defaultVariants: { tone: "chart", size: "screen", split: false },
});

export type GradientHero01Tone = NonNullable<VariantProps<typeof gradientHero01>["tone"]>;
export type GradientHero01Size = NonNullable<VariantProps<typeof gradientHero01>["size"]>;
