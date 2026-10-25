import { tv, type VariantProps } from "tailwind-variants";

/** `quiet` fades the bar until its message is hovered (a `group/message` ancestor) or focus is
 * inside; `solid` keeps it at full strength. Icons answer every press in place. */
export const messageActions = tv({
	slots: {
		root: "flex flex-col items-start",
		bar: "flex items-center gap-0.5 transition-opacity duration-(--duration-base) ease-(--ease-ui-out)",
		button: [
			"group/action relative grid size-8 shrink-0 place-items-center rounded-lg border-0 bg-transparent p-0 text-muted-foreground outline-none [&_svg]:size-4",
			"transition-[background-color,color,scale] duration-(--duration-fast) ease-(--ease-ui-out) hover:bg-foreground/[0.06] hover:text-foreground active:scale-(--press-scale-icon)",
			"focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-pressed:text-foreground motion-reduce:transition-none",
		],
		icon: "fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]",
		thumb: [
			"transition-[scale,fill] duration-(--duration-spring-bouncy) ease-(--ease-spring-bouncy) group-active/action:scale-75 group-active/action:duration-(--duration-press)",
			"group-aria-pressed/action:fill-current motion-reduce:transition-none",
		],
		spin: "transition-[rotate] duration-(--duration-slow) ease-(--ease-ui-out) motion-reduce:transition-none",
		versions: [
			"grid grid-cols-[0fr] transition-[grid-template-columns] duration-(--duration-collapse) ease-(--ease-ui-out) data-[shown]:grid-cols-[1fr] motion-reduce:transition-none",
		],
		versionsClip: "flex min-w-0 items-center overflow-hidden",
		versionLabel: "px-0.5 font-medium text-muted-foreground text-xs tabular-nums",
		equalizer: "flex h-3.5 items-end gap-[2px]",
		speakBar: "speak-bar w-[3px] rounded-full bg-current",
		panel: [
			"grid w-full grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out) data-[open]:grid-rows-[1fr] data-[open]:opacity-100 motion-reduce:transition-none",
		],
		panelClip: "-mx-1 min-h-0 overflow-hidden px-1",
		panelCard:
			"mt-2 mb-1 flex w-full max-w-120 flex-col rounded-xl border border-border bg-background p-3",
		panelHead: "flex items-center justify-between gap-2 font-medium text-sm",
		// The form, and the field under "Other", fold on grid rows; the clip's -mb-1 eats the ring room.
		fold: [
			"grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-(--duration-collapse) ease-(--ease-ui-out)",
			"data-[folded]:grid-rows-[0fr] data-[folded]:opacity-0 motion-reduce:transition-none",
		],
		foldClip: "-mx-1 -mb-1 min-h-0 overflow-hidden",
		foldBody: "flex flex-col px-1 pt-3 pb-1",
		submit: "mt-3 self-end",
		thanks:
			"pop-in inline-flex items-center gap-1.5 text-sm text-success-strong [&_svg]:size-4",
	},
	variants: {
		variant: {
			quiet: {
				bar: "opacity-50 focus-within:opacity-100 hover:opacity-100 group-hover/message:opacity-100 has-[[aria-pressed=true]]:opacity-100",
			},
			solid: { bar: "" },
		},
	},
	defaultVariants: { variant: "quiet" },
});

export type MessageActionsVariant = NonNullable<
	VariantProps<typeof messageActions>["variant"]
>;
export type MessageFeedback = "up" | "down";
