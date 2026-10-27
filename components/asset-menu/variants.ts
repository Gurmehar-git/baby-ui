import { tv, type VariantProps } from "tailwind-variants";

export const assetMenu = tv({
	slots: {
		content: "w-64",
		item: "gap-2.5",
		preview:
			"grid size-5 shrink-0 place-items-center text-muted-foreground [&_svg]:size-4",
	},
	variants: {
		variant: {
			default: {},
			compact: {
				content: "w-52",
				item: "text-xs",
				preview: "size-4 [&_svg]:size-3.5",
			},
		},
	},
	defaultVariants: { variant: "default" },
});

export type AssetMenuVariant = NonNullable<VariantProps<typeof assetMenu>["variant"]>;
