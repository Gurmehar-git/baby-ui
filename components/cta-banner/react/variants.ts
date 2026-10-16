import { tv, type VariantProps } from "tailwind-variants";

// Every part reads --tint; each variant sets it from --cta-banner, else its own default.
export const ctaBanner = tv({
	slots: {
		root: "group/banner @container relative isolate w-full overflow-hidden",
		content: "relative z-10 flex flex-col",
		eyebrow: "font-medium text-sm",
		title: "text-balance",
		description: "text-pretty",
		actions: "flex flex-wrap items-center gap-3",
		// A <strong> inside the note becomes its emphasised second line.
		note: "text-sm [&_strong]:mt-2 [&_strong]:block [&_strong]:font-medium",
		badge:
			"mb-3 grid size-20 rotate-2 place-items-center rounded-3xl bg-white text-(--tint) shadow-lg [&_svg]:size-10",
		// Grain
		layer: "pointer-events-none absolute inset-0",
		line: "pointer-events-none absolute bg-white/20",
		floater:
			"cta-banner-drift pointer-events-none absolute size-7 text-white/75 drop-shadow-[0_1px_2px_rgb(0_0_0/0.35)] [&_svg]:size-full",
		// Ticker
		tickerField:
			"pointer-events-none absolute inset-y-0 right-0 left-[calc(50%-2rem)] hidden overflow-hidden @4xl:block",
		tickerRows:
			"absolute top-1/2 left-1/2 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col gap-4",
		tickerRow: "overflow-hidden text-5xl text-white/35 tracking-[-0.03em]",
		tickerRun:
			"cta-banner-run flex w-max select-none font-extrabold uppercase leading-none",
		tickerWord:
			"flex shrink-0 items-center gap-[0.35em] pr-[0.35em] [&_svg]:h-[0.5em] [&_svg]:w-auto",
		// Blurs the rows where they pass behind the words.
		tickerVeil:
			"pointer-events-none absolute inset-y-0 left-[calc(50%-7rem)] hidden w-48 bg-(--tint)/20 backdrop-blur-xl [mask-image:linear-gradient(to_right,transparent,black_35%,black_65%,transparent)] @4xl:block",
		// Spotlight: a dark tint-lit surface 1px inside the edge, which is lit around the pointer.
		spotEdge:
			"pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(var(--r,420px)_circle_at_var(--x,50%)_var(--y,0%),var(--tint),rgb(255_255_255/0.1)_55%)]",
		spotSurface:
			"pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_oklch,var(--tint)_42%,#09090b),#09090b_70%)]",
		spotOrb:
			"pointer-events-none absolute -top-48 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-(--tint) opacity-40 blur-[110px]",
		spotGrid:
			"pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] bg-[linear-gradient(to_right,rgb(255_255_255/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]",
		// The same grid, brighter, shown only under the pointer's light.
		spotReveal:
			"pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] bg-[linear-gradient(to_right,rgb(255_255_255/0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.2)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(calc(var(--r,420px)*0.55)_circle_at_var(--x,50%)_var(--y,0%),black,transparent)]",
		spotLight:
			"pointer-events-none absolute inset-px rounded-[calc(2rem-1px)] bg-[radial-gradient(var(--r,420px)_circle_at_var(--x,50%)_var(--y,0%),rgb(255_255_255/0.08),transparent_70%)]",
		spotSweep:
			"cta-banner-sweep pointer-events-none absolute top-px left-0 h-px w-1/3 bg-linear-to-r from-transparent via-white/80 to-transparent",
	},
	variants: {
		/** `grain`: a noisy tinted panel; `ticker`: lit copy beside a running wordmark; `spotlight`:
		 * a dark tint-lit card whose grid and edge light up under the pointer. */
		variant: {
			grain: {
				root: "rounded-3xl bg-(--tint) text-white [--tint:var(--cta-banner,#05845f)]",
				content: "mx-auto max-w-4xl items-center px-6 text-center",
				// The title fades down its height, light catching the top of the words.
				title:
					"mb-8 bg-linear-to-b from-white to-white/75 bg-clip-text font-medium text-transparent leading-[1.05] tracking-[-0.02em]",
				description: "-mt-4 mb-8 max-w-xl text-lg text-white/80",
				actions: "justify-center",
				note: "mt-8 max-w-md text-white/80 [&_strong]:text-white",
			},
			ticker: {
				root: "rounded-[2rem] bg-(--tint) text-white [--tint:var(--cta-banner,#0066ff)] @2xl:rounded-[2.5rem]",
				content: "mx-auto w-full max-w-6xl items-start gap-8 px-6 @2xl:px-10",
				// Lit text: a white gradient under a hairline stroke, so the words read as embossed.
				title:
					"box-decoration-clone max-w-[12ch] bg-linear-to-b from-white/50 via-white/85 to-white bg-clip-text pb-[0.1em] -mb-[0.1em] font-bold text-transparent leading-[0.92] tracking-[-0.04em] [-webkit-text-stroke:1px_white]",
				description: "max-w-lg text-lg text-white/85 @2xl:text-xl",
				note: "text-white/75 [&_strong]:text-white",
			},
			spotlight: {
				root: "rounded-[2rem] bg-[#09090b] text-white [--tint:var(--cta-banner,var(--primary))]",
				content: "mx-auto max-w-3xl items-center gap-6 px-6 text-center",
				eyebrow:
					"inline-flex h-7 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 text-white/80 text-xs backdrop-blur before:size-1.5 before:rounded-full before:bg-(--tint) before:shadow-[0_0_10px_var(--tint)]",
				title:
					"bg-linear-to-b from-white to-white/60 bg-clip-text font-semibold text-transparent leading-[1.05] tracking-[-0.03em]",
				description: "max-w-xl text-lg text-white/65",
				actions: "justify-center",
				note: "text-white/55 [&_strong]:text-white/85",
			},
		},
		/** Padding and headline scale. */
		size: { sm: {}, default: {}, lg: {} },
	},
	compoundVariants: [
		{
			variant: "grain",
			size: "sm",
			class: { root: "py-14", title: "text-3xl @2xl:text-4xl" },
		},
		{
			variant: "grain",
			size: "default",
			class: { root: "py-24", title: "text-4xl @2xl:text-5xl @4xl:text-6xl" },
		},
		{
			variant: "grain",
			size: "lg",
			class: { root: "py-32", title: "text-5xl @2xl:text-6xl @4xl:text-7xl" },
		},
		{
			variant: "ticker",
			size: "sm",
			class: { content: "py-14 @2xl:py-16", title: "text-[clamp(2.25rem,6cqw,4.5rem)]" },
		},
		{
			variant: "ticker",
			size: "default",
			class: { content: "py-20 @2xl:py-28", title: "text-[clamp(3rem,9cqw,7rem)]" },
		},
		{
			variant: "ticker",
			size: "lg",
			class: { content: "py-24 @2xl:py-36", title: "text-[clamp(3.5rem,11cqw,8.5rem)]" },
		},
		{
			variant: "spotlight",
			size: "sm",
			class: { root: "py-14", title: "text-3xl @2xl:text-4xl" },
		},
		{
			variant: "spotlight",
			size: "default",
			class: { root: "py-20 @2xl:py-28", title: "text-4xl @2xl:text-5xl @4xl:text-6xl" },
		},
		{
			variant: "spotlight",
			size: "lg",
			class: { root: "py-28 @2xl:py-36", title: "text-5xl @2xl:text-6xl @4xl:text-7xl" },
		},
	],
	defaultVariants: { variant: "grain", size: "default" },
});

export type CtaBannerVariant = NonNullable<VariantProps<typeof ctaBanner>["variant"]>;
export type CtaBannerSize = NonNullable<VariantProps<typeof ctaBanner>["size"]>;
