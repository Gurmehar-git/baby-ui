import { tv, type VariantProps } from "tailwind-variants";

// Each li carries data-status, data-current and data-filled; --st-delay staggers a multi-step jump.
const RISE =
	"transition-[opacity,translate,filter] duration-(--duration-base) ease-(--ease-ui-out) in-data-ready:starting:translate-y-[0.3em] in-data-ready:starting:opacity-0 in-data-ready:starting:blur-[2px] motion-reduce:transition-none";
const GLYPH =
	"col-start-1 row-start-1 grid place-items-center transition-[scale,opacity,filter] delay-(--st-delay) duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none";
const HIDDEN = "scale-50 opacity-0 blur-[2px]";

export const stepper = tv({
	slots: {
		root: "group/stepper min-w-0 text-foreground [--st-halo:4px] [--st-marker:--spacing(7)]",
		list: "grid list-none p-0",
		item: "group/step relative min-w-0",
		head: "group/head grid rounded-lg text-start outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background data-[clickable]:cursor-pointer",
		marker: "relative grid size-(--st-marker) flex-none place-items-center",
		ring: [
			"absolute -inset-(--st-halo) rounded-full bg-primary/12 transition-[scale,opacity] delay-(--st-ring) duration-(--duration-spring-snappy) ease-(--ease-spring-snappy)",
			"scale-60 opacity-0 group-data-[current]/step:scale-100 group-data-[current]/step:opacity-100 group-data-[status=error]/step:bg-destructive/16 motion-reduce:transition-none",
		],
		disc: [
			"relative grid size-full place-items-center rounded-full bg-background font-medium text-muted-foreground text-xs tabular-nums inset-ring inset-ring-border-strong",
			"transition-[background-color,box-shadow,color,scale] duration-(--duration-base) group-active/head:scale-92 motion-reduce:transition-none",
			"group-data-[status=current]/step:text-foreground group-data-[status=current]/step:inset-ring-[1.5px] group-data-[status=current]/step:inset-ring-primary",
			"group-data-[status=complete]/step:bg-primary group-data-[status=complete]/step:text-primary-foreground group-data-[status=complete]/step:inset-ring-primary",
			"group-data-[status=error]/step:bg-destructive/10 group-data-[status=error]/step:text-destructive group-data-[status=error]/step:inset-ring-[1.5px] group-data-[status=error]/step:inset-ring-destructive",
		],
		number: [
			GLYPH,
			"group-data-[status=complete]/step:scale-50 group-data-[status=complete]/step:opacity-0 group-data-[status=complete]/step:blur-[2px]",
			"group-data-[status=error]/step:scale-50 group-data-[status=error]/step:opacity-0 group-data-[status=error]/step:blur-[2px]",
		],
		check: [
			GLYPH,
			"size-3.5",
			HIDDEN,
			"group-data-[status=complete]/step:scale-100 group-data-[status=complete]/step:opacity-100 group-data-[status=complete]/step:blur-none",
		],
		alert: [
			GLYPH,
			"size-3.5",
			HIDDEN,
			"group-data-[status=error]/step:scale-100 group-data-[status=error]/step:opacity-100 group-data-[status=error]/step:blur-none",
		],
		draw: "transition-[stroke-dashoffset] delay-[calc(var(--st-delay)+40ms)] duration-(--duration-base) ease-(--ease-ui-out) [stroke-dasharray:1] [stroke-dashoffset:1] group-data-[status=complete]/step:[stroke-dashoffset:0] group-data-[status=error]/step:[stroke-dashoffset:0] motion-reduce:transition-none",
		connector: "pointer-events-none absolute overflow-hidden rounded-full bg-border",
		fill: "absolute inset-0 rounded-[inherit] bg-primary transition-[scale] delay-(--st-delay) duration-(--duration-collapse) ease-(--ease-out-quart) motion-reduce:transition-none",
		text: "grid min-w-0",
		label: [
			"block break-words font-medium text-muted-foreground text-sm leading-5 transition-colors duration-(--duration-base)",
			"group-data-[status=complete]/step:text-foreground/80 group-data-[status=current]/step:text-foreground group-data-[status=error]/step:text-foreground group-data-[clickable]/head:hover:text-foreground",
		],
		description: ["block break-words pt-0.5 text-muted-foreground text-xs", RISE],
		error: ["block break-words pt-0.5 text-destructive text-xs", RISE],
		caption: "mt-3 hidden",
		captionLabel: ["block font-medium text-sm leading-5", RISE],
	},
	variants: {
		orientation: {
			horizontal: {
				root: "@container/stepper w-full",
				list: "grid-cols-(--st-cols)",
				item: "not-last:pe-4",
				head: "w-fit max-w-full justify-items-start gap-y-3",
				connector:
					"start-[calc(var(--st-marker)+var(--st-halo)+--spacing(1))] end-[calc(var(--st-halo)+--spacing(1))] top-[calc(var(--st-marker)/2-1px)] h-0.5",
				fill: "origin-left scale-x-0 group-data-[filled]/step:scale-x-100 rtl:origin-right",
				text: "group-data-[compact]/stepper:sr-only @max-[30rem]/stepper:sr-only",
				caption: "group-data-[compact]/stepper:grid @max-[30rem]/stepper:grid",
			},
			vertical: {
				item: "not-last:pb-5 group-data-[compact]/stepper:not-last:pb-6",
				head: "w-full grid-cols-[var(--st-marker)_minmax(0,1fr)] items-start gap-x-3 group-data-[compact]/stepper:grid-cols-[var(--st-marker)] group-data-[compact]/stepper:gap-x-0",
				connector:
					"start-[calc(var(--st-marker)/2-1px)] top-[calc(var(--st-marker)+var(--st-halo)+2px)] bottom-[calc(var(--st-halo)+2px)] w-0.5",
				fill: "origin-top scale-y-0 group-data-[filled]/step:scale-y-100",
				text: "pt-1 group-data-[compact]/stepper:sr-only",
			},
		},
	},
	defaultVariants: { orientation: "horizontal" },
});

export type StepperOrientation = NonNullable<VariantProps<typeof stepper>["orientation"]>;
