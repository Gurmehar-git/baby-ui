import { tv, type VariantProps } from "tailwind-variants";

// Faces and new comments open via grid-template-rows; @starting-style only fires once the root is ready,
// so the first render never animates.
const FOLD =
	"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) data-[on=false]:grid-rows-[0fr] data-[on=false]:opacity-0 motion-reduce:transition-none";
const GROW =
	"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-out-quad) in-data-ready:starting:grid-rows-[0fr] in-data-ready:starting:opacity-0 motion-reduce:transition-none";

export const commentThread = tv({
	slots: {
		root: "w-full min-w-0 text-foreground text-sm",
		face: FOLD,
		clip: "min-h-0 overflow-clip [overflow-clip-margin:4px]",
		header: "flex items-center justify-between gap-3 py-3 pr-3 pl-4.5",
		heading: "grid min-w-0",
		title: "truncate font-medium text-sm",
		subtitle: "text-muted-foreground text-xs tabular-nums",
		pill: "rounded-full [&_svg]:text-success",
		list: "grid list-none px-2",
		item: GROW,
		replies:
			"relative ml-6 grid list-none pl-3 before:absolute before:top-0.5 before:bottom-3.5 before:left-0 before:w-px before:bg-border",
		comment: "group/comment flex gap-2.5 rounded-2xl p-2.5",
		avatar: "size-7 text-xs",
		deletedDot: "size-7 flex-none rounded-full border border-border-strong border-dashed",
		main: "grid min-w-0 flex-1 gap-0.5",
		meta: "flex min-w-0 items-baseline gap-2",
		name: "truncate font-medium",
		time: "flex-none text-muted-foreground text-xs",
		body: "m-0 text-pretty whitespace-pre-wrap text-muted-foreground [overflow-wrap:anywhere]",
		mention: "font-medium text-primary",
		deleted: "mt-1 text-muted-foreground italic",
		footer: "mt-1 flex min-h-7.5 flex-wrap items-center gap-x-2 gap-y-1",
		reactions: "flex flex-wrap gap-1",
		reaction: [
			"inline-flex h-6.5 items-center gap-1.5 rounded-full border bg-background pr-2.5 pl-2 font-medium text-muted-foreground text-xs outline-none",
			"transition-[background-color,border-color,color,scale] duration-(--duration-fast) hover:border-border-strong active:scale-94 focus-visible:ring-2 focus-visible:ring-ring",
			"in-data-ready:starting:scale-70 in-data-ready:starting:opacity-0 aria-pressed:border-primary/45 aria-pressed:bg-primary/10 aria-pressed:text-foreground motion-reduce:transition-none",
		],
		actions:
			"flex min-h-7 flex-wrap items-center gap-0.5 transition-opacity duration-(--duration-fast) pointer-fine:opacity-0 pointer-fine:group-focus-within/comment:opacity-100 pointer-fine:group-hover/comment:opacity-100 data-[open]:opacity-100 in-data-ready:starting:opacity-0",
		action: "rounded-full text-muted-foreground",
		prompt: "mr-1 text-foreground text-xs",
		emoji:
			"grid size-7 place-items-center rounded-full text-base leading-none outline-none transition-[background-color,scale] duration-(--duration-fast) hover:bg-muted focus-visible:bg-muted active:scale-88 aria-pressed:bg-primary/10 starting:scale-60 starting:opacity-0 motion-reduce:transition-none",
		toggle:
			"-ml-1.5 mt-0.5 h-7 w-fit gap-1.5 rounded-full py-0 pr-2 pl-1.5 font-medium text-muted-foreground text-xs hover:bg-muted hover:text-foreground",
		stack: "inline-flex flex-none pl-1 *:-ml-1.25 *:ring-2 *:ring-(--ct-surface)",
		empty: "m-0 px-4.5 pt-2 pb-4 text-muted-foreground",
		composerArea: "mt-1 grid border-t px-3 pt-2.5 pb-3",
		replying: GROW,
		replyingInner:
			"flex items-center gap-1.5 pb-2 pl-9.5 text-muted-foreground text-xs max-sm:pl-0.5",
		replyingName: "font-medium text-foreground",
		composer:
			"grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5 gap-y-2 max-sm:grid-cols-[minmax(0,1fr)_auto]",
		composerAvatar: "mt-1.5 size-7 text-xs max-sm:hidden",
		compact: "mt-1 grid gap-2",
		compactActions: "flex justify-end gap-1",
		resolved: "flex items-center gap-3 py-2.5 pr-2.5 pl-3.5",
		resolvedIcon:
			"grid size-6 flex-none place-items-center rounded-full bg-success/14 text-success-strong [&_svg]:size-3.5",
		resolvedText: "grid min-w-0 flex-1",
		resolvedTitle: "truncate font-medium",
		resolvedSubject: "font-normal text-muted-foreground",
		resolvedMeta: "text-muted-foreground text-xs tabular-nums",
	},
	variants: {
		variant: {
			default: {
				root: "rounded-2xl border bg-background [--ct-surface:var(--color-background)] transition-[border-radius] duration-(--duration-spring-snappy) data-[resolved]:rounded-[22px]",
			},
			flat: { root: "[--ct-surface:var(--color-background)]" },
		},
	},
	defaultVariants: { variant: "default" },
});

export type CommentThreadVariant = NonNullable<
	VariantProps<typeof commentThread>["variant"]
>;
