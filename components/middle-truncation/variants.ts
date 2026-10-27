import { tv, type VariantProps } from "tailwind-variants";

export const middleTruncation = tv({
	base: "block min-w-0 overflow-hidden whitespace-nowrap",
	variants: {
		variant: {
			default: "",
			code: "font-mono text-sm tabular-nums",
		},
	},
	defaultVariants: { variant: "default" },
});

export type MiddleTruncationVariant = NonNullable<
	VariantProps<typeof middleTruncation>["variant"]
>;
