import { tv, type VariantProps } from "tailwind-variants";

// Spare 4th track: a wide LoadingStatePreview spans into it instead of spreading the row apart.
export const loadingState = tv({
	slots: {
		root: "grid w-fit grid-cols-[auto_auto_auto_1fr] items-center gap-x-2.5",
		indicator: "grid shrink-0 grid-cols-[repeat(3,4px)] gap-[1.5px]",
		cell: "size-[4px] rounded-[1px] bg-foreground",
		label: "reasoning-shimmer font-medium text-sm",
		elapsed: "font-mono text-muted-foreground text-xs tabular-nums",
		preview:
			"pop-in col-span-full mt-2 w-56 origin-top-left overflow-hidden rounded-[10px] shadow-(--overlay-shadow)",
		frame: "relative aspect-video w-full bg-muted",
		video: "h-full w-full object-cover",
		fallback: "flex h-full w-full flex-col items-center justify-center gap-1.5",
		fallbackText: "px-3 text-center font-mono text-muted-foreground text-xs",
	},
	variants: {
		variant: {
			drive: {},
			dots: { cell: "rounded-full" },
			orbit: {},
		},
	},
	defaultVariants: { variant: "drive" },
});

export type LoadingStateVariant = NonNullable<
	VariantProps<typeof loadingState>["variant"]
>;

const CHEVRON = Array.from({ length: 9 }, (_, i) => {
	const row = Math.floor(i / 3);
	const col = i % 3;
	return (col + Math.abs(row - 1)) * 90;
});

const ORBIT_ORDER = [0, 1, 2, 5, 8, 7, 6, 3];
const ORBIT = Array.from({ length: 9 }, (_, i) => {
	const step = ORBIT_ORDER.indexOf(i);
	return step === -1 ? null : step * 110;
});

/** Per-cell animation delays (null cells stay dim) and the sweep length per variant. */
export const LOADING_PATTERNS: Record<
	LoadingStateVariant,
	{ delays: (number | null)[]; duration: number }
> = {
	drive: { delays: CHEVRON, duration: 650 },
	dots: { delays: CHEVRON, duration: 650 },
	orbit: { delays: ORBIT, duration: 950 },
};

export function formatElapsed(deciseconds: number) {
	const total = deciseconds / 10;
	if (total < 60) return `${total.toFixed(1)}s`;
	return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
}
