import { tv, type VariantProps } from "tailwind-variants";

export const question = tv({
	slots: {
		root: "flex w-full flex-col gap-1",
	},
	variants: {
		layout: {
			card: { root: "rounded-2xl border border-border bg-card p-4" },
			inline: { root: "" },
		},
	},
	defaultVariants: { layout: "card" },
});

export type QuestionLayout = NonNullable<VariantProps<typeof question>["layout"]>;
