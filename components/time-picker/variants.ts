import { tv, type VariantProps } from "tailwind-variants";
import { button } from "../button/variants";
import type { dateField } from "../date-field/variants";

export type TimePickerSize = NonNullable<VariantProps<typeof dateField>["size"]>;

export const timePicker = tv({
	slots: {
		trailing: "ms-auto flex shrink-0 items-center gap-0.5",
		// The hands point at the field's time and take the short way round when it changes.
		hand: "origin-center transition-[rotate] duration-300 ease-[var(--ease-ui-out)] [transform-box:view-box] motion-reduce:transition-none",
		clearButton: [
			button({ variant: "ghost", size: "icon-xs" }),
			"text-muted-foreground hover:text-foreground",
			// Pops in when the field gains a value, so the new control is noticed.
			"transition-[scale,opacity,color,background-color] [transition-duration:200ms,150ms,100ms,100ms] starting:scale-75 starting:opacity-0",
		],
		nowButton: [
			button({ variant: "ghost" }),
			"h-6 rounded-md px-2 font-medium text-[11px] text-muted-foreground hover:text-foreground",
		],
	},
});
