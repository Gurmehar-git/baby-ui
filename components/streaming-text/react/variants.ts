import { tv, type VariantProps } from "tailwind-variants";

export const streamingText = tv({
	slots: {
		root: "flex w-full flex-col",
		text: "text-foreground",
	},
	variants: {
		layout: {
			inline: { root: "" },
			card: { root: "rounded-xl border border-border bg-card p-4" },
		},
		size: {
			sm: { text: "text-xs leading-normal" },
			default: { text: "text-sm leading-relaxed" },
			lg: { text: "text-base leading-relaxed" },
		},
	},
	defaultVariants: { layout: "inline", size: "default" },
});

export type StreamingTextSize = NonNullable<VariantProps<typeof streamingText>["size"]>;

export type StreamingTextLayout = NonNullable<
	VariantProps<typeof streamingText>["layout"]
>;
