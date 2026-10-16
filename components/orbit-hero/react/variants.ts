import { tv, type VariantProps } from "tailwind-variants";

// Ring and ripple colours are the reference's fixed slate values, kept exact in both themes.
const RING_SHADOW =
	"shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_28px_54px_-38px_rgb(72_86_108/0.22)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.055),0_24px_42px_-32px_rgb(0_0_0/0.88)]";

export const orbitHero = tv({
	slots: {
		root: "@container relative isolate flex w-full flex-col items-center text-foreground",
		panel:
			"relative grid size-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6 overflow-hidden py-8 @3xl:py-12",
		noise: "pointer-events-none absolute inset-0 size-full opacity-30",
		glow: "pointer-events-none absolute top-0 left-1/3 size-1/2 -translate-1/2 rounded-full bg-linear-to-b from-primary/80 to-transparent blur-3xl",
		glowWarm:
			"pointer-events-none absolute top-0 left-2/3 size-1/3 -translate-1/2 rounded-full bg-linear-to-b from-warning/50 to-transparent blur-3xl",
		vignette:
			"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-60%,transparent_0%,color-mix(in_oklch,var(--muted)_50%,transparent)_50%,color-mix(in_oklch,var(--background)_80%,transparent)_100%)]",
		content:
			"relative z-10 flex flex-col items-center gap-6 px-3 pt-8 text-center @3xl:pt-16",
		badge: "h-7 rounded-full bg-background/50 px-3 backdrop-blur-md",
		title:
			"w-full max-w-200 text-balance font-heading font-light text-[clamp(2.225rem,1.142rem+3.659vw,4rem)] leading-none",
		subheading: "font-sans text-muted-foreground",
		description:
			"w-full max-w-[466px] px-3 text-balance text-base text-muted-foreground @xl:px-0 @3xl:text-lg/6",
		actions: "flex flex-col items-center gap-3 @[360px]:flex-row @xl:gap-6",
		// The wheel is 700px, scaled per container width and pinned so its foot sits past the panel's.
		stage:
			"relative min-h-0 w-full [--anchor:504px] [--inset:2rem] [--scale:0.72] @xl:[--anchor:756px] @xl:[--scale:1.08] @5xl:[--anchor:805px] @5xl:[--inset:3rem] @5xl:[--scale:1.15]",
		wheel: "absolute inset-x-0 top-[max(0px,calc(100%+var(--inset)-var(--anchor)))]",
		visual: "relative flex w-full origin-top scale-(--scale) items-center justify-center",
		ringBox: "pointer-events-none absolute inset-0",
		ringOuter: [
			"relative top-1/2 left-1/2 size-[700px] -translate-1/2 rounded-full opacity-50",
			"bg-[radial-gradient(circle_at_31%_22%,rgb(117_134_164/0.2)_0%,transparent_38%),radial-gradient(circle,transparent_0_68%,rgb(117_134_164/0.14)_78%,rgb(74_94_129/0.24)_100%)]",
			"dark:bg-[radial-gradient(circle_at_31%_22%,rgb(132_153_194/0.2)_0%,transparent_38%),radial-gradient(circle,transparent_0_68%,rgb(54_73_108/0.72)_78%,rgb(13_23_38/0.92)_100%)]",
			RING_SHADOW,
		],
		ringMiddle: [
			"relative top-1/2 left-1/2 size-[600px] -translate-1/2 rounded-full",
			"bg-[radial-gradient(circle_at_31%_20%,rgb(117_134_164/0.24)_0%,transparent_34%),radial-gradient(circle,transparent_0_60%,rgb(117_134_164/0.24)_72%,rgb(74_94_129/0.42)_100%)]",
			"dark:bg-[radial-gradient(circle_at_31%_20%,rgb(132_153_194/0.2)_0%,transparent_34%),radial-gradient(circle,transparent_0_60%,rgb(51_71_107/0.82)_72%,rgb(10_20_34/0.96)_100%)]",
			RING_SHADOW,
		],
		ringInner: [
			"relative top-1/2 left-1/2 size-[450px] -translate-1/2 rounded-full",
			"bg-[radial-gradient(circle_at_35%_20%,color-mix(in_oklch,var(--foreground)_4%,transparent)_0%,transparent_34%),radial-gradient(circle,transparent_0_60%,color-mix(in_oklch,var(--foreground)_3%,transparent)_78%,color-mix(in_oklch,var(--foreground)_5%,transparent)_100%)]",
			"dark:bg-[radial-gradient(circle_at_32%_18%,color-mix(in_oklch,var(--foreground)_3%,transparent)_0%,transparent_32%),radial-gradient(circle,transparent_0_58%,color-mix(in_oklch,var(--foreground)_4%,transparent)_78%,color-mix(in_oklch,var(--foreground)_7%,transparent)_100%)]",
			RING_SHADOW,
		],
		orbits:
			"relative size-[700px] text-(--orbit-tone) transition-colors duration-300 motion-reduce:transition-none",
		orbit: "absolute top-1/2 left-1/2 rotate-(--spin) [--spin:0deg]",
		item: "absolute flex size-12 items-center justify-center -rotate-(--spin) [&_svg]:size-8",
		controlsBox: "absolute inset-0",
		controls:
			"relative top-1/2 left-1/2 z-50 flex size-40 -translate-1/2 scale-[calc(1/var(--scale))] flex-col overflow-hidden rounded-full bg-muted/50 bg-linear-to-t from-primary/50 to-transparent dark:bg-linear-to-b",
		groupControl:
			"relative h-auto w-full flex-1 overflow-hidden rounded-none rounded-t-full border-primary/30 border-b font-black font-heading text-base text-foreground/70 hover:bg-primary/30 hover:text-foreground focus-visible:ring-inset active:bg-primary/40",
		toneControl:
			"relative h-auto w-full flex-1 overflow-hidden rounded-none rounded-b-full border-primary/10 border-t font-black font-heading text-base text-foreground/70 hover:bg-primary/30 hover:text-foreground focus-visible:ring-inset active:bg-primary/40",
		groupLabel:
			"pointer-events-none absolute inset-0 flex items-end justify-center pb-3 [--orbit-from:100%] [--orbit-to:-100%]",
		toneLabel:
			"pointer-events-none absolute inset-0 flex items-start justify-center pt-3 [--orbit-from:-100%] [--orbit-to:100%]",
		ripple:
			"orbit-hero-ripple pointer-events-none absolute top-1/2 left-1/2 z-40 size-40 -translate-1/2 rounded-full border-2 border-[rgb(117_134_164/0.72)] shadow-[0_0_26px_rgb(117_134_164/0.3)] dark:border-[rgb(174_187_221/0.84)] dark:shadow-[0_0_30px_rgb(145_164_213/0.34)]",
		readouts:
			"pointer-events-none absolute inset-x-0 top-1/2 z-30 hidden -translate-y-1/2 items-center justify-between px-6 text-foreground/75 @6xl:flex dark:text-foreground/80",
		countReadout: "flex w-60 shrink-0 -rotate-4 flex-col gap-3 whitespace-nowrap",
		toneReadout: "flex w-60 shrink-0 rotate-3 flex-col items-end gap-3",
		readoutRow: "flex items-center gap-3 whitespace-nowrap",
		readoutLabel: "font-semibold text-base text-foreground",
		readoutValue:
			"orbit-hero-label-in min-w-[4ch] font-medium font-mono text-2xl text-foreground leading-none tracking-tight [--orbit-from:55%]",
		toneValue:
			"orbit-hero-label-in font-mono text-base text-foreground tracking-tight [--orbit-from:55%]",
		bars: "flex h-7 items-end gap-1",
		bar: "w-1 rounded-full bg-foreground/25 transition-[height,background-color] duration-300 data-[active=true]:bg-primary motion-reduce:transition-none dark:bg-foreground/30",
		swatch:
			"size-3 shrink-0 rounded-full bg-(--orbit-tone) shadow-[0_0_0_3px_color-mix(in_oklch,var(--background)_16%,transparent)] transition-colors duration-300 motion-reduce:transition-none",
	},
	variants: {
		variant: {
			panel: {
				root: "px-3 @3xl:px-0",
				panel: "rounded-2xl bg-muted/30 @3xl:mb-[34px] @3xl:rounded-3xl",
			},
			plain: { panel: "bg-background" },
		},
		size: {
			screen: { root: "h-svh max-h-[900px] min-h-[38rem]" },
			section: { root: "h-[48rem]" },
		},
	},
	defaultVariants: { variant: "panel", size: "screen" },
});

export type OrbitHeroVariant = NonNullable<VariantProps<typeof orbitHero>["variant"]>;
export type OrbitHeroSize = NonNullable<VariantProps<typeof orbitHero>["size"]>;
