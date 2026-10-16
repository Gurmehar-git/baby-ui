import { tv, type VariantProps } from "tailwind-variants";
import type { BadgeSize } from "../../badge/react/variants";
import { fieldText } from "../../lib/react/control";

/** The same chip field as MultiSelect: Badge chips that pop in, one ring for the whole field. */
export const tagInput = tv({
	slots: {
		root: [
			"flex w-full min-w-0 cursor-text flex-wrap items-center gap-1 border border-input bg-(--field)",
			"transition-[box-shadow,border-color] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			"hover:border-border-strong focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20",
			"aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		],
		chip: "pop-in max-w-40 gap-1 pr-0.5 transition-shadow data-[armed=true]:ring-2 data-[armed=true]:ring-ring",
		chipLabel: "min-w-0 truncate",
		chipRemove:
			"relative inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none after:absolute after:-inset-1 transition-colors hover:bg-foreground/[0.08] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-3",
		input:
			"min-w-24 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
	},
	variants: {
		// Same rim as MultiSelect: rows are the ladder height minus border and padding.
		size: {
			xs: {
				root: "min-h-6 rounded-sm px-0.5 py-0 text-xs",
				input: ["h-5.5 px-1", fieldText({ size: "xs" })],
			},
			sm: {
				root: "min-h-8 rounded-md px-1 py-0.5 text-xs",
				input: ["h-6.5 px-1.5", fieldText({ size: "sm" })],
			},
			default: {
				root: "min-h-9 rounded-lg px-1 py-0.5 text-sm",
				input: ["h-7.5 px-2", fieldText({ size: "default" })],
			},
			lg: {
				root: "min-h-10 rounded-lg px-1 py-0.5 text-sm",
				input: ["h-8.5 px-2.5", fieldText({ size: "lg" })],
			},
			xl: {
				root: "min-h-12 rounded-xl px-1.5 py-1 text-base",
				input: ["h-9.5 px-2.5", fieldText({ size: "xl" })],
			},
		},
	},
	defaultVariants: { size: "default" },
});

export type TagInputSize = NonNullable<VariantProps<typeof tagInput>["size"]>;

/** The chip Badge size for each field size: chips fit the field's inner row. */
export const TAG_INPUT_CHIP: Record<TagInputSize, BadgeSize> = {
	xs: "sm",
	sm: "sm",
	default: "default",
	lg: "default",
	xl: "lg",
};
