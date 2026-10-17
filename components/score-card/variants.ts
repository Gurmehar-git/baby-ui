import { tv, type VariantProps } from "tailwind-variants";

export const scoreCard = tv({
	slots: {
		root: "w-full gap-0 overflow-hidden py-0",
		header: "gap-0.5 px-5 pt-4 pb-1",
		title: "font-medium text-muted-foreground text-sm",
		description: "text-muted-foreground text-xs",
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
