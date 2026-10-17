import { tv, type VariantProps } from "tailwind-variants";

export const statusMonitor = tv({
	slots: {
		root: "mx-auto w-full min-w-52 max-w-3xl",
		inner: "mx-auto flex flex-col gap-3",
		header: "flex items-center justify-between gap-3 text-sm",
		title: "font-semibold text-foreground",
		uptime: "font-medium text-muted-foreground tabular-nums",
		bars: "grid gap-0.5",
		bar: "h-full w-[5px] outline-none transition-opacity first:rounded-l-sm last:rounded-r-sm hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none",
		footer: "flex justify-between text-muted-foreground text-xs",
		tip: "flex max-w-60 flex-col gap-1 p-1 text-sm",
		tipHead: "flex items-center gap-2 font-semibold",
		tipMeta: "text-background/65",
		tipInfo: "text-foreground/80 leading-snug",
	},
	variants: {
		size: {
			sm: { bars: "h-6" },
			default: { bars: "h-8" },
			lg: { bars: "h-10" },
		},
	},
	defaultVariants: { size: "default" },
});

export const statusTone = tv({
	slots: { bar: "", text: "" },
	variants: {
		status: {
			normal: { bar: "bg-success", text: "text-success-strong" },
			warning: { bar: "bg-warning", text: "text-warning-strong" },
			error: { bar: "bg-destructive", text: "text-destructive-strong" },
			empty: { bar: "bg-foreground/10", text: "text-muted-foreground" },
		},
	},
	defaultVariants: { status: "empty" },
});

export type StatusMonitorSize = NonNullable<VariantProps<typeof statusMonitor>["size"]>;
export type StatusMonitorStatus = NonNullable<VariantProps<typeof statusTone>["status"]>;
