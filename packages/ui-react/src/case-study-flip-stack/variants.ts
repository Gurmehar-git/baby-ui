import { tv, type VariantProps } from "tailwind-variants";

export const caseStudyFlipStack = tv({
	slots: {
		root: "relative w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background text-foreground outline-none [container-type:size] focus-visible:ring-2 focus-visible:ring-ring",
		intro: "flex h-[100cqh] flex-col items-center justify-center gap-8 px-5 text-center",
		hint: "flex items-center gap-3 font-medium text-2xl tracking-tighter @xl:gap-6 @xl:text-4xl",
		arrow: "case-study-bob size-[1em]",
		heading:
			"max-w-[18ch] text-balance font-semibold text-4xl text-primary leading-[0.92] tracking-tighter @xl:text-6xl",
		track: "scroll-frame-track relative",
		stage:
			"sticky top-0 flex h-[100cqh] items-center justify-center overflow-hidden px-4 @xl:px-10",
		deck: "relative h-[78cqh] w-full max-w-[860px] [perspective:800px] @3xl:aspect-[1.76/1] @3xl:h-auto @3xl:max-h-[78cqh]",
		article:
			"absolute inset-0 [--e:clamp(0,calc(var(--scroll-p)*var(--n)_-_var(--i)),1)] [--en:clamp(0,calc((var(--scroll-p)*var(--n)_-_var(--i)_+_1)/0.7),1)] [backface-visibility:hidden] [transform-style:preserve-3d] [transform:translateY(calc(var(--e)*-118%_+_var(--e)*var(--stack)*1px))_rotateX(calc(var(--e)*22deg))] motion-reduce:opacity-[calc(1_-_var(--e))] motion-reduce:[transform:none]",
		card: "grid h-full origin-bottom grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden rounded-[1.25rem] py-0 shadow-xl [transform:translateY(calc((1_-_var(--en))*var(--rest-y)*1px))_scale(calc(1_-_(1_-_var(--en))*(1_-_var(--rest-s))))] @xl:grid-cols-[1.15fr_0.85fr] @xl:grid-rows-1 motion-reduce:[transform:none]",
		copy: "flex min-w-0 flex-col p-5 @xl:p-10",
		number: "font-medium text-2xl leading-none tracking-tighter @xl:text-4xl",
		eyebrow:
			"mb-2 font-semibold text-xs uppercase tracking-widest opacity-70 @xl:mb-4 @xl:text-xs",
		title:
			"max-w-[16ch] text-balance font-semibold text-2xl leading-[0.96] tracking-tighter @xl:text-4xl",
		description:
			"mt-3 line-clamp-3 max-w-[42rem] text-xs leading-normal opacity-80 @xl:mt-5 @xl:line-clamp-none @xl:text-sm",
		media: "relative m-2.5 min-h-24 overflow-hidden rounded-xl bg-muted @xl:m-4 @xl:ml-0",
		image: "absolute inset-0 size-full object-cover",
		end: "flex min-h-[100cqh] items-center justify-center px-5 text-center font-semibold text-6xl leading-none tracking-tighter @xl:text-8xl",
	},
	variants: {
		size: {
			sm: { root: "h-96" },
			default: { root: "h-[32rem]" },
			lg: { root: "h-[40rem]" },
		},
		tone: {
			card: { card: "border-border bg-card text-card-foreground" },
			inverse: { card: "border-transparent bg-foreground text-background" },
			chart: { card: "border-transparent bg-(--tint) text-background" },
		},
	},
	defaultVariants: { size: "default", tone: "card" },
});

export type CaseStudyFlipStackSize = NonNullable<
	VariantProps<typeof caseStudyFlipStack>["size"]
>;
export type CaseStudyFlipStackTone = NonNullable<
	VariantProps<typeof caseStudyFlipStack>["tone"]
>;
