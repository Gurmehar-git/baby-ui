import { tv, type VariantProps } from "tailwind-variants";

export const contextChunkBadge = tv({
	base: "flex size-3.5 items-center justify-center rounded-[4px] font-bold text-[7px] text-white",
	variants: {
		tone: {
			destructive: "bg-destructive",
			success: "bg-success",
			warning: "bg-warning",
		},
	},
	defaultVariants: { tone: "success" },
});

export type ContextChunkTone = NonNullable<
	VariantProps<typeof contextChunkBadge>["tone"]
>;
