import { tv, type VariantProps } from "tailwind-variants";

export const morphingModal = tv({
	slots: {
		trigger:
			"cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
		dialog: "morph-dialog m-auto bg-transparent p-0 text-foreground backdrop:bg-black/40",
		panel: "overflow-hidden rounded-2xl border border-border bg-popover p-6 shadow-2xl",
		header: "flex items-start justify-between gap-4",
		title: "font-medium text-foreground text-lg",
		close:
			"rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
		body: "mt-3 text-muted-foreground text-sm",
	},
	variants: {
		size: {
			sm: { panel: "w-[min(24rem,calc(100vw-2rem))]" },
			default: { panel: "w-[min(32rem,calc(100vw-2rem))]" },
			lg: { panel: "w-[min(40rem,calc(100vw-2rem))]" },
		},
	},
	defaultVariants: { size: "default" },
});

export type MorphingModalSize = NonNullable<VariantProps<typeof morphingModal>["size"]>;
