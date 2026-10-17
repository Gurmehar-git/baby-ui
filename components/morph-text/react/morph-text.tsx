"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { type MorphTextSize, morphText } from "../variants";

export type { MorphTextSize };

export interface MorphTextProps {
	words: string[];
	/** Controlled: which word is showing. Omit to let the component cycle on its own. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** Time each word stays before morphing. Only runs while uncontrolled. */
	intervalMs?: number;
	/** Line under the word, fading up once after a second. */
	subtext?: string;
	size?: MorphTextSize;
	className?: string;
}

type Shown = { index: number; key: number };

export function MorphText({
	words,
	index: indexProp,
	defaultIndex = 0,
	onIndexChange,
	intervalMs = 3000,
	subtext,
	size = "inherit",
	className,
}: MorphTextProps) {
	const filterId = `morph-${useId().replace(/:/g, "")}`;
	const [internalIndex, setInternalIndex] = useState(defaultIndex);
	const count = words.length;
	const index = count > 0 ? (((indexProp ?? internalIndex) % count) + count) % count : 0;
	const indexRef = useRef(index);
	indexRef.current = index;
	const onChange = useRef(onIndexChange);
	onChange.current = onIndexChange;

	const [shown, setShown] = useState<Shown>({ index, key: 0 });
	const [leaving, setLeaving] = useState<Shown[]>([]);
	if (shown.index !== index) {
		setLeaving((current) => [...current, shown]);
		setShown({ index, key: shown.key + 1 });
	}

	useEffect(() => {
		if (indexProp !== undefined || count <= 1) return;
		const id = setInterval(() => {
			const next = (indexRef.current + 1) % count;
			setInternalIndex(next);
			onChange.current?.(next);
		}, intervalMs);
		return () => clearInterval(id);
	}, [indexProp, count, intervalMs]);

	if (count === 0) return null;
	const styles = morphText({ size, layout: subtext ? "stacked" : "inline" });
	const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

	return (
		<span data-slot="morph-text" className={cn(styles.root(), className)}>
			<svg aria-hidden="true" focusable="false" className={styles.filter()}>
				<filter id={filterId}>
					<feColorMatrix
						in="SourceGraphic"
						result="goo"
						type="matrix"
						values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9"
					/>
					<feComposite in="SourceGraphic" in2="goo" operator="atop" />
				</filter>
			</svg>
			<span className={styles.word()} style={{ filter: `url(#${filterId})` }}>
				<span aria-hidden="true" className={styles.sizer()}>
					{longest}
				</span>
				<span className={styles.stage()}>
					{leaving.map((item) => (
						<span
							key={item.key}
							aria-hidden="true"
							className={cn(styles.item(), "morph-text-exit")}
							onAnimationEnd={() =>
								setLeaving((current) => current.filter((l) => l.key !== item.key))
							}
						>
							{words[item.index]}
						</span>
					))}
					<span key={shown.key} className={cn(styles.item(), "morph-text-enter")}>
						{words[index]}
					</span>
				</span>
			</span>
			{subtext ? <span className={styles.subtext()}>{subtext}</span> : null}
		</span>
	);
}
