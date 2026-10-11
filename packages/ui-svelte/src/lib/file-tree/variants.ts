import { tv, type VariantProps } from "tailwind-variants";

export const fileTree = tv({
	slots: {
		root: "select-none font-mono",
		row: [
			"tree-row flex cursor-pointer items-center outline-none transition-colors",
			"hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
		],
		chevron:
			"shrink-0 transition-[transform,scale,translate] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		spacer: "shrink-0",
		name: "truncate",
		group:
			"grid grid-rows-[0fr] transition-[grid-template-rows] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] data-[open]:grid-rows-[1fr] motion-reduce:transition-none",
		groupInner: "overflow-hidden",
	},
	variants: {
		size: {
			sm: {
				root: "text-xs",
				row: "gap-1 rounded py-0.5 pr-1.5",
				chevron: "size-3",
				spacer: "size-3",
			},
			md: {
				root: "text-sm",
				row: "gap-1.5 rounded-md py-1 pr-2",
				chevron: "size-3.5",
				spacer: "size-3.5",
			},
		},
		selected: {
			true: { row: "bg-foreground/[0.06] text-foreground" },
			false: { row: "text-muted-foreground" },
		},
		guide: {
			true: { row: "border-border/60 border-l" },
			false: {},
		},
	},
	defaultVariants: { size: "md", selected: false, guide: false },
});

export type FileTreeSize = NonNullable<VariantProps<typeof fileTree>["size"]>;

/** Left inset of a root-level row, in px; nested rows add `indent` per level on top. */
export const ROW_INSET: Record<FileTreeSize, number> = { sm: 6, md: 8 };
