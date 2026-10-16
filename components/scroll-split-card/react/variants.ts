import { tv, type VariantProps } from "tailwind-variants";

export const scrollSplitCard = tv({
	slots: {
		root: "relative w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background text-foreground outline-none [container-type:size] focus-visible:ring-2 focus-visible:ring-ring",
		track: "scroll-frame-track relative h-[500cqh] motion-reduce:h-[100cqh]",
		stage:
			"sticky top-0 flex h-[100cqh] w-full items-center justify-center overflow-hidden [perspective:1200px] [--ssc-a:clamp(0,calc(var(--scroll-p)*2.5),1)] [--ssc-b:clamp(0,calc((var(--scroll-p)_-_0.4)*2.5),1)] [--ssc-c:clamp(0,calc((var(--scroll-p)_-_0.8)*5),1)] [--ssc-r:clamp(0,calc(var(--scroll-p)*5),1)] [--ssc-h:clamp(0,calc(var(--scroll-p)*10),1)]",
		hint: "absolute inset-x-0 top-[14%] text-center font-medium text-muted-foreground text-xs uppercase tracking-widest opacity-[calc(1_-_var(--ssc-h))] [translate:0_calc(var(--ssc-h)*20px)] motion-reduce:hidden",
		row: "relative flex h-[min(24rem,62cqh)] w-full max-w-4xl px-4 [transform-style:preserve-3d] [transform:translateY(calc(var(--ssc-c)*-18cqh))_scale(calc(1_-_var(--ssc-a)*0.1))] @xl:px-8 motion-reduce:gap-3 motion-reduce:[transform:none]",
		piece:
			"relative h-full flex-1 [transform-style:preserve-3d] [transform:translateX(calc(var(--side)*(var(--ssc-a)*48px_-_var(--ssc-b)*24px)))_rotateY(calc(var(--ssc-b)*180deg))_rotateZ(calc(var(--side)*var(--ssc-b)*-6deg))] motion-reduce:[transform:none]",
		front:
			"absolute inset-0 overflow-hidden bg-muted [backface-visibility:hidden] motion-reduce:hidden",
		image:
			"absolute inset-y-0 left-[calc(var(--i)*-100%)] h-full w-[300%] max-w-none object-cover",
		back: "absolute inset-0 h-full justify-end gap-2 overflow-hidden rounded-2xl px-4 py-4 [backface-visibility:hidden] [transform:rotateY(180deg)] @xl:gap-3 @xl:px-6 @xl:py-6 motion-reduce:[transform:none]",
		title: "text-balance font-medium text-base text-current leading-tight @xl:text-2xl",
		description: "text-current text-xs leading-relaxed opacity-80 @xl:text-sm",
		end: "absolute inset-x-0 bottom-[12%] px-4 text-center font-medium font-serif text-2xl text-foreground/80 italic tracking-tight opacity-(--ssc-c) [translate:0_calc((1_-_var(--ssc-c))*40px)] @xl:text-3xl motion-reduce:hidden",
	},
	variants: {
		size: {
			sm: { root: "h-96" },
			default: { root: "h-[32rem]" },
			lg: { root: "h-[40rem]" },
		},
		tone: {
			card: { back: "border-border bg-card text-card-foreground" },
			inverse: { back: "border-transparent bg-foreground text-background" },
			chart: { back: "border-transparent bg-(--tint) text-background" },
		},
		position: {
			first: {
				front:
					"rounded-l-2xl rounded-r-[calc(var(--ssc-r)*1rem)] motion-reduce:rounded-2xl",
			},
			middle: { front: "rounded-[calc(var(--ssc-r)*1rem)]" },
			last: {
				front:
					"rounded-l-[calc(var(--ssc-r)*1rem)] rounded-r-2xl motion-reduce:rounded-2xl",
			},
		},
	},
	defaultVariants: { size: "default", tone: "card", position: "middle" },
});

export type ScrollSplitCardSize = NonNullable<
	VariantProps<typeof scrollSplitCard>["size"]
>;
export type ScrollSplitCardTone = NonNullable<
	VariantProps<typeof scrollSplitCard>["tone"]
>;
export type ScrollSplitCardPosition = NonNullable<
	VariantProps<typeof scrollSplitCard>["position"]
>;
