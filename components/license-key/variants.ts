import { tv, type VariantProps } from "tailwind-variants";

export const licenseKey = tv({
	slots: {
		root: "@container flex w-full flex-col gap-6 text-foreground",
		header: "flex flex-wrap items-start justify-between gap-x-4 gap-y-3",
		heading: "flex min-w-0 flex-col gap-1",
		title: "font-semibold text-base tracking-tight",
		description: "max-w-prose text-muted-foreground text-sm leading-relaxed",
		pass: "flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 @md:p-6",
		passHeader: "flex items-center justify-between gap-3",
		brand: "flex min-w-0 items-center gap-2 font-mono text-muted-foreground text-xs",
		glyph: "flex shrink-0 text-muted-foreground [&_svg]:size-3.5",
		plan: "flex shrink-0 items-center gap-1.5 font-medium text-foreground text-xs",
		// One ping when the plan first shows: the key is live, said once and then left alone.
		planDot:
			"relative flex size-1.5 before:absolute before:inset-0 before:animate-[ping_900ms_var(--ease-ui-out)_1] before:rounded-full before:bg-success motion-reduce:before:animate-none",
		planDotCore: "relative size-1.5 rounded-full bg-success",
		well: "flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-3",
		// Perspective on the row, so each chip flips about its own top edge with depth.
		value:
			"flex min-w-0 flex-wrap items-center gap-1.5 font-mono text-base [perspective:600px] @md:text-lg",
		valuePrefix: "mr-1 text-muted-foreground text-sm @md:text-base",
		chip: "inline-block rounded-lg border border-border bg-background px-2 py-1 text-foreground tabular-nums tracking-wider",
		actions: "flex shrink-0 items-center gap-0.5",
		action: "text-muted-foreground hover:text-foreground",
		// pathLength=1 on the slash, so a dash of 1 hides it and 0 draws it in.
		eyeSlash:
			"[stroke-dasharray:1] transition-[stroke-dashoffset] duration-(--duration-base) ease-(--ease-ui-out) motion-reduce:transition-none",
		rotateIcon:
			"transition-transform duration-(--duration-slow) ease-(--ease-ui-out) group-hover/rotate:rotate-90 data-[spinning]:animate-spin motion-reduce:transition-none motion-reduce:data-[spinning]:animate-none",
		meta: "grid grid-cols-2 gap-x-6 gap-y-3 border-border border-t pt-4 @md:flex @md:flex-wrap @md:gap-x-10",
		metaItem: "flex min-w-0 flex-col gap-1",
		metaLabel: "font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]",
		metaValue: "flex items-center gap-2 text-foreground text-sm tabular-nums",
		pips: "flex items-center gap-1",
		// Each pip grows in from the left on first paint, staggered by its index.
		pip: "h-1.5 w-3.5 origin-left rounded-full bg-foreground/[0.12] transition-[scale] duration-(--duration-slow) ease-[var(--ease-out-quart)] starting:scale-x-0 data-[on]:bg-foreground motion-reduce:transition-none",
		confirm: "flex flex-col gap-3 rounded-xl border border-border p-4",
		confirmTitle: "font-medium text-sm",
		confirmBody: "text-muted-foreground text-sm leading-relaxed",
		confirmActions: "flex flex-wrap justify-end gap-2",
		error: "text-destructive-strong text-xs leading-relaxed",
		setup: "flex flex-col gap-6 [counter-reset:license-step]",
		step: [
			"relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 [counter-increment:license-step]",
			// The rail joins each number to the next; the last step has nothing below it.
			"after:absolute after:top-8 after:-bottom-5 after:left-[0.875rem] after:w-px after:bg-border last:after:hidden",
		],
		stepNumber: [
			"flex size-7 items-center justify-center rounded-full border border-border bg-background",
			"font-mono text-muted-foreground text-xs before:content-[counter(license-step)]",
		],
		stepBody: "flex min-w-0 flex-col gap-2 pt-1",
		stepTitle: "font-medium text-sm",
		code: "relative min-w-0 rounded-lg border border-border bg-background",
		pre: "overflow-x-auto rounded-lg p-3 pr-12 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring",
		codeCopy: "absolute top-1.5 right-1.5",
	},
	variants: {
		/** `card`: a bordered panel around the key. `inline`: the same parts, no panel, for a settings page. */
		variant: {
			card: {},
			inline: { pass: "border-0 bg-transparent p-0 shadow-none @md:p-0" },
		},
	},
	defaultVariants: { variant: "card" },
});

/** Grid-rows disclosure for the regenerate confirm step. */
export const licenseDisclosure = tv({
	base: "grid transition-[grid-template-rows,opacity] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
	variants: {
		open: {
			true: "grid-rows-[1fr] opacity-100 duration-[var(--duration-dropdown)]",
			false: "grid-rows-[0fr] opacity-0 duration-[var(--duration-exit)]",
		},
	},
	defaultVariants: { open: false },
});

export type LicenseKeyVariant = NonNullable<VariantProps<typeof licenseKey>["variant"]>;
