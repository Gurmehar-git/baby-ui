import { tv, type VariantProps } from "tailwind-variants";

export const newsletterSignup = tv({
	slots: {
		root: "@container/news w-full bg-background text-foreground",
		layout: "mx-auto grid w-full items-center gap-10",
		copy: "grid gap-4",
		title: "text-balance font-semibold text-3xl tracking-tight",
		description: "max-w-120 text-pretty text-base text-muted-foreground leading-relaxed",
		form: "grid w-full max-w-110 gap-2",
		field:
			"pr-1 data-[nudge=true]:animate-[otp-shake_240ms_ease-in-out] motion-reduce:animate-none",
		submit: "min-w-28 gap-1.5",
		// Hidden copies of every message share the cell, so the line never changes height.
		message: "grid text-muted-foreground text-xs leading-5",
		messageLine: "col-start-1 row-start-1 data-[tone=error]:text-destructive",
		sizer: "invisible col-start-1 row-start-1",
		link: "underline underline-offset-2 hover:text-foreground",
		again: "h-auto p-0 align-baseline text-xs",
		readers: "flex items-center gap-3 text-muted-foreground text-sm",
		readerCount: "font-medium text-foreground tabular-nums",
		// The phrase opens its own width, so the line glides instead of jumping.
		you: "inline-grid grid-cols-[0fr] opacity-0 transition-[grid-template-columns,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[on=true]:grid-cols-[1fr] data-[on=true]:opacity-100 motion-reduce:transition-none",
		youInner: "overflow-hidden whitespace-nowrap",
		// Every issue shares one cell, so the stack is as tall as its tallest issue.
		stack: "grid pt-6",
		issue:
			"col-start-1 row-start-1 grid origin-top content-start gap-2 rounded-2xl border border-border bg-background p-5 shadow-xs transition-[translate,scale,opacity] duration-(--duration-spring-snappy) ease-(--ease-spring-snappy) motion-reduce:transition-none",
		issueHead: "flex items-center justify-between gap-3 text-xs",
		masthead: "font-semibold tracking-tight",
		issueNumber: "text-muted-foreground tabular-nums",
		issueMeta: "flex min-w-0 gap-1.5 text-muted-foreground text-xs",
		recipient: "truncate",
		subject: "mt-1 text-balance font-medium text-base leading-snug",
		stories: "mt-2 grid gap-2.5",
		story: "grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 text-sm",
		thumb: "size-11 rounded-lg object-cover",
		storyTitle: "line-clamp-2 leading-snug",
		minutes: "text-muted-foreground text-xs tabular-nums",
	},
	variants: {
		variant: {
			inline: {
				layout:
					"max-w-280 px-4 py-16 @3xl/news:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] @3xl/news:gap-16 @xl/news:px-8",
			},
			card: {
				layout:
					"max-w-110 gap-6 rounded-3xl border border-border bg-background p-5 @md/news:p-6",
				stack: "order-first",
			},
		},
	},
	defaultVariants: { variant: "inline" },
});

export type NewsletterSignupVariant = NonNullable<
	VariantProps<typeof newsletterSignup>["variant"]
>;
