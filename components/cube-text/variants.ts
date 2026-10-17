import { tv, type VariantProps } from "tailwind-variants";

export const cubeText = tv({
	slots: {
		root: "inline-block font-bold leading-none perspective-[1000px]",
		word: "inline-block whitespace-nowrap transform-3d",
		char: "cube-char",
	},
	variants: {
		size: {
			sm: { root: "text-2xl" },
			default: { root: "text-4xl" },
			lg: { root: "text-6xl" },
		},
		stagger: {
			wave: {},
			together: {},
		},
	},
	defaultVariants: { size: "default", stagger: "wave" },
});

export type CubeTextSize = NonNullable<VariantProps<typeof cubeText>["size"]>;
export type CubeTextStagger = NonNullable<VariantProps<typeof cubeText>["stagger"]>;

export type CubeGlyph = { char: string; delayMs: number };

/** Words of glyphs, each delayed along a quarter-sine ramp so the roll sweeps left to right. */
export function cubeWords(
	text: string,
	durationMs: number,
	delayMs: number,
	stagger: CubeTextStagger,
): CubeGlyph[][] {
	const total = Math.max(1, text.length);
	let index = 0;
	return text.split(" ").map((word) => {
		const glyphs = [...word].map((char) => {
			const ramp = Math.sin(((index++ / total) * Math.PI) / 2) * durationMs * 0.25;
			return { char, delayMs: stagger === "wave" ? ramp + delayMs : delayMs };
		});
		index++;
		return glyphs;
	});
}
