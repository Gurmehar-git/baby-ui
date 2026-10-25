import { tv, type VariantProps } from "tailwind-variants";

/** Cards share one grid cell; once measured, the ones behind peek out below the front card.
 * `elevated` lifts each card with a soft shadow; `flat` keeps hairlines on the grey card step. */
export const notificationStack = tv({
	slots: {
		root: [
			"relative grid w-full max-w-95 text-foreground outline-none",
			"transition-[height] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
		],
		item: [
			"relative col-start-1 row-start-1 self-start overflow-hidden rounded-2xl border border-border",
			"origin-bottom transition-[translate,scale,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) motion-reduce:transition-none",
			"data-[behind]:*:opacity-0 *:transition-opacity *:duration-(--duration-base)",
			"data-[leaving]:absolute data-[leaving]:inset-x-0 data-[leaving]:top-0 data-[leaving]:translate-x-10 data-[leaving]:scale-98 data-[leaving]:opacity-0 data-[leaving]:duration-(--duration-exit)",
		],
		pattern: [
			"pointer-events-none absolute top-0 right-0 h-40 w-55 fill-none stroke-border [stroke-width:1]",
			"mask-[radial-gradient(120%_110%_at_100%_0%,black_20%,transparent_70%)]",
		],
		patternDot: "fill-muted-foreground/40 stroke-none",
		patternFill: "fill-muted stroke-none",
		body: "relative px-5 pt-4.5 pb-5",
		header: "mb-3.5 flex min-h-6.5 items-center justify-between gap-3",
		badge: "uppercase tracking-wider",
		dismiss: [
			"-me-1.5 grid size-7 place-items-center rounded-lg text-muted-foreground outline-none [&_svg]:size-4",
			"transition-[background-color,color,scale] duration-(--duration-fast) hover:bg-foreground/[0.06] hover:text-foreground active:scale-(--press-scale-icon) focus-visible:ring-2 focus-visible:ring-ring",
		],
		title: "m-0 font-semibold text-base tracking-tight",
		description: "m-0 mt-1.5 text-muted-foreground text-sm leading-relaxed",
		actions: "mt-4 flex items-center gap-2",
		empty: [
			"col-start-1 row-start-1 m-0 grid grid-rows-[0fr] text-center text-muted-foreground text-sm opacity-0",
			"transition-[grid-template-rows,opacity] duration-(--duration-collapse) data-[shown]:grid-rows-[1fr] data-[shown]:opacity-100 motion-reduce:transition-none",
		],
		emptyClip: "min-h-0 overflow-hidden",
		emptyText: "block py-6",
	},
	variants: {
		variant: {
			elevated: {
				item: "bg-background shadow-surface dark:bg-popover",
			},
			flat: { item: "bg-card" },
		},
	},
	defaultVariants: { variant: "elevated" },
});

export type NotificationStackVariant = NonNullable<
	VariantProps<typeof notificationStack>["variant"]
>;

export const NOTIFICATION_PATTERN_NAMES = ["orbit", "grid", "rays"] as const;
export type NotificationPatternName = (typeof NOTIFICATION_PATTERN_NAMES)[number];
