import { tv, type VariantProps } from "tailwind-variants";

export const fileUpload = tv({
	slots: {
		root: "flex w-full min-w-0 flex-col gap-3",
		zone: [
			"group/zone relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-border border-dashed bg-background text-center outline-none",
			"transition-[border-color,background-color] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"hover:border-border-strong hover:bg-foreground/[0.03] focus-visible:ring-2 focus-visible:ring-ring",
			"data-[dragging=true]:border-foreground/40 data-[dragging=true]:bg-foreground/[0.05]",
			"disabled:cursor-not-allowed disabled:opacity-50",
			// A refused drop shakes the zone, the same shake InputOTP uses.
			"data-[nudge=true]:animate-[otp-shake_240ms_ease-in-out] motion-reduce:animate-none",
			"transition-[padding,border-color,background-color] data-[compact=true]:flex-row data-[compact=true]:py-2.5",
		],
		zoneIcon:
			"flex items-center justify-center transition-[scale,opacity] duration-(--duration-fast) group-data-[compact=true]/zone:size-6 group-data-[compact=true]/zone:shadow-none rounded-full border border-border bg-background text-muted-foreground shadow-sm dark:bg-muted [&_svg]:size-4",
		zoneTitle: "font-medium text-foreground",
		zoneHint: "text-muted-foreground text-xs group-data-[compact=true]/zone:hidden",
		list: "flex flex-col gap-2",
		// Rows open from 0fr on arrival, so the list grows instead of jumping.
		item: "grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) starting:grid-rows-[0fr] starting:opacity-0 motion-reduce:transition-none",
		row: "flex min-h-0 min-w-0 items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-2.5",
		thumb:
			"flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background text-muted-foreground [&_svg]:size-4",
		thumbImage: "size-full object-cover",
		body: "flex min-w-0 flex-1 flex-col gap-1.5",
		line: "flex min-w-0 items-baseline justify-between gap-3 text-sm",
		name: "min-w-0 truncate font-medium text-foreground",
		meta: "shrink-0 text-muted-foreground text-xs tabular-nums",
		track: "h-1 w-full overflow-hidden rounded-full bg-foreground/[0.08]",
		bar: "h-full origin-left rounded-full bg-foreground transition-[scale] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none data-[status=error]:bg-[var(--destructive)] data-[status=done]:bg-[var(--success)]",
		actions: "flex shrink-0 items-center gap-1",
	},
	variants: {
		size: {
			sm: {
				zone: "px-4 py-5 text-sm",
				zoneIcon: "size-8",
				thumb: "size-9",
			},
			default: {
				zone: "px-6 py-8 text-sm",
				zoneIcon: "size-10",
				thumb: "size-11",
			},
		},
	},
	defaultVariants: { size: "default" },
});

export type FileUploadSize = NonNullable<VariantProps<typeof fileUpload>["size"]>;
