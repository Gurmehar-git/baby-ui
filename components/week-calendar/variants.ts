import { tv, type VariantProps } from "tailwind-variants";

const focusRing =
	"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const weekCalendar = tv({
	slots: {
		root: "w-full max-w-[21rem] select-none rounded-2xl px-4 pt-4 pb-2 text-foreground",
		header: "mb-2.5 flex items-center justify-between gap-2",
		titleGroup: "flex min-w-0 items-center gap-2",
		titleClip: "grid min-w-0 overflow-hidden",
		title: "col-start-1 row-start-1 truncate font-semibold text-base tracking-tight",
		today: `shrink-0 rounded-full bg-foreground/[0.06] px-2.5 py-1 font-semibold text-xs transition-[opacity,scale,background-color] duration-(--duration-press) ease-(--ease-ui-out) hover:bg-foreground/[0.1] active:scale-90 data-[hidden]:pointer-events-none data-[hidden]:scale-80 data-[hidden]:opacity-0 motion-reduce:transition-none ${focusRing}`,
		nav: "flex shrink-0 items-center gap-0.5",
		navButton: `flex size-7 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,scale] duration-(--duration-press) ease-(--ease-ui-out) hover:bg-accent hover:text-accent-foreground active:scale-[0.82] motion-reduce:transition-none ${focusRing}`,
		weekdays: "grid grid-cols-7 px-0.5 pb-1",
		weekday:
			"text-center font-semibold text-xs text-muted-foreground uppercase tracking-wide",
		viewport:
			"relative touch-pan-y transition-[translate,rotate] duration-(--duration-overlay) ease-(--ease-ui-out) data-[dragging]:transition-none motion-reduce:transition-none",
		stage: "grid",
		body: "col-start-1 row-start-1 flex flex-col",
		row: "grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-overlay) ease-(--ease-ui-out) [transition-delay:var(--row-delay,0ms)] data-[collapsed]:grid-rows-[0fr] data-[collapsed]:opacity-0 motion-reduce:transition-none",
		rowClip: "overflow-hidden",
		cells: "relative grid grid-cols-7 [container-type:inline-size]",
		pill: "pop-in pointer-events-none absolute top-1.5 left-0 size-9 translate-x-[calc(var(--col)*100cqw/7+(100cqw/7-2.25rem)/2)] rounded-full bg-primary shadow-sm transition-[translate] duration-(--duration-overlay) ease-(--ease-ui-out) motion-reduce:transition-none",
		day: `group relative flex h-12 items-center justify-center rounded-full ${focusRing}`,
		dayFace:
			"relative flex size-9 items-center justify-center rounded-full font-medium text-sm tabular-nums transition-[background-color,color,scale] duration-(--duration-press) ease-(--ease-ui-out) group-hover:scale-[1.06] group-active:scale-[0.86] motion-reduce:transition-none",
		handleBar: "flex justify-center pt-1.5 pb-0.5",
		handle: `h-[5px] w-9 cursor-grab touch-none rounded-full bg-border transition-[background-color,scale] duration-(--duration-press) ease-(--ease-ui-out) hover:scale-x-115 hover:bg-muted-foreground/40 active:scale-x-130 active:cursor-grabbing motion-reduce:transition-none ${focusRing}`,
		srOnly: "sr-only",
	},
	variants: {
		variant: {
			card: { root: "border border-border bg-card shadow-sm" },
			plain: { root: "bg-transparent" },
		},
		tone: {
			selected: { dayFace: "font-semibold text-primary-foreground" },
			today: { dayFace: "font-semibold text-primary ring-[1.5px] ring-primary" },
			default: { dayFace: "group-hover:bg-accent" },
			outside: { dayFace: "text-muted-foreground group-hover:bg-accent" },
		},
	},
	defaultVariants: { variant: "card", tone: "default" },
});

export type WeekCalendarVariant = NonNullable<
	VariantProps<typeof weekCalendar>["variant"]
>;
export type WeekCalendarDayTone = NonNullable<VariantProps<typeof weekCalendar>["tone"]>;

/** Overridable copy; every string defaults to English. */
export type WeekCalendarLabels = {
	today: string;
	previousWeek: string;
	nextWeek: string;
	previousMonth: string;
	nextMonth: string;
	expand: string;
	collapse: string;
	selected: (date: string) => string;
	none: string;
};

export const WEEK_CALENDAR_LABELS: WeekCalendarLabels = {
	today: "Today",
	previousWeek: "Previous week",
	nextWeek: "Next week",
	previousMonth: "Previous month",
	nextMonth: "Next month",
	expand: "Expand to month view",
	collapse: "Collapse to week view",
	selected: (date) => `Selected ${date}`,
	none: "No date selected",
};

/** Swipe: 55% elastic follow, 3.5deg of tilt per 120px, 45px or 350px/s commits. */
export const SWIPE = {
	elastic: 0.55,
	tiltDeg: 3.5,
	tiltRange: 120,
	distance: 45,
	velocity: 350,
};
export const ROW_STAGGER_MS = 45;
export const HANDLE_DRAG_PX = 8;
