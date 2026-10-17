import { tv, type VariantProps } from "tailwind-variants";

export const phoneInput = tv({
	slots: {
		root: "flex w-full flex-col gap-1.5",
		trigger:
			"h-7 w-auto gap-1.5 rounded-md border-0 bg-transparent px-1.5 font-medium shadow-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
		flag: "text-base leading-none",
		dial: "text-muted-foreground tabular-nums",
		item: "flex w-full items-center gap-2",
		itemDial: "ml-auto text-muted-foreground text-xs tabular-nums",
		input: "tabular-nums",
		message:
			"text-xs data-[tone=error]:text-destructive data-[tone=hint]:text-muted-foreground",
	},
	variants: {
		variant: {
			default: {},
			flag: { dial: "sr-only" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type PhoneInputVariant = NonNullable<VariantProps<typeof phoneInput>["variant"]>;
