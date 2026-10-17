import { tv, type VariantProps } from "tailwind-variants";

// CSS holds each pane's limits until an interaction frees it; transitions pause while a divider
// follows the pointer and resume for snaps, releases and keyboard steps.
export const resizable = tv({
	slots: {
		group:
			"@container flex size-full min-h-0 min-w-0 overflow-hidden data-[resizing=true]:cursor-col-resize data-[resizing=true]:select-none",
		panel: [
			"group/panel relative flex min-h-0 min-w-(--panel-min) max-w-(--panel-max) shrink basis-0 overflow-hidden first:not-only:justify-end",
			"transition-[flex-grow] duration-(--duration-collapse) ease-(--ease-out-quart) motion-reduce:transition-none",
			"[[data-resizing=true]:not([data-gliding=true])>&]:transition-none",
			"data-[collapsed=true]:min-w-0 data-[collapsed=true]:max-w-none data-[free]:min-w-0 data-[free]:max-w-none",
		],
		content: [
			"flex min-h-0 w-full flex-none flex-col opacity-(--resizable-fade,1) transition-opacity duration-(--duration-fast)",
			"group-data-[collapsed=true]/panel:min-w-(--panel-min) group-data-[free]/panel:min-w-(--panel-min) in-data-[resizing=true]:pointer-events-none",
		],
		handle: [
			"group/handle relative z-2 flex-[0_0_1px] cursor-col-resize touch-none bg-border outline-none transition-colors duration-(--duration-fast)",
			"before:absolute before:inset-y-0 before:-inset-x-1.5 hover:bg-border-strong data-[active]:bg-border-strong",
			"data-[collapsed=before]:cursor-pointer data-[collapsed=before]:bg-transparent data-[collapsed=before]:before:right-[-30px] data-[collapsed=before]:before:left-0",
			"data-[collapsed=after]:cursor-pointer data-[collapsed=after]:bg-transparent data-[collapsed=after]:before:right-0 data-[collapsed=after]:before:left-[-30px]",
		],
		grip: [
			"pointer-events-none absolute top-1/2 left-1/2 h-8 w-1 -translate-1/2 scale-y-60 rounded-full bg-border-strong opacity-0 transition-[opacity,scale,background-color] duration-(--duration-fast)",
			"group-hover/handle:scale-y-100 group-hover/handle:opacity-100 group-focus-visible/handle:scale-y-100 group-focus-visible/handle:opacity-100",
			"group-data-[active]/handle:scale-y-100 group-data-[active]/handle:bg-foreground group-data-[active]/handle:opacity-100",
			"group-data-[collapsed=before]/handle:hidden group-data-[collapsed=after]/handle:hidden",
		],
		restore: [
			"pointer-events-none absolute top-1/2 -mt-5 hidden h-10 w-4.5 place-items-center rounded-full border bg-background text-muted-foreground shadow-xs [&_svg]:size-3.5",
			"group-hover/handle:border-border-strong group-hover/handle:text-foreground group-focus-visible/handle:border-border-strong group-focus-visible/handle:text-foreground",
			"starting:scale-60 starting:opacity-0 transition-[scale,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy)",
		],
		before: "left-1.25 origin-left group-data-[collapsed=before]/handle:grid",
		after: "right-1.25 origin-right group-data-[collapsed=after]/handle:grid",
	},
	variants: {
		variant: {
			default: {},
			bordered: { group: "rounded-xl border bg-background" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type ResizableVariant = NonNullable<VariantProps<typeof resizable>["variant"]>;
