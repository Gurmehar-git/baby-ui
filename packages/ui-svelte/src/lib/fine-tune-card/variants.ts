import { tv, type VariantProps } from "tailwind-variants";

export const fineTuneCard = tv({
	slots: {
		root: "w-full overflow-hidden rounded-2xl border border-border bg-background shadow-md",
		header: "flex items-center justify-between border-border border-b px-4 py-2.5",
		title: "font-medium text-foreground text-sm",
		edited: "pop-in flex items-center gap-1.5 font-medium text-success-strong text-xs",
		adjust: "reasoning-shimmer font-medium text-xs",
	},
	variants: {
		size: {
			sm: { root: "max-w-60" },
			default: { root: "max-w-72" },
			lg: { root: "max-w-80" },
		},
	},
	defaultVariants: { size: "default" },
});

export type FineTuneCardSize = NonNullable<VariantProps<typeof fineTuneCard>["size"]>;
