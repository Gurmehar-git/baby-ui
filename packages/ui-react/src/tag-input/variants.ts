import { tv, type VariantProps } from "tailwind-variants";

/** The same chip field as MultiSelect: Badge chips that pop in, one ring for the whole field. */
export const tagInput = tv({
	slots: {
		root: [
			"flex w-full min-w-0 cursor-text flex-wrap items-center gap-1 rounded-lg border border-input bg-background",
			"transition-[box-shadow,border-color] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"hover:border-border-strong focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
			"aria-invalid:border-[var(--destructive)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		],
		chip: "pop-in max-w-40 gap-1 pr-0.5",
		chipLabel: "min-w-0 truncate",
		chipRemove:
			"inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3",
		input:
			"min-w-24 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
	},
	variants: {
		size: {
			sm: { root: "min-h-8 px-1 py-0.5 text-xs", input: "h-6 px-1.5" },
			md: { root: "min-h-9 px-1 py-1 text-sm", input: "h-7 px-2" },
			lg: { root: "min-h-10 px-1.5 py-1 text-sm", input: "h-8 px-2" },
		},
	},
	defaultVariants: { size: "md" },
});

export type TagInputSize = NonNullable<VariantProps<typeof tagInput>["size"]>;
