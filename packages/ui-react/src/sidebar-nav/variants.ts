import { tv, type VariantProps } from "tailwind-variants";

export const sidebarNav = tv({
	variants: {
		size: {
			sm: "w-46",
			default: "w-56",
			lg: "w-64",
		},
	},
	defaultVariants: { size: "default" },
});

export type SidebarNavSize = NonNullable<VariantProps<typeof sidebarNav>["size"]>;
