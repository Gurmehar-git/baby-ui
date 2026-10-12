import { tv, type VariantProps } from "tailwind-variants";

export const scrollChoreography = tv({
	slots: {
		root: "relative w-full overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background outline-none [container-type:size] focus-visible:ring-2 focus-visible:ring-ring",
		track: "scroll-frame-track relative h-[300cqh] motion-reduce:h-[100cqh]",
		stage:
			"sticky top-0 h-[100cqh] w-full overflow-hidden [--sc-c1:clamp(0,calc(var(--scroll-p)/0.3),1)] [--sc-c2:clamp(0,calc((var(--scroll-p)_-_0.35)/0.3),1)] [--sc-c3:clamp(0,calc((var(--scroll-p)_-_0.7)/0.2),1)] [--sc-c4:clamp(0,calc((var(--scroll-p)_-_0.75)/0.1),1)] motion-reduce:[--sc-c1:0] motion-reduce:[--sc-c2:0] motion-reduce:[--sc-c3:0] motion-reduce:[--sc-c4:0]",
		image:
			"absolute top-1/2 left-1/2 h-[24cqh] w-[36cqw] overflow-hidden rounded-xl bg-muted shadow-2xl [transform:translate(calc(-50%_+_var(--x0)*(1_-_var(--sc-c2))*1cqw),calc(-50%_+_(var(--y0)_+_var(--dy)*var(--sc-c1))*(1_-_var(--sc-c2))*1cqh))]",
		under: "opacity-[calc(1_-_var(--sc-c4))]",
		hero: "h-[calc(24cqh_+_var(--sc-c3)*76cqh)] w-[calc(36cqw_+_var(--sc-c3)*64cqw)] rounded-[calc((1_-_var(--sc-c3))*0.75rem)]",
		img: "size-full object-cover",
	},
	variants: {
		size: {
			sm: { root: "h-96" },
			default: { root: "h-[32rem]" },
			lg: { root: "h-[40rem]" },
		},
		variant: {
			expand: {},
			stack: { stage: "[--sc-c3:0] [--sc-c4:0]" },
		},
	},
	defaultVariants: { size: "default", variant: "expand" },
});

export type ScrollChoreographySize = NonNullable<
	VariantProps<typeof scrollChoreography>["size"]
>;
export type ScrollChoreographyVariant = NonNullable<
	VariantProps<typeof scrollChoreography>["variant"]
>;
