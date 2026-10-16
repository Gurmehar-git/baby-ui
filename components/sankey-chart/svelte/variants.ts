import { tv, type VariantProps } from "tailwind-variants";

export const sankeyChart = tv({
	slots: {
		link: "cursor-pointer fill-none outline-none",
		node: "cursor-pointer [transform-box:fill-box] [transform-origin:center]",
		name: "pointer-events-none fill-foreground font-medium text-xs",
		value: "pointer-events-none fill-muted-foreground text-xs tabular-nums",
	},
	variants: {
		orientation: {
			horizontal: {},
			vertical: { name: "text-xs" },
		},
		linkColor: {
			source: {},
			target: {},
			gradient: {},
		},
	},
	defaultVariants: { orientation: "horizontal", linkColor: "gradient" },
});

export type SankeyOrientation = NonNullable<
	VariantProps<typeof sankeyChart>["orientation"]
>;
export type SankeyLinkColor = NonNullable<VariantProps<typeof sankeyChart>["linkColor"]>;
