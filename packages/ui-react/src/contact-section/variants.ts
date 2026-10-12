import { tv, type VariantProps } from "tailwind-variants";

export const contactSection = tv({
	slots: {
		root: "@container/contact w-full bg-background text-foreground",
		inner:
			"mx-auto grid w-full max-w-280 gap-10 px-4 py-16 @xl/contact:px-8 @3xl/contact:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] @3xl/contact:gap-16",
		intro: "grid content-start gap-3",
		title: "text-balance font-semibold text-3xl tracking-tight",
		description: "max-w-120 text-pretty text-muted-foreground leading-relaxed",
		// The form and its confirmation share one cell; the inactive face folds away.
		stage: "grid",
		face: "col-start-1 row-start-1 grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[active=true]:grid-rows-[1fr] data-[active=true]:opacity-100 motion-reduce:transition-none",
		faceInner: "min-h-0 overflow-hidden p-px",
		form: "grid gap-4 @xl/contact:grid-cols-2",
		wide: "@xl/contact:col-span-2",
		error:
			"rounded-md bg-destructive/10 px-3 py-2 text-destructive-strong text-sm @xl/contact:col-span-2",
		done: "grid justify-items-start gap-3 rounded-2xl border border-border p-6",
		doneTitle: "font-semibold text-lg",
		doneText: "text-muted-foreground text-sm",
		channels: "grid gap-6 @xl/contact:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]",
		channelList: "h-auto w-full flex-col items-stretch",
		channelItem: "h-auto w-full flex-col items-start gap-0.5 py-2 text-left",
		channelMeta: "font-normal text-muted-foreground text-xs",
		panel: "rounded-2xl border border-border p-6 text-sm leading-relaxed",
		offices: "grid gap-4 @xl/contact:grid-cols-2",
		office: "grid content-start gap-2 rounded-2xl border border-border p-5",
		officeTop: "flex items-center justify-between gap-3",
		city: "font-semibold",
		clock: "text-muted-foreground text-sm tabular-nums",
		address: "text-muted-foreground text-sm leading-relaxed",
		link: "text-sm underline underline-offset-4",
	},
	variants: {
		/** `form` takes a message, `channels` lists ways to reach you, `offices` shows live local times. */
		variant: {
			form: {},
			channels: {},
			offices: {},
		},
	},
	defaultVariants: { variant: "form" },
});

export type ContactSectionVariant = NonNullable<
	VariantProps<typeof contactSection>["variant"]
>;
