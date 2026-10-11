import { tv, type VariantProps } from "tailwind-variants";

/** The control ladder from DESIGN.md: height, radius, text and icon per shadcn `size`. */
export const controlSize = tv({
	variants: {
		size: {
			xs: "h-6 rounded-sm text-xs [&_svg]:size-3",
			sm: "h-8 rounded-md text-xs [&_svg]:size-3.5",
			default: "h-9 rounded-lg text-sm [&_svg]:size-4",
			lg: "h-10 rounded-lg text-sm [&_svg]:size-4.5",
			xl: "h-12 rounded-xl text-base [&_svg]:size-5",
		},
	},
	defaultVariants: { size: "default" },
});

export type ControlSize = NonNullable<VariantProps<typeof controlSize>["size"]>;

/** One frame for every field: hairline at rest, ring border plus a soft halo on focus or open. */
export const fieldFrame = tv({
	base: [
		"border border-input bg-(--field) text-foreground outline-none",
		"transition-[color,border-color,box-shadow] duration-(--duration-fast) ease-(--ease-ui-out) motion-reduce:transition-none",
		"hover:border-muted-foreground/60",
		"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
		"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
		"disabled:cursor-not-allowed disabled:opacity-50",
	],
});

/** iOS zooms the page into a focused field under 16px, so text entry reads 16px below `md`. */
export const fieldText = tv({
	variants: {
		size: {
			xs: "text-base md:text-xs",
			sm: "text-base md:text-xs",
			default: "text-base md:text-sm",
			lg: "text-base md:text-sm",
			xl: "text-base",
		},
	},
	defaultVariants: { size: "default" },
});
