import { tv, type VariantProps } from "tailwind-variants";

export const boldCopy = tv({
	slots: {
		root: "group/bold relative inline-flex items-center justify-center font-heading font-bold uppercase",
		background:
			"select-none text-foreground/15 transition-opacity duration-[var(--bc-duration,300ms)] group-hover/bold:opacity-50",
		title: "absolute transition-all duration-[var(--bc-duration,300ms)]",
	},
	variants: {
		size: {
			sm: {
				background: "text-xl md:text-2xl",
				title: "text-sm md:text-lg group-hover/bold:text-xl group-hover/bold:md:text-2xl",
			},
			default: {
				background: "text-2xl md:text-4xl",
				title:
					"text-base md:text-xl group-hover/bold:text-2xl group-hover/bold:md:text-4xl",
			},
			xl: {
				background: "text-4xl md:text-8xl",
				title:
					"text-lg md:text-3xl group-hover/bold:text-4xl group-hover/bold:md:text-8xl",
			},
		},
	},
	defaultVariants: { size: "xl" },
});

export type BoldCopySize = NonNullable<VariantProps<typeof boldCopy>["size"]>;
