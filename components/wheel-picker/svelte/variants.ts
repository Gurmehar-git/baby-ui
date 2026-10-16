import { tv, type VariantProps } from "tailwind-variants";

export const wheelPicker = tv({
	slots: {
		root: "flex w-full min-w-0 items-stretch",
		column: "relative min-w-0 flex-1",
		lens: "pointer-events-none absolute inset-x-1 top-1/2 h-(--wheel-h) -translate-y-1/2 rounded-xl bg-foreground/[0.05]",
		viewport:
			"relative h-[calc(var(--wheel-h)*var(--wheel-rows))] cursor-grab touch-pan-y snap-y snap-mandatory overflow-y-scroll overscroll-contain rounded-xl py-[calc(var(--wheel-h)*(var(--wheel-rows)-1)/2)] outline-none [perspective:calc(var(--wheel-h)*21)] [scrollbar-width:none] select-none [mask-image:linear-gradient(to_bottom,transparent_0%,rgb(0_0_0/0.14)_10%,rgb(0_0_0/0.4)_20%,rgb(0_0_0/0.72)_28%,black_38%,black_62%,rgb(0_0_0/0.72)_72%,rgb(0_0_0/0.4)_80%,rgb(0_0_0/0.14)_90%,transparent_100%)] focus-visible:ring-2 focus-visible:ring-ring/60 data-[dragging]:cursor-grabbing data-[dragging]:snap-none data-[disabled]:pointer-events-none data-[disabled]:opacity-45 [&::-webkit-scrollbar]:hidden",
		item: "flex h-(--wheel-h) snap-center items-center justify-center px-1 font-medium text-lg tabular-nums leading-none [backface-visibility:hidden]",
		label: "truncate data-[disabled]:opacity-40",
	},
	variants: {
		rows: {
			"3": { root: "[--wheel-rows:3]", item: "wheel-picker-item-3" },
			"5": { root: "[--wheel-rows:5]", item: "wheel-picker-item-5" },
			"7": { root: "[--wheel-rows:7]", item: "wheel-picker-item-7" },
		},
		lens: {
			true: {},
			false: { lens: "hidden" },
		},
	},
	defaultVariants: { rows: "5", lens: true },
});

export type WheelPickerRows = NonNullable<VariantProps<typeof wheelPicker>["rows"]>;

export type WheelPickerOption =
	| string
	| { value: string; label?: string; disabled?: boolean };

export type NormalizedWheelOption = { value: string; label: string; disabled: boolean };

export function normalizeWheelOption(option: WheelPickerOption): NormalizedWheelOption {
	if (typeof option === "string")
		return { value: option, label: option, disabled: false };
	return {
		value: option.value,
		label: option.label ?? option.value,
		disabled: option.disabled ?? false,
	};
}

/** Closest enabled index to `index`, searching `direction` first; loops when `loop` is set. */
export function nearestEnabled(
	items: NormalizedWheelOption[],
	index: number,
	direction: number,
	loop: boolean,
): number {
	const count = items.length;
	const wrap = (i: number) => (loop ? ((i % count) + count) % count : i);
	if (count === 0 || !items[wrap(index)]?.disabled) return index;
	const order = direction === 0 ? [1, -1] : [direction, -direction];
	for (let span = 1; span < count; span++) {
		for (const sign of order) {
			const candidate = index + sign * span;
			if (!loop && (candidate < 0 || candidate > count - 1)) continue;
			if (!items[wrap(candidate)]?.disabled) return candidate;
		}
	}
	return index;
}

/** Share of release velocity (px/s) a flick carries past where the pointer let go. */
export const WHEEL_FLICK = 0.22;
