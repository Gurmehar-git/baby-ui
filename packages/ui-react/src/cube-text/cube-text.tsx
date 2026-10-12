import { type CSSProperties, useMemo } from "react";
import { cn } from "../lib/cn";
import { type CubeTextSize, type CubeTextStagger, cubeText, cubeWords } from "./variants";

export type { CubeTextSize, CubeTextStagger };

export interface CubeTextProps {
	text: string;
	/** One roll, in ms; the glyph rolls in the first quarter and rests for the rest. */
	durationMs?: number;
	delayMs?: number;
	loop?: boolean;
	/** `wave` sweeps the roll across the text; `together` rolls every glyph at once. */
	stagger?: CubeTextStagger;
	size?: CubeTextSize;
	className?: string;
}

export function CubeText({
	text,
	durationMs = 2200,
	delayMs = 0,
	loop = true,
	stagger = "wave",
	size = "default",
	className,
}: CubeTextProps) {
	const s = cubeText({ size, stagger });
	const words = useMemo(
		() => cubeWords(text, durationMs, delayMs, stagger),
		[text, durationMs, delayMs, stagger],
	);

	return (
		<span data-slot="cube-text" className={cn(s.root(), className)}>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true">
				{words.map((glyphs, w) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
					<span key={w}>
						{w > 0 ? " " : null}
						<span className={s.word()}>
							{glyphs.map((glyph, g) => (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: characters of one string never reorder, so position is the identity.
									key={g}
									data-char={glyph.char}
									className={s.char()}
									style={
										{
											"--cube-duration": `${durationMs}ms`,
											"--cube-delay": `${glyph.delayMs}ms`,
											"--cube-iterations": loop ? "infinite" : "1",
										} as CSSProperties
									}
								>
									{glyph.char}
								</span>
							))}
						</span>
					</span>
				))}
			</span>
		</span>
	);
}
