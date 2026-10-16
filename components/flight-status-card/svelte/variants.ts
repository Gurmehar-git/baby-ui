import { tv, type VariantProps } from "tailwind-variants";
import type { BadgeVariant } from "../../badge/svelte/variants";
import type { FlightStatus } from "./types";

export const flightStatusCard = tv({
	slots: {
		root: "@container w-full max-w-xl overflow-hidden",
		top: "grid gap-4 @xl:grid-cols-[1fr_auto] @xl:items-start",
		route: "grid grid-cols-[1fr_auto_1fr] items-start gap-3",
		endpoint: "flex min-w-0 flex-col gap-1",
		code: "flex h-8 items-center gap-1.5 @xl:h-10",
		char: "flight-status-char h-full w-auto",
		dotOn: "",
		dotOff: "opacity-15",
		city: "mt-1 truncate font-medium text-foreground text-sm",
		time: "truncate text-muted-foreground text-xs uppercase tracking-wide tabular-nums",
		arrow: "mt-2 size-5 shrink-0 @xl:mt-3",
		eta: "flex flex-col gap-0.5 rounded-xl border border-border p-3 @xl:min-w-36",
		etaValue: "font-semibold text-foreground text-sm tabular-nums",
		etaNote: "text-muted-foreground text-xs",
		event: "mt-1 font-semibold text-xs uppercase tracking-wide",
		track:
			"relative h-11 overflow-hidden rounded-full border border-border bg-background",
		reveal: "flight-status-reveal absolute inset-0",
		fill: "flex h-full min-w-11 items-center justify-end rounded-full pr-1.5 transition-[width] duration-700 ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		plane:
			"flex size-8 items-center justify-center rounded-full bg-background/25 [&_svg]:size-5",
		remaining:
			"pointer-events-none absolute inset-y-0 right-4 flex items-center font-medium font-mono text-muted-foreground text-sm tabular-nums",
	},
	variants: {
		tone: {
			neutral: {
				dotOn: "fill-foreground",
				dotOff: "fill-foreground",
				arrow: "text-foreground",
				event: "text-foreground",
				fill: "bg-foreground text-background",
			},
			info: {
				dotOn: "fill-info",
				dotOff: "fill-info",
				arrow: "text-info-strong",
				event: "text-info-strong",
				fill: "bg-info text-background",
			},
			success: {
				dotOn: "fill-success",
				dotOff: "fill-success",
				arrow: "text-success-strong",
				event: "text-success-strong",
				fill: "bg-success text-background",
			},
			warning: {
				dotOn: "fill-warning",
				dotOff: "fill-warning",
				arrow: "text-warning-strong",
				event: "text-warning-strong",
				fill: "bg-warning text-background",
			},
			destructive: {
				dotOn: "fill-destructive",
				dotOff: "fill-destructive",
				arrow: "text-destructive-strong",
				event: "text-destructive-strong",
				fill: "bg-destructive text-background",
			},
		},
		display: {
			matrix: {},
			text: {
				code: "font-mono font-semibold text-3xl text-foreground tracking-widest @xl:text-4xl",
			},
		},
	},
	defaultVariants: { tone: "neutral", display: "matrix" },
});

export type FlightStatusTone = NonNullable<VariantProps<typeof flightStatusCard>["tone"]>;
export type FlightStatusDisplay = NonNullable<
	VariantProps<typeof flightStatusCard>["display"]
>;

/** Default tone per status; the `tone` prop overrides it. */
export const FLIGHT_STATUS_TONE: Record<FlightStatus, FlightStatusTone> = {
	scheduled: "neutral",
	boarding: "info",
	departed: "info",
	delayed: "warning",
	landed: "success",
	cancelled: "destructive",
};

export const FLIGHT_TONE_BADGE: Record<FlightStatusTone, BadgeVariant> = {
	neutral: "secondary",
	info: "info",
	success: "success",
	warning: "warning",
	destructive: "destructive",
};
