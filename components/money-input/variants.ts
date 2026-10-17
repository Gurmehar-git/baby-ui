import { tv, type VariantProps } from "tailwind-variants";

export const moneyInput = tv({
	slots: {
		root: "flex w-full flex-col gap-2",
		symbol: "min-w-4 font-medium text-muted-foreground tabular-nums",
		// Typing past `max` is refused with InputOTP's shake.
		input:
			"text-right tabular-nums data-[nudge=true]:animate-[otp-shake_240ms_ease-in-out] motion-reduce:animate-none",
		currency:
			"h-7 w-auto gap-1 border-0 bg-transparent px-1.5 font-medium shadow-none hover:bg-muted",
		chips: "flex flex-wrap gap-1.5",
		message:
			"text-xs data-[tone=error]:text-destructive data-[tone=hint]:text-muted-foreground",
	},
	variants: {
		variant: {
			default: {},
			// The amount reads left to right, like a plain number field.
			start: { input: "text-left" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type MoneyInputVariant = NonNullable<VariantProps<typeof moneyInput>["variant"]>;
