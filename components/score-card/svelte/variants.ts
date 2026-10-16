import { tv, type VariantProps } from "tailwind-variants";

export const scoreCard = tv({
	slots: {
		root: "w-full gap-0 overflow-hidden py-0",
		header: "flex items-start justify-between gap-3 px-5 pt-4 pb-1",
		title: "font-medium text-muted-foreground text-sm",
		description: "mt-0.5 text-muted-foreground text-xs",
		body: "flex justify-center px-5 pb-5",
		gauge: "w-full",
	},
	variants: {
		size: {
			default: { gauge: "max-w-56" },
			lg: { gauge: "max-w-72" },
		},
	},
	defaultVariants: { size: "default" },
});

export type ScoreCardSize = NonNullable<VariantProps<typeof scoreCard>["size"]>;
