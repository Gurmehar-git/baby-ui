import { tv, type VariantProps } from "tailwind-variants";

// Rows fold with grid-template-rows, so filtering, dismissing and clearing never pop the panel's height.
const FOLD =
	"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] delay-(--nc-delay,0s) duration-(--duration-collapse) ease-(--ease-out-quad) data-[on=false]:grid-rows-[0fr] data-[on=false]:opacity-0 motion-reduce:transition-none";

export const notificationCenter = tv({
	slots: {
		trigger: "relative",
		bell: "transition-[rotate] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) group-data-[popup-open]/nc:-rotate-12 group-data-[state=open]/nc:-rotate-12 motion-reduce:transition-none",
		badge: [
			"absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-foreground px-1 font-medium text-[11px] text-background tabular-nums",
			"transition-[scale,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) data-[on=false]:scale-60 data-[on=false]:opacity-0 motion-reduce:transition-none",
		],
		panel:
			"flex max-h-[min(36rem,calc(100vh-1.5rem))] w-[min(26.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden p-0",
		header: "flex items-start justify-between gap-3 px-6 pt-5.5 pb-4 max-sm:px-4",
		heading: "flex items-center gap-2",
		title: "font-medium text-xl leading-tight max-sm:text-lg",
		count:
			"grid h-5.5 min-w-5.5 place-items-center rounded-md bg-muted px-1.5 text-muted-foreground text-xs tabular-nums",
		summary: "mt-1 text-muted-foreground text-xs",
		toolbar: "flex min-h-13 items-center justify-between gap-3 border-b px-5 pb-3",
		markAll: [
			"gap-1.5 text-muted-foreground hover:text-foreground",
			"transition-[opacity,filter,color] duration-(--duration-base) data-[on=false]:pointer-events-none data-[on=false]:opacity-0 data-[on=false]:blur-[2px]",
		],
		list: "min-h-0 overflow-y-auto overscroll-contain px-2.5 py-2 [scrollbar-width:none]",
		row: FOLD,
		clip: "min-h-0 overflow-clip [overflow-clip-margin:2px]",
		item: "rounded-xl p-2.5 transition-colors duration-(--duration-fast) hover:bg-muted data-[expanded]:bg-muted",
		main: "flex min-w-0 items-start gap-3",
		icon: "grid size-9 flex-none place-items-center data-[tone=info]:text-primary data-[tone=success]:text-success-strong data-[tone=warning]:text-warning-strong [&_svg]:size-4.5",
		avatar: "size-9 flex-none",
		toggle:
			"grid min-w-0 flex-1 gap-1 rounded-md pt-0.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
		itemTitle: "flex min-h-5 min-w-0 items-center gap-1.5",
		titleText:
			"truncate font-medium text-sm group-data-[read]/item:text-muted-foreground",
		dot: "size-1.5 flex-none rounded-full bg-foreground transition-[scale,opacity] delay-(--nc-delay,0s) duration-(--duration-fast) group-data-[read]/item:scale-30 group-data-[read]/item:opacity-0 motion-reduce:transition-none",
		preview: "truncate text-muted-foreground text-xs",
		time: "flex-none pt-1 text-muted-foreground text-xs tabular-nums",
		details: "pl-12 max-sm:pl-0",
		detailText: "my-3 text-muted-foreground text-xs",
		actions: "flex flex-wrap gap-1.5 pb-1",
		empty:
			"grid min-h-48 content-center justify-items-center px-3 py-5 text-center [&>svg]:mb-3 [&>svg]:size-6 [&>svg]:text-muted-foreground",
		emptyTitle: "font-medium text-sm",
		emptyText: "mt-1 text-muted-foreground text-xs",
		footer:
			"flex min-h-11.5 items-center justify-between gap-3 border-t px-5.5 py-2 text-muted-foreground text-xs",
	},
	variants: {
		size: {
			default: { trigger: "size-10.5 rounded-xl" },
			sm: { trigger: "size-9 rounded-lg" },
		},
	},
	defaultVariants: { size: "default" },
});

export type NotificationCenterSize = NonNullable<
	VariantProps<typeof notificationCenter>["size"]
>;
