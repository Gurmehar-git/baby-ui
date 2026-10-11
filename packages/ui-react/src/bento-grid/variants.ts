import { tv, type VariantProps } from "tailwind-variants";

/** Spans only apply from `md` up; below it every cell is one column wide. */
export const bentoCell = tv({
	base: [
		"group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5",
		"transition-[transform,scale,translate,border-color] duration-(--duration-base) ease-[var(--ease-ui-out)]",
		"hover:-translate-y-0.5 hover:border-ring motion-reduce:hover:translate-y-0",
	],
	variants: {
		span: {
			"1x1": "",
			"2x1": "md:col-span-2",
			"1x2": "md:row-span-2",
			"2x2": "md:col-span-2 md:row-span-2",
		},
	},
	defaultVariants: { span: "1x1" },
});

export type BentoSpan = NonNullable<VariantProps<typeof bentoCell>["span"]>;
