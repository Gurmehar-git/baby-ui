import { tv, type VariantProps } from "tailwind-variants";

// Folds on grid rows with its spacing inside the clip, so a hidden message takes no room.
const FOLD = [
	"grid grid-rows-[0fr] opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100",
	"transition-[grid-template-rows,opacity] duration-(--duration-base) ease-(--ease-ui-out) motion-reduce:transition-none",
];

export const magicLinkLogin = tv({
	slots: {
		root: "w-full text-foreground",
		aside: "hidden",
		panel: "flex min-w-0 flex-col gap-6",
		brand: "flex items-center gap-2 font-medium text-sm",
		views: "grid",
		view: "flex flex-col gap-6 [grid-area:1/1]",
		header: "flex flex-col gap-1.5",
		title: "font-semibold text-xl tracking-tight outline-none",
		description: "text-muted-foreground text-sm leading-relaxed",
		providers: "grid gap-2",
		provider: "w-full",
		divider:
			"flex items-center gap-3 text-muted-foreground text-xs before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
		form: "flex flex-col gap-3",
		field: "flex flex-col gap-1.5",
		fold: FOLD,
		clip: "min-h-0 overflow-hidden",
		error: "block text-destructive-strong text-xs leading-relaxed",
		submit: "w-full",
		sentIcon:
			"flex size-10 items-center justify-center rounded-full border border-border text-foreground [&_svg]:size-4.5",
		address: "break-all font-medium text-foreground",
		actions: "flex flex-col gap-2",
		resend: "flex flex-col",
		hint: "text-muted-foreground text-xs leading-relaxed",
		footer:
			"mt-6 flex flex-wrap items-center justify-between gap-2 border-border border-t pt-4",
		legal: [
			"text-muted-foreground text-xs leading-relaxed",
			"[&_a]:text-foreground [&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-2",
			"[&_a]:transition-[text-decoration-color] [&_a]:duration-(--duration-fast) [&_a:hover]:decoration-foreground",
		],
	},
	variants: {
		variant: {
			card: { panel: "rounded-2xl border border-border bg-card p-6 sm:p-8" },
			plain: {},
		},
		layout: {
			centered: { root: "max-w-sm" },
			split: {
				root: "grid max-w-3xl overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2",
				aside:
					"hidden flex-col justify-between gap-6 border-border p-8 text-sm md:flex md:border-r",
				panel: "p-6 sm:p-8",
			},
		},
	},
	compoundVariants: [
		// The split container owns the frame, so the panel drops its own.
		{
			layout: "split",
			variant: "card",
			class: { panel: "rounded-none border-0 bg-transparent" },
		},
		{
			layout: "split",
			variant: "plain",
			class: { root: "rounded-none border-0 bg-transparent" },
		},
	],
	defaultVariants: { variant: "card", layout: "centered" },
});

/** The form and the sent view share one grid cell, so swapping them never changes the height. */
export const magicLinkView = tv({
	base: "ease-(--ease-ui-out) motion-reduce:transition-none",
	variants: {
		// Only the exit delays visibility: an entering view must be visible at once to take focus.
		active: {
			true: "visible translate-y-0 opacity-100 transition-[opacity,translate] duration-(--duration-dropdown)",
			false:
				"invisible translate-y-1 opacity-0 transition-[opacity,translate,visibility] duration-(--duration-exit)",
		},
	},
	defaultVariants: { active: true },
});

export type MagicLinkVariant = NonNullable<
	VariantProps<typeof magicLinkLogin>["variant"]
>;
export type MagicLinkLayout = NonNullable<VariantProps<typeof magicLinkLogin>["layout"]>;
