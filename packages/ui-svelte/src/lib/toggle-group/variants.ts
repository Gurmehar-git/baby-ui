import { tv, type VariantProps } from "tailwind-variants";

export const toggleGroup = tv({
	slots: {
		root: "inline-flex items-center gap-0.5 border border-border",
		// Single-select items are role=radio/aria-checked, not aria-pressed; data-state
		// is the one attribute bits-ui sets unconditionally ("on"/"off") in both modes.
		item: [
			"inline-flex items-center gap-1.5 font-medium text-muted-foreground outline-none",
			"transition-[color,background-color,box-shadow,scale] duration-(--duration-fast) ease-[var(--ease-smooth)] motion-reduce:transition-none",
			"hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[var(--press-scale-sm)]",
			"disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-foreground",
			"[&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
		],
	},
	variants: {
		variant: {
			default: {
				root: "bg-card",
				item: "data-[state=on]:bg-foreground/[0.08]",
			},
			outline: {
				root: "bg-transparent",
				item: "data-[state=on]:bg-foreground/[0.08]",
			},
		},
		// The whole group sits on the control ladder: items are the height minus the rim
		// (border + padding), and their radius is the group's minus that same inset.
		size: {
			xs: {
				root: "h-6 rounded-sm p-0.5",
				item: "h-4.5 rounded-[calc(var(--radius-sm)-3px)] px-1.5 text-xs [&_svg]:size-3",
			},
			sm: {
				root: "h-8 rounded-md p-0.5",
				item: "h-6.5 rounded-[calc(var(--radius-md)-3px)] px-2 text-xs [&_svg]:size-3.5",
			},
			default: {
				root: "h-9 rounded-lg p-0.5",
				item: "h-7.5 rounded-[calc(var(--radius-lg)-3px)] px-2.5 text-sm [&_svg]:size-4",
			},
			lg: {
				root: "h-10 rounded-lg p-0.5",
				item: "h-8.5 rounded-[calc(var(--radius-lg)-3px)] px-3 text-sm [&_svg]:size-4",
			},
			xl: {
				root: "h-12 rounded-xl p-1",
				item: "h-9.5 rounded-[calc(var(--radius-xl)-5px)] px-3.5 text-base [&_svg]:size-4.5",
			},
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});

export type ToggleGroupVariant = NonNullable<VariantProps<typeof toggleGroup>["variant"]>;
export type ToggleGroupSize = NonNullable<VariantProps<typeof toggleGroup>["size"]>;
