import { tv, type VariantProps } from "tailwind-variants";
import type { dateField } from "../date-field/variants";

/** The popover's layout; the field itself is DateField's `dateField` contract. */
export const dateRangePicker = tv({
	slots: {
		content: "flex w-auto max-w-[calc(100vw-2rem)] flex-col p-0 sm:flex-row",
		rail: "relative flex min-w-0 gap-1 overflow-x-auto border-border border-b p-2 sm:w-36 sm:flex-col sm:overflow-visible sm:border-e sm:border-b-0",
		// Slides to the pressed preset instead of each preset repainting its own fill.
		pill: "pointer-events-none absolute top-0 left-0 rounded-md bg-foreground/[0.08] data-[ready]:transition-[translate,width,height] data-[ready]:duration-250 data-[ready]:ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		preset: [
			"relative shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-muted-foreground text-sm outline-none",
			"transition-[color,background-color,scale] duration-150 ease-[var(--ease-ui-out)] active:scale-[var(--press-scale-sm)] motion-reduce:transition-none",
			"not-aria-pressed:hover:bg-foreground/[0.04] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring aria-pressed:text-foreground",
		],
		main: "flex min-w-0 flex-col",
		footer: "flex justify-end gap-2 border-border border-t p-2",
	},
});

export type DateRangePickerSize = NonNullable<VariantProps<typeof dateField>["size"]>;
