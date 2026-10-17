import { tv, type VariantProps } from "tailwind-variants";

export const diaText = tv({
	slots: {
		root: "relative inline-block align-bottom leading-none",
		swap: "inline-block leading-none",
		sweep: "dia-text inline-block -translate-y-[2px] leading-none",
		measure: "pointer-events-none invisible absolute top-0 left-0 whitespace-nowrap",
		srOnly: "sr-only",
	},
	variants: {
		multi: {
			true: {
				root: "overflow-hidden whitespace-nowrap transition-[width] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
			},
			false: {},
		},
		size: {
			inherit: {},
			sm: { root: "text-xl" },
			default: { root: "text-3xl" },
			lg: { root: "text-5xl" },
		},
	},
	defaultVariants: { multi: false, size: "inherit" },
});

export type DiaTextSize = NonNullable<VariantProps<typeof diaText>["size"]>;

/** Colour band the sweep carries, in order; chart tokens so both themes stay legible. */
export const DIA_TEXT_COLORS = [
	"var(--chart-5)",
	"var(--chart-2)",
	"var(--chart-4)",
	"var(--chart-1)",
];

/** 300%-wide fill: text colour, then the band across 34% of the text, then transparent. */
export function diaGradient(colors: string[], textColor: string): string {
	const start = 100 / 3;
	const end = start + 34 / 3;
	const band = colors.map((color, i) => {
		const at =
			colors.length === 1
				? (start + end) / 2
				: start + (i / (colors.length - 1)) * (end - start);
		return `${color} ${at.toFixed(2)}%`;
	});
	return `linear-gradient(90deg, ${textColor} 0%, ${textColor} ${start.toFixed(2)}%, ${band.join(", ")}, transparent ${end.toFixed(2)}%, transparent 100%)`;
}
