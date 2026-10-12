import { tv, type VariantProps } from "tailwind-variants";

export const shortcutRecorder = tv({
	slots: {
		root: "flex w-full flex-col gap-1.5",
		row: "flex items-center gap-1.5",
		field: [
			"inline-flex min-w-40 flex-1 items-center gap-1 rounded-lg border border-input bg-(--field) px-2.5 text-left text-sm outline-none",
			"transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-border-strong focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20",
			"data-[recording=true]:border-ring data-[recording=true]:ring-3 data-[recording=true]:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
		],
		placeholder: "text-muted-foreground",
		hint: "ml-auto animate-pulse text-muted-foreground text-xs motion-reduce:animate-none",
		warning: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-warning-strong",
		action: "font-medium underline underline-offset-2",
	},
	variants: {
		size: {
			sm: { field: "h-8 text-xs" },
			default: { field: "h-9" },
			lg: { field: "h-10" },
		},
	},
	defaultVariants: { size: "default" },
});

export type ShortcutRecorderSize = NonNullable<
	VariantProps<typeof shortcutRecorder>["size"]
>;
