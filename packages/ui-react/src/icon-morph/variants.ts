import { tv, type VariantProps } from "tailwind-variants";

export const iconMorph = tv({
	// A liked heart takes `--icon-morph-like`, falling back to the destructive red.
	base: "block flex-none overflow-visible data-[name=heart]:transition-colors data-[name=heart]:duration-(--duration-fast) data-[name=heart]:data-[on=true]:text-(--icon-morph-like,var(--destructive))",
	variants: {
		size: {
			sm: "size-4",
			default: "size-5",
			lg: "size-6",
		},
	},
	defaultVariants: { size: "default" },
});

export type IconMorphSize = NonNullable<VariantProps<typeof iconMorph>["size"]>;
