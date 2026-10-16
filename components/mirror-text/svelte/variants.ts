import { tv, type VariantProps } from "tailwind-variants";

export const mirrorText = tv({
	slots: {
		root: "group/mirror relative inline-flex w-fit flex-col justify-end overflow-hidden text-foreground",
		layer: "transition-transform ease-[var(--ease-ui-out)]",
	},
	variants: {
		direction: {
			up: { layer: "group-hover/mirror:-translate-y-4" },
			down: { layer: "group-hover/mirror:translate-y-4" },
			left: { layer: "group-hover/mirror:-translate-x-4" },
			right: { layer: "group-hover/mirror:translate-x-4" },
		},
	},
	defaultVariants: { direction: "up" },
});

export type MirrorTextDirection = NonNullable<
	VariantProps<typeof mirrorText>["direction"]
>;
