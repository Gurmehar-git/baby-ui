import { tv, type VariantProps } from "tailwind-variants";

/**
 * Shared by DateField, TimePicker, DatePicker and DateRangePicker in both ports. bits-ui's
 * segments and the React ones both carry `data-segment`, `data-invalid` and valuetext "Empty".
 */
export const dateField = tv({
	slots: {
		root: "inline-flex w-fit min-w-0 max-w-full flex-col gap-1.5",
		group: [
			"inline-flex w-full min-w-0 items-center border border-input bg-(--field) px-1.5 text-foreground tabular-nums hover:border-border-strong",
			"transition-[box-shadow,border-color] duration-[var(--duration-press)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
			// Rings while a segment is focused, not while the calendar button is.
			"has-[[data-segment]:focus]:border-ring has-[[data-segment]:focus]:ring-3 has-[[data-segment]:focus]:ring-ring/20",
			// aria-invalid is the `invalid` prop; bits-ui only validates a field that has a value.
			"has-[[data-segment][data-invalid]]:border-destructive aria-invalid:border-destructive aria-invalid:ring-destructive/20",
			"aria-disabled:opacity-50 data-[disabled]:opacity-50",
		],
		input: "flex min-w-0 items-center gap-px px-1.5",
		segment: [
			"inline-block cursor-text select-none whitespace-nowrap rounded-md px-0.5 text-end caret-transparent outline-none",
			"transition-colors duration-100 ease-[var(--ease-smooth)] motion-reduce:transition-none",
			"aria-[valuetext=Empty]:text-muted-foreground",
			"focus:bg-primary/10 focus:text-primary",
			"data-[segment=literal]:px-0 data-[segment=literal]:text-muted-foreground",
			"data-[invalid]:text-destructive-strong data-[invalid]:focus:bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]",
			"in-aria-invalid:text-destructive-strong in-aria-invalid:focus:bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)]",
			"aria-disabled:cursor-not-allowed data-[disabled]:cursor-not-allowed",
		],
		icon: "pointer-events-none ms-1.5 flex shrink-0 items-center text-muted-foreground [&_svg]:size-4",
		separator: "select-none text-muted-foreground",
		trigger: "ms-auto shrink-0 aria-expanded:bg-accent aria-expanded:text-foreground",
		content: "w-auto p-0",
	},
	variants: {
		size: {
			xs: { group: "h-6 rounded-sm px-1 text-xs", icon: "[&_svg]:size-3" },
			sm: { group: "h-8 rounded-md text-xs", icon: "[&_svg]:size-3.5" },
			default: { group: "h-9 rounded-lg text-sm" },
			lg: { group: "h-10 rounded-lg text-sm" },
			xl: { group: "h-12 rounded-xl px-2 text-base", icon: "[&_svg]:size-4.5" },
		},
	},
	defaultVariants: { size: "default" },
});

export type DateFieldSize = NonNullable<VariantProps<typeof dateField>["size"]>;
