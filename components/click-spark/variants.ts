import { tv, type VariantProps } from "tailwind-variants";

/** The canvas's text colour is the spark colour, so theme changes follow without props. */
export const clickSpark = tv({
	base: "pointer-events-none size-full",
	variants: {
		tone: {
			foreground: "text-foreground",
			primary: "text-primary",
			muted: "text-muted-foreground",
		},
		scope: {
			page: "click-spark-page fixed inset-0 z-[9999]",
			parent: "absolute inset-0",
		},
	},
	defaultVariants: { tone: "foreground", scope: "page" },
});

export type ClickSparkTone = NonNullable<VariantProps<typeof clickSpark>["tone"]>;
export type ClickSparkScope = NonNullable<VariantProps<typeof clickSpark>["scope"]>;
