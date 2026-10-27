import { tv, type VariantProps } from "tailwind-variants";

export const testimonial = tv({
	slots: {
		root: "relative flex h-full min-w-0 flex-col text-foreground",
		spotlight:
			"pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-(--duration-base) group-hover/testimonial:opacity-100 motion-reduce:transition-none",
		quote: "relative grow text-pretty",
		author: "relative flex items-center gap-3",
		avatar: "shrink-0",
		details: "grid min-w-0 gap-0.5",
		name: "flex min-w-0 items-center gap-1.5 font-medium text-sm",
		tagline: "text-muted-foreground text-xs",
		badge: "inline-grid size-4 shrink-0 place-items-center text-info [&_svg]:size-full",
	},
	variants: {
		variant: {
			card: {
				root: "rounded-xl border bg-card",
				quote: "px-4 py-4 text-base",
				author: "px-4 pt-1 pb-4",
			},
			editorial: {
				root: "gap-6 pl-3",
				quote:
					"max-w-2xl font-serif text-xl before:absolute before:-left-3 before:text-muted-foreground before:content-['“'] after:ml-0.5 after:text-muted-foreground after:content-['”'] md:text-2xl",
				author:
					"ml-auto w-full justify-end text-right before:h-px before:flex-1 before:bg-border md:w-1/2",
				details: "justify-items-end",
			},
			spotlight: {
				root: "group/testimonial overflow-hidden rounded-xl bg-card/60 inset-ring-1 inset-ring-foreground/10",
				quote: "px-4 py-4 font-serif text-base",
				author: "px-4 pt-1 pb-4",
			},
		},
	},
	defaultVariants: { variant: "card" },
});

export type TestimonialVariant = NonNullable<VariantProps<typeof testimonial>["variant"]>;
