import { tv, type VariantProps } from "tailwind-variants";

/** `pill` holds every action in one raised pill; `chips` sets each apart as a quiet chip that
 * tints while pressed. A pressed icon fills and pops; its count rolls and its column folds open. */
export const reactionBar = tv({
	slots: {
		root: "inline-flex items-center",
		item: [
			"group/reaction relative inline-flex h-10 min-w-10 items-center justify-center rounded-full px-2.5 text-muted-foreground outline-none",
			"transition-[background-color,color,scale] duration-(--duration-fast) ease-(--ease-ui-out) active:scale-(--press-scale-icon)",
			"hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
		],
		// Squishes while held and springs back on release: a transition, so quick taps retarget.
		icon: [
			"grid shrink-0 place-items-center transition-[scale] duration-(--duration-spring-bouncy) ease-(--ease-spring-bouncy) motion-reduce:transition-none [&_svg]:size-5.5",
			"group-active/reaction:scale-75 group-active/reaction:duration-(--duration-press) group-active/reaction:ease-(--ease-ui-out)",
			"[&_[data-fill]]:fill-transparent [&_[data-fill]]:transition-[fill] [&_[data-fill]]:duration-(--duration-base) group-aria-pressed/reaction:[&_[data-fill]]:fill-current",
		],
		count: [
			"grid grid-cols-[0fr] transition-[grid-template-columns] duration-(--duration-slow) ease-(--ease-ui-out) data-[shown]:grid-cols-[1fr] motion-reduce:transition-none",
		],
		countClip: "min-w-0 overflow-hidden",
		countText: "block ps-1.5 font-medium text-sm tabular-nums leading-5",
	},
	variants: {
		variant: {
			pill: {
				root: "gap-0.5 rounded-full border border-border bg-background px-2 py-1 shadow-xs",
			},
			chips: {
				root: "gap-1.5",
				item: "h-9 border border-border bg-background px-3 aria-pressed:border-transparent aria-pressed:bg-(--reaction-tone)/10",
			},
		},
		tone: {
			default: {
				item: "[--reaction-tone:var(--foreground)] aria-pressed:text-foreground",
			},
			primary: { item: "[--reaction-tone:var(--primary)] aria-pressed:text-primary" },
			destructive: {
				item: "[--reaction-tone:var(--destructive)] aria-pressed:text-destructive-strong",
			},
			violet: { item: "[--reaction-tone:var(--violet)] aria-pressed:text-(--violet)" },
		},
	},
	defaultVariants: { variant: "pill", tone: "default" },
});

export type ReactionBarVariant = NonNullable<VariantProps<typeof reactionBar>["variant"]>;
export type ReactionBarTone = NonNullable<VariantProps<typeof reactionBar>["tone"]>;

/** The built-in icons; `like` and `comment` fill while pressed. */
export const REACTION_ICONS = ["like", "comment", "repost", "share"] as const;
export type ReactionIcon = (typeof REACTION_ICONS)[number];
