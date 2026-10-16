import { tv, type VariantProps } from "tailwind-variants";

export const statCardMap = tv({
	slots: {
		root: "relative w-full gap-0 overflow-hidden py-0",
		header:
			"pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 bg-linear-to-b from-45% from-card to-transparent px-4 pt-3 pb-10",
		headline: "flex flex-col gap-0.5",
		title: "font-medium text-muted-foreground text-sm",
		label: "text-muted-foreground text-xs",
		body: "p-0",
	},
	variants: {
		size: {
			sm: { body: "h-64" },
			default: { body: "h-96" },
			lg: { body: "h-[32rem]" },
		},
	},
	defaultVariants: { size: "default" },
});

export type StatCardMapSize = NonNullable<VariantProps<typeof statCardMap>["size"]>;
