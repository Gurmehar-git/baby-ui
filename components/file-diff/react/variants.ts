import { tv, type VariantProps } from "tailwind-variants";

export const diffRow = tv({
	base: "flex whitespace-pre px-4",
	variants: {
		kind: {
			add: "bg-[color-mix(in_oklch,var(--success)_12%,transparent)] text-foreground",
			remove:
				"bg-[color-mix(in_oklch,var(--destructive)_12%,transparent)] text-foreground",
			context: "text-muted-foreground",
		},
	},
	defaultVariants: { kind: "context" },
});

export type DiffLineKind = NonNullable<VariantProps<typeof diffRow>["kind"]>;
