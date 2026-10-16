import { tv, type VariantProps } from "tailwind-variants";

export const diffRow = tv({
	slots: {
		row: "",
		label: "font-medium tabular-nums transition-colors duration-(--duration-base)",
		detail: "transition-colors duration-(--duration-base)",
		// White on the dark-mode status fills is under 3:1.
		mark: "text-white dark:text-background",
	},
	variants: {
		change: {
			removed: {
				row: "bg-destructive/10",
				label: "text-destructive-strong",
				detail: "text-destructive-strong line-through decoration-destructive/50",
				mark: "bg-destructive",
			},
			added: {
				row: "bg-success/10",
				label: "text-success-strong",
				detail: "text-success-strong",
				mark: "bg-success",
			},
		},
	},
	defaultVariants: { change: "removed" },
});

export type DiffRowChange = NonNullable<VariantProps<typeof diffRow>["change"]>;
