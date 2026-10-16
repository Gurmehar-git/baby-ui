import { tv, type VariantProps } from "tailwind-variants";

// The input shares a grid cell with an invisible copy of its text, so it grows as you type
// without measuring, and the display and the field sit at the same spot.
export const inlineEdit = tv({
	slots: {
		root: "inline-flex max-w-full flex-col gap-1 align-top",
		row: "inline-flex max-w-full items-center gap-1.5",
		display: [
			"-mx-1.5 max-w-full cursor-text rounded-md px-1.5 text-left outline-none transition-colors duration-(--duration-fast)",
			"hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring data-[phase=saving]:cursor-progress data-[phase=saving]:opacity-70",
		],
		text: "inline-block whitespace-pre-wrap break-words transition-[opacity,translate,filter] duration-(--duration-base) ease-(--ease-ui-out) starting:translate-y-[0.3em] starting:opacity-0 starting:blur-[2px] motion-reduce:transition-none",
		placeholder: "text-muted-foreground",
		field:
			"-mx-1.5 grid max-w-full rounded-md bg-background px-1.5 ring-2 ring-ring *:col-start-1 *:row-start-1",
		sizer: "invisible whitespace-pre-wrap break-words",
		control:
			"w-full min-w-[2ch] resize-none overflow-hidden bg-transparent outline-none placeholder:text-muted-foreground",
		status:
			"grid size-4 shrink-0 place-items-center text-muted-foreground *:col-start-1 *:row-start-1",
		tick: "menu-check size-4 text-success",
		message:
			"text-xs data-[tone=error]:text-destructive data-[tone=failed]:text-destructive",
		retry: "ml-1 font-medium underline underline-offset-2",
	},
	variants: {
		variant: {
			title: { root: "font-semibold text-lg tracking-tight" },
			body: { root: "text-muted-foreground text-sm" },
		},
		size: {
			sm: { root: "text-sm" },
			default: {},
			lg: { root: "text-2xl" },
		},
	},
	compoundVariants: [{ variant: "body", size: "lg", class: { root: "text-base" } }],
	defaultVariants: { variant: "title", size: "default" },
});

export type InlineEditVariant = NonNullable<VariantProps<typeof inlineEdit>["variant"]>;
export type InlineEditSize = NonNullable<VariantProps<typeof inlineEdit>["size"]>;
