import { tv, type VariantProps } from "tailwind-variants";

export const flowchartCanvas = tv({
	base: "relative w-full select-none overflow-hidden rounded-2xl bg-background shadow-xs",
	variants: {
		background: {
			dots: "[background-image:radial-gradient(var(--border)_1px,transparent_1.25px)] [background-size:22px_22px] [background-position:center]",
			grid: "[background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:22px_22px] [background-position:center]",
			none: "",
		},
	},
	defaultVariants: { background: "dots" },
});

export type FlowchartBackground = NonNullable<
	VariantProps<typeof flowchartCanvas>["background"]
>;
