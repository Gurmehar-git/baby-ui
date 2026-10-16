import { tv, type VariantProps } from "tailwind-variants";

// The chevron segment reads as part of the button: a hairline divides the two in filled variants.
export const splitButton = tv({
	slots: {
		main: "",
		menu: "px-2 [&_svg]:transition-[rotate] [&_svg]:duration-(--duration-fast) data-popup-open:[&_svg]:rotate-180 data-[state=open]:[&_svg]:rotate-180 motion-reduce:[&_svg]:transition-none",
		item: "justify-start gap-2 [&_svg]:size-4",
	},
	variants: {
		variant: {
			default: { menu: "border-l border-l-primary-foreground/20" },
			secondary: { menu: "border-l border-l-foreground/10" },
			outline: {},
		},
		size: {
			sm: {},
			default: {},
			lg: {},
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type SplitButtonVariant = NonNullable<VariantProps<typeof splitButton>["variant"]>;
export type SplitButtonSize = NonNullable<VariantProps<typeof splitButton>["size"]>;
