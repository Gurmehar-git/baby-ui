import { tv, type VariantProps } from "tailwind-variants";

export const recordsTable = tv({
	slots: {
		root: "",
		table:
			"border-collapse text-sm transition-[width,min-width] duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		cell: "px-3",
		headerCell: "px-3",
		row: "transition-colors",
		pinCell: "bg-card",
		aiCol:
			"transition-[width] duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		aiCell:
			"transition-[padding,opacity] duration-(--duration-slow) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		// minmax(0,1fr) gives the cell a zero min-content, so the col width alone sizes it.
		aiInner: "grid grid-cols-[minmax(0,1fr)] overflow-hidden",
	},
	variants: {
		density: {
			comfortable: { cell: "py-2", headerCell: "py-2" },
			compact: { cell: "py-1", headerCell: "py-1.5" },
		},
		selected: {
			true: {
				row: "bg-primary/[0.04]",
				pinCell: "bg-[color-mix(in_oklab,var(--primary)_4%,var(--card))]",
			},
			false: {},
		},
		aiShown: {
			true: {},
			false: { aiCell: "border-r-0 px-0 opacity-0" },
		},
	},
	defaultVariants: { density: "comfortable", selected: false, aiShown: true },
});

export type RecordsDensity = NonNullable<VariantProps<typeof recordsTable>["density"]>;

export const strengthDot = tv({
	base: "size-1.5 shrink-0 rounded-full",
	variants: {
		strength: {
			strong: "bg-success",
			weak: "bg-warning",
			veryweak: "bg-destructive",
			none: "bg-muted-foreground",
		},
	},
	defaultVariants: { strength: "none" },
});

export type RecordStrength = NonNullable<VariantProps<typeof strengthDot>["strength"]>;

const TAG_TONES = [
	"bg-[color-mix(in_oklch,oklch(0.76_0.13_70)_15%,transparent)] text-[oklch(0.4_0.1_70)] dark:text-[oklch(0.85_0.1_70)]",
	"bg-[color-mix(in_oklch,oklch(0.77_0.16_122)_15%,transparent)] text-[oklch(0.38_0.12_122)] dark:text-[oklch(0.84_0.13_122)]",
	"bg-[color-mix(in_oklch,oklch(0.62_0.18_293)_15%,transparent)] text-[oklch(0.45_0.16_293)] dark:text-[oklch(0.8_0.13_293)]",
	"bg-[color-mix(in_oklch,oklch(0.71_0.16_48)_15%,transparent)] text-[oklch(0.4_0.13_48)] dark:text-[oklch(0.82_0.12_48)]",
	"bg-[color-mix(in_oklch,oklch(0.72_0.10_221)_15%,transparent)] text-[oklch(0.38_0.08_221)] dark:text-[oklch(0.82_0.08_221)]",
	"bg-[color-mix(in_oklch,oklch(0.64_0.19_27)_15%,transparent)] text-[oklch(0.45_0.16_27)] dark:text-[oklch(0.82_0.13_27)]",
	"bg-[color-mix(in_oklch,oklch(0.66_0.21_323)_15%,transparent)] text-[oklch(0.45_0.18_323)] dark:text-[oklch(0.84_0.15_323)]",
	"bg-[color-mix(in_oklch,oklch(0.70_0.13_162)_15%,transparent)] text-[oklch(0.38_0.1_162)] dark:text-[oklch(0.82_0.1_162)]",
	"bg-[color-mix(in_oklch,oklch(0.67_0.19_3)_15%,transparent)] text-[oklch(0.45_0.16_3)] dark:text-[oklch(0.84_0.13_3)]",
	"bg-[color-mix(in_oklch,oklch(0.8_0.15_101)_15%,transparent)] text-[oklch(0.4_0.11_101)] dark:text-[oklch(0.82_0.1_101)]",
];

/** Hashes a tag's own text to a stable palette slot, so colour never depends on a fixed
 * tag vocabulary the caller's real tags won't match. */
export function tagToneClass(tag: string): string {
	let hash = 0;
	for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
	return TAG_TONES[hash % TAG_TONES.length] as string;
}
