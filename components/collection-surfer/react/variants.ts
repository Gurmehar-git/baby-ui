import { tv, type VariantProps } from "tailwind-variants";

export const collectionSurfer = tv({
	slots: {
		root: "relative w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background text-foreground outline-none [container-type:size] [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-ring",
		stage: "sticky top-0 h-[100cqh] w-full overflow-hidden",
		title:
			"pointer-events-none absolute top-5 left-5 z-50 max-w-[80%] font-bold text-3xl uppercase leading-[0.9] tracking-tighter @xl:text-5xl",
		count: "relative top-[0.6em] ml-2 align-top font-mono text-[0.4em] tabular-nums",
		hint: "pointer-events-none absolute right-5 bottom-5 z-50 font-mono text-muted-foreground text-xs uppercase tracking-wider",
		scene:
			"absolute inset-0 flex items-center justify-center [perspective-origin:10%_10%] [perspective:2000px]",
		track:
			"relative size-0 [transform-style:preserve-3d] [translate:calc(var(--cs-shift,0)*var(--cs-w)*-0.8)_calc(var(--cs-shift,0)*var(--cs-w)*0.28)_calc(var(--cs-shift,0)*var(--cs-w)*0.96)]",
		card: "group absolute top-0 left-0 h-[calc(var(--cs-w)*4/3)] w-(--cs-w) transition-[scale,transform] duration-(--duration-slow) ease-(--ease-spring) [rotate:y_-50deg] [transform-style:preserve-3d] [translate:calc(var(--i)*var(--cs-w)*0.8)_calc(var(--i)*var(--cs-w)*-0.28)_calc(var(--i)*var(--cs-w)*-0.96)] motion-reduce:transition-none",
		number:
			"absolute -top-5 -left-3 font-mono text-xs opacity-50 transition-opacity group-hover:opacity-100",
		frame: "size-full overflow-hidden bg-muted shadow-2xl",
		image:
			"size-full object-cover brightness-75 transition-[filter] duration-(--duration-slow) group-hover:brightness-100",
	},
	variants: {
		variant: {
			magnetic: { card: "[scale:calc(1_+_var(--near,0)*0.5)] motion-reduce:[scale:1]" },
			uplift: {
				card: "[transform:translateY(calc(var(--near,0)*-100px))] motion-reduce:[transform:none]",
			},
			simple: {},
		},
		size: {
			sm: { root: "h-96 [--cs-w:120px]" },
			default: { root: "h-[32rem] [--cs-w:160px]" },
			lg: { root: "h-[40rem] [--cs-w:220px]" },
		},
	},
	defaultVariants: { variant: "magnetic", size: "default" },
});

export type CollectionSurferVariant = NonNullable<
	VariantProps<typeof collectionSurfer>["variant"]
>;
export type CollectionSurferSize = NonNullable<
	VariantProps<typeof collectionSurfer>["size"]
>;
