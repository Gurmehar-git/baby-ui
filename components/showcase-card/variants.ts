import { tv, type VariantProps } from "tailwind-variants";

export const showcaseCard = tv({
	slots: {
		root: [
			"@container/showcase group/showcase relative h-full min-w-0 overflow-hidden text-card-foreground",
			"[&>div]:relative [&>div]:h-full [&>div]:min-h-0 [&>div]:grid! [&>div]:gap-0! [&>div]:overflow-hidden [&>div]:py-0!",
			"[&>div]:transition-[grid-template-rows] [&>div]:duration-(--duration-dropdown) [&>div]:ease-(--ease-ui-out) motion-reduce:[&>div]:transition-none",
		],
		preview: [
			"relative min-h-0 overflow-hidden rounded-[inherit]",
			"transition-[border-radius] duration-(--duration-dropdown) ease-(--ease-ui-out) motion-reduce:transition-none",
		],
		footer:
			"pointer-events-none z-30 flex min-h-0 min-w-0 items-center gap-3 overflow-hidden border-border",
		copy: "min-w-0 flex-1",
		title: "font-medium text-foreground text-sm leading-tight",
		description: "mt-1 line-clamp-2 text-muted-foreground text-xs leading-relaxed",
		action: "pointer-events-auto shrink-0",
		link: "absolute inset-0 z-20 rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
	},
	variants: {
		variant: {
			solid: {
				root: "[&>div]:[grid-template-rows:minmax(0,1fr)_auto]",
				preview: "rounded-b-none",
				footer: "relative border-t bg-background",
			},
			translucent: {
				root: "[&>div]:[grid-template-rows:minmax(0,1fr)]",
				footer:
					"absolute inset-x-2 bottom-2 rounded-lg border bg-popover/82 shadow-(--overlay-shadow) backdrop-blur-xl backdrop-saturate-150",
			},
			morphing: {
				root: [
					"[&>div]:[grid-template-rows:minmax(0,1fr)_0rem]",
					"hover:[&>div]:[grid-template-rows:minmax(0,1fr)_var(--showcase-footer)] focus-within:[&>div]:[grid-template-rows:minmax(0,1fr)_var(--showcase-footer)]",
					"[@media(hover:none)]:[&>div]:[grid-template-rows:minmax(0,1fr)_var(--showcase-footer)]",
				],
				preview:
					"group-hover/showcase:rounded-b-none group-focus-within/showcase:rounded-b-none [@media(hover:none)]:rounded-b-none",
				footer: [
					"relative translate-y-2 border-t bg-background opacity-0",
					"transition-[opacity,translate] duration-(--duration-dropdown) ease-(--ease-ui-out)",
					"group-hover/showcase:translate-y-0 group-hover/showcase:opacity-100 group-focus-within/showcase:translate-y-0 group-focus-within/showcase:opacity-100",
					"motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100",
				],
			},
		},
		size: {
			sm: {
				root: "[--showcase-footer:4rem]",
				footer: "px-3 py-2.5",
				description: "line-clamp-1",
			},
			default: { root: "[--showcase-footer:4.75rem]", footer: "px-3.5 py-3" },
			lg: {
				root: "[--showcase-footer:5.5rem]",
				footer: "px-4 py-3.5",
				title: "text-base",
				description: "text-sm",
			},
		},
	},
	defaultVariants: { variant: "solid", size: "default" },
});

export type ShowcaseCardVariant = NonNullable<
	VariantProps<typeof showcaseCard>["variant"]
>;
export type ShowcaseCardSize = NonNullable<VariantProps<typeof showcaseCard>["size"]>;
