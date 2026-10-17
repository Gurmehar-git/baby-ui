"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import {
	flapColumns,
	flapRows,
	flapSteps,
	prefersReducedMotion,
	SPLIT_FLAP_CHARACTERS,
} from "../flap";
import {
	type SplitFlapIndicator,
	type SplitFlapSize,
	type SplitFlapVariant,
	splitFlap,
} from "../variants";

export type { SplitFlapIndicator, SplitFlapSize, SplitFlapVariant };

export interface SplitFlapDisplayProps {
	/** Board text; `\n` starts a new row. Uppercased. */
	value: string;
	/** Cells per row; shorter rows pad with blanks, longer ones are cut. */
	columns?: number;
	variant?: SplitFlapVariant;
	size?: SplitFlapSize;
	/** Colour of the side strips; `none` hides them. */
	indicator?: SplitFlapIndicator;
	/** Time for one flap to fall, per character step. */
	stepMs?: number;
	/** Delay between neighbouring cells starting, for a wave. */
	staggerMs?: number;
	/** Drum order each cell flips through. */
	characters?: string;
	className?: string;
}

type Face = { current: string; prev: string; step: number; flipping: boolean };
type Styles = ReturnType<typeof splitFlap>;

function Half({
	className,
	char,
	styles,
}: {
	className: string;
	char: string;
	styles: Styles;
}) {
	return (
		<span className={className}>
			<span className={styles.char()}>{char}</span>
		</span>
	);
}

function FlapCell({
	char,
	delayMs,
	stepMs,
	characters,
	styles,
}: {
	char: string;
	delayMs: number;
	stepMs: number;
	characters: string;
	styles: Styles;
}) {
	const [face, setFace] = useState<Face>({
		current: " ",
		prev: " ",
		step: 0,
		flipping: false,
	});
	const shown = useRef(" ");

	useEffect(() => {
		const settle = () =>
			setFace((f) => (f.flipping ? { ...f, prev: f.current, flipping: false } : f));
		const steps = flapSteps(shown.current, char, characters);
		if (prefersReducedMotion()) {
			shown.current = char;
			setFace({ current: char, prev: char, step: 0, flipping: false });
			return;
		}
		let i = 0;
		const tick = () => {
			const next = steps[i++] ?? char;
			shown.current = next;
			setFace((f) => ({
				current: next,
				prev: f.current,
				step: f.step + 1,
				flipping: true,
			}));
			timer = setTimeout(i < steps.length ? tick : settle, stepMs);
		};
		// An interrupted flip still lands before the halves collapse to one glyph.
		let timer = setTimeout(
			steps.length > 0 ? tick : settle,
			steps.length > 0 ? delayMs : stepMs,
		);
		return () => clearTimeout(timer);
	}, [char, delayMs, stepMs, characters]);

	return (
		<span className={styles.cell()}>
			<span className={styles.tile()}>
				<span className={styles.top()}>
					<Half className={styles.glyphTop()} char={face.current} styles={styles} />
				</span>
				<span className={styles.bottom()}>
					<Half className={styles.glyphBottom()} char={face.prev} styles={styles} />
				</span>
				{face.flipping && (
					<span key={face.step} className="contents">
						<span className={cn(styles.top(), styles.flapTop())}>
							<Half className={styles.glyphTop()} char={face.prev} styles={styles} />
						</span>
						<span className={cn(styles.bottom(), styles.flapBottom())}>
							<Half
								className={styles.glyphBottom()}
								char={face.current}
								styles={styles}
							/>
						</span>
					</span>
				)}
				<span className={styles.divider()} />
			</span>
		</span>
	);
}

export function SplitFlapDisplay({
	value,
	columns = 24,
	variant = "solid",
	size = "default",
	indicator = "success",
	stepMs = 60,
	staggerMs = 30,
	characters = SPLIT_FLAP_CHARACTERS,
	className,
}: SplitFlapDisplayProps) {
	const styles = splitFlap({ variant, size, indicator });
	const rows = flapRows(value, columns);
	const cols = flapColumns(columns);
	// Rows and cells stay mounted once seen so shrinking can animate closed.
	const [initial] = useState({ rows: rows.length, cols });
	const [extent, setExtent] = useState(initial);
	if (rows.length > extent.rows || cols > extent.cols) {
		setExtent({
			rows: Math.max(extent.rows, rows.length),
			cols: Math.max(extent.cols, cols),
		});
	}

	return (
		<div data-slot="split-flap-display" className={cn(styles.root(), className)}>
			<span className="sr-only" aria-live="polite">
				{value}
			</span>
			<div
				aria-hidden="true"
				className={styles.board()}
				style={
					{
						"--split-flap-ms": `${stepMs}ms`,
						"--split-flap-columns": cols,
					} as CSSProperties
				}
			>
				{Array.from({ length: extent.rows }, (_, r) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
						key={r}
						className={styles.rowShell()}
						data-open={r < rows.length || undefined}
						data-enter={r >= initial.rows || undefined}
						inert={r >= rows.length}
					>
						<div className={styles.rowClip()}>
							<div className={styles.row()}>
								{indicator !== "none" && <span className={styles.indicator()} />}
								<div className={styles.cells()}>
									{Array.from({ length: extent.cols }, (_, c) => (
										<span
											// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
											key={c}
											className={styles.cellShell()}
											data-open={c < cols || undefined}
											data-enter={c >= initial.cols || undefined}
										>
											<span className={styles.cellClip()}>
												<FlapCell
													char={rows[r]?.[c] ?? " "}
													delayMs={(c + r) * staggerMs}
													stepMs={stepMs}
													characters={characters}
													styles={styles}
												/>
											</span>
										</span>
									))}
								</div>
								{indicator !== "none" && <span className={styles.indicator()} />}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
