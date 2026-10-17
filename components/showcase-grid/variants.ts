import { tv, type VariantProps } from "tailwind-variants";

export const showcaseGrid = tv({
	slots: {
		root: "relative isolate grid w-full grid-cols-1 border-border border-t border-l md:grid-cols-12",
		rules: "pointer-events-none absolute inset-0 -z-10 hidden",
		rule: "absolute block bg-muted-foreground/40",
		hatch:
			"absolute block size-6 bg-[repeating-linear-gradient(45deg,color-mix(in_oklch,var(--muted-foreground)_40%,transparent)_0,color-mix(in_oklch,var(--muted-foreground)_40%,transparent)_1px,transparent_0,transparent_50%)] bg-size-[5px_5px] opacity-80",
	},
	variants: {
		frame: {
			rulers: { rules: "md:block" },
			plain: {},
		},
	},
	defaultVariants: { frame: "rulers" },
});

export const showcasePanel = tv({
	slots: {
		root: "group/panel relative col-span-full flex min-h-60 min-w-0 flex-col border-border border-r border-b bg-background md:min-h-75",
		dot: "pointer-events-none absolute z-3 size-2 rounded-full border border-border bg-background md:size-2.5",
		content:
			"relative z-2 flex flex-1 items-center justify-center p-4 md:absolute md:inset-0 md:overflow-hidden md:p-5",
		actions:
			"absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-0 transition-opacity duration-(--duration-fast) group-focus-within/panel:opacity-100 group-hover/panel:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none",
	},
	variants: {
		span: {
			3: { root: "md:col-span-3" },
			4: { root: "md:col-span-4" },
			5: { root: "md:col-span-5" },
			6: { root: "md:col-span-6" },
			7: { root: "md:col-span-7" },
			8: { root: "md:col-span-8" },
			9: { root: "md:col-span-9" },
			12: { root: "md:col-span-12" },
		},
	},
	defaultVariants: { span: 12 },
});

export type ShowcaseFrame = NonNullable<VariantProps<typeof showcaseGrid>["frame"]>;
export type ShowcaseSpan = NonNullable<VariantProps<typeof showcasePanel>["span"]>;

// Centred on the grid lines: the panel's own right/bottom border and its neighbours' on top/left.
export const DOT_CORNERS = [
	"top-[-0.5px] left-[-0.5px] -translate-x-1/2 -translate-y-1/2",
	"top-[-0.5px] right-[-0.5px] translate-x-1/2 -translate-y-1/2",
	"bottom-[-0.5px] left-[-0.5px] -translate-x-1/2 translate-y-1/2",
	"right-[-0.5px] bottom-[-0.5px] translate-x-1/2 translate-y-1/2",
];

/** Corner ruler ticks and hatch squares drawn outside the grid by the `rulers` frame. */
export const RULE_MARKS = [
	"-top-8 left-0 h-10 w-px",
	"top-0 -left-8 h-px w-10",
	"-top-8 right-0 h-10 w-px",
	"top-0 -right-8 h-px w-10",
	"-bottom-8 left-0 h-10 w-px",
	"bottom-0 -left-8 h-px w-10",
	"right-0 -bottom-8 h-10 w-px",
	"-right-8 bottom-0 h-px w-10",
];
export const HATCH_MARKS = ["-top-8 -right-8", "-bottom-8 -left-8"];
