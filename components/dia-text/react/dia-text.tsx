"use client";

import {
	type AnimationEvent,
	type CSSProperties,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { DIA_TEXT_COLORS, type DiaTextSize, diaGradient, diaText } from "../variants";

export type { DiaTextSize };

export interface DiaTextProps {
	/** One string, or several to cycle through when `repeat` is on. */
	text: string | string[];
	/** Band colours, left to right. */
	colors?: string[];
	/** Colour the text settles to behind the band. */
	textColor?: string;
	/** Controlled: which string is showing. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** One sweep, in ms. */
	durationMs?: number;
	delayMs?: number;
	/** Sweep again after each pass, moving to the next string. */
	repeat?: boolean;
	repeatDelayMs?: number;
	/** Wait until scrolled into view before the first sweep. */
	triggerOnView?: boolean;
	/** Keep the widest string's width instead of resizing per string. */
	fixedWidth?: boolean;
	size?: DiaTextSize;
	className?: string;
}

export function DiaText({
	text,
	colors = DIA_TEXT_COLORS,
	textColor = "var(--foreground)",
	index: indexProp,
	defaultIndex = 0,
	onIndexChange,
	durationMs = 1500,
	delayMs = 0,
	repeat = false,
	repeatDelayMs = 500,
	triggerOnView = true,
	fixedWidth = false,
	size = "inherit",
	className,
}: DiaTextProps) {
	const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
	const count = texts.length;
	const multi = count > 1;
	const rootRef = useRef<HTMLSpanElement>(null);
	const measureRef = useRef<HTMLSpanElement>(null);
	const [internalIndex, setInternalIndex] = useState(defaultIndex);
	const index = count > 0 ? (((indexProp ?? internalIndex) % count) + count) % count : 0;
	const [visible, setVisible] = useState(!triggerOnView);
	const [widths, setWidths] = useState<number[]>([]);
	const [run, setRun] = useState({ index, key: 0, swapped: false });
	if (run.index !== index) setRun({ index, key: run.key + 1, swapped: true });
	const onChange = useRef(onIndexChange);
	onChange.current = onIndexChange;
	const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

	useEffect(() => {
		if (!triggerOnView) return setVisible(true);
		const node = rootRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				setVisible(true);
				observer.disconnect();
			},
			{ threshold: 0.1 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [triggerOnView]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: texts.
	useLayoutEffect(() => {
		const node = measureRef.current;
		if (!(node && multi)) return setWidths([]);
		const measure = () =>
			setWidths(Array.from(node.children, (child) => (child as HTMLElement).offsetWidth));
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, [multi, texts]);

	useEffect(() => () => clearTimeout(timer.current), []);

	function onSweepEnd(event: AnimationEvent) {
		if (event.animationName !== "dia-text-sweep" || !repeat) return;
		timer.current = setTimeout(() => {
			if (!multi) return setRun((r) => ({ ...r, key: r.key + 1, swapped: false }));
			const next = (index + 1) % count;
			if (indexProp === undefined) setInternalIndex(next);
			onChange.current?.(next);
		}, repeatDelayMs);
	}

	if (count === 0) return null;
	const styles = diaText({ multi, size });
	const width =
		!multi || widths.length === 0
			? undefined
			: fixedWidth
				? Math.max(...widths)
				: widths[index];

	return (
		<span
			ref={rootRef}
			data-slot="dia-text"
			className={cn(styles.root(), className)}
			style={{ width }}
		>
			{multi ? (
				<span ref={measureRef} aria-hidden="true" className={styles.measure()}>
					{texts.map((t, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						<span key={i} className="inline-block">
							{t}
						</span>
					))}
				</span>
			) : null}
			<span
				key={run.key}
				aria-hidden="true"
				className={cn(styles.swap(), run.swapped && "dia-text-swap")}
			>
				<span
					className={cn(styles.sweep(), visible && "dia-text-sweep")}
					onAnimationEnd={onSweepEnd}
					style={
						{
							backgroundImage: diaGradient(colors, textColor),
							"--dia-duration": `${durationMs}ms`,
							"--dia-delay": `${delayMs}ms`,
						} as CSSProperties
					}
				>
					{texts[index]}
				</span>
			</span>
			<span className={styles.srOnly()}>{texts[index]}</span>
		</span>
	);
}
