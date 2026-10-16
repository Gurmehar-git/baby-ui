"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/react/cn";
import { typingStumbleSteps } from "./stumble";
import { type TypingTextSize, typingText } from "./variants";

export type { TypingTextSize };

export interface TypingTextProps {
	text: string;
	/** Delay between typing each character (or word, in `smooth` mode), in ms. */
	delay?: number;
	/** Erase after typing, then type again. */
	repeat?: boolean;
	/** Time to hold before the next cycle. Only applies when `repeat` is true. */
	waitMs?: number;
	/** Fades whole words in instead of typing character by character. */
	smooth?: boolean;
	/** How long each word's fade-in takes, in ms. Only applies when `smooth` is true. */
	fadeDurationMs?: number;
	/** Grow the container to fit the text as it types, instead of reserving full width up front. */
	grow?: boolean;
	/** Hide the blinking cursor once typing completes. */
	hideCursorOnComplete?: boolean;
	/** Types like a person: wrong keys appear and get corrected. `delay` scales the pace. */
	stumbles?: boolean;
	onComplete?: () => void;
	size?: TypingTextSize;
	className?: string;
}

// The stumble frames are timed at a 32ms reference delay; `delay` scales them.
function StumbleTyping({
	text,
	delay,
	repeat,
	waitMs,
	grow,
	hideCursorOnComplete,
	onComplete,
	size,
	className,
}: Required<Pick<TypingTextProps, "text" | "delay" | "repeat" | "waitMs" | "grow">> &
	Pick<TypingTextProps, "hideCursorOnComplete" | "onComplete" | "size" | "className">) {
	const [pass, setPass] = useState(0);
	const [step, setStep] = useState(0);
	const [reduced, setReduced] = useState(false);
	const steps = useMemo(() => typingStumbleSteps(text, pass), [text, pass]);
	const onDone = useRef(onComplete);
	onDone.current = onComplete;
	const blinkOn = useBlink(500);
	const done = step >= steps.length;

	useEffect(() => {
		const query = matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(query.matches);
		const update = () => setReduced(query.matches);
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: text.
	useEffect(() => {
		setPass(0);
		setStep(0);
	}, [text]);

	useEffect(() => {
		if (reduced) return;
		if (done) {
			onDone.current?.();
			if (!repeat) return;
			const id = setTimeout(() => {
				setPass((p) => p + 1);
				setStep(0);
			}, waitMs);
			return () => clearTimeout(id);
		}
		const id = setTimeout(
			() => setStep((s) => s + 1),
			(steps[step]?.wait ?? 0) * (delay / 32),
		);
		return () => clearTimeout(id);
	}, [reduced, done, step, steps, repeat, waitMs, delay]);

	const shown = reduced || done ? text : (steps[step]?.text ?? "");
	const showCursor = !hideCursorOnComplete || !(done && !repeat);

	return (
		<div data-slot="typing-text" className={cn(typingText({ size }), className)}>
			<span className="sr-only">{text}</span>
			{!grow && (
				<div aria-hidden className="invisible">
					{text}
				</div>
			)}
			<div aria-hidden className={cn(!grow && "absolute inset-0")}>
				{shown}
				{showCursor ? (
					<span className={blinkOn || done ? "" : "opacity-0"}>|</span>
				) : null}
			</div>
		</div>
	);
}

function useBlink(intervalMs: number) {
	const [on, setOn] = useState(true);
	useEffect(() => {
		const id = setInterval(() => setOn((v) => !v), intervalMs);
		return () => clearInterval(id);
	}, [intervalMs]);
	return on;
}

export function TypingText({
	text,
	delay = 32,
	repeat = true,
	waitMs = 1000,
	smooth = false,
	fadeDurationMs = 300,
	grow = false,
	hideCursorOnComplete = false,
	stumbles = false,
	onComplete,
	size = "default",
	className,
}: TypingTextProps) {
	if (stumbles && !smooth)
		return (
			<StumbleTyping
				text={text}
				delay={delay}
				repeat={repeat}
				waitMs={waitMs}
				grow={grow}
				hideCursorOnComplete={hideCursorOnComplete}
				onComplete={onComplete}
				size={size}
				className={className}
			/>
		);
	return (
		<PlainTyping
			text={text}
			delay={delay}
			repeat={repeat}
			waitMs={waitMs}
			smooth={smooth}
			fadeDurationMs={fadeDurationMs}
			grow={grow}
			hideCursorOnComplete={hideCursorOnComplete}
			onComplete={onComplete}
			size={size}
			className={className}
		/>
	);
}

function PlainTyping({
	text,
	delay = 32,
	repeat = true,
	waitMs = 1000,
	smooth = false,
	fadeDurationMs = 300,
	grow = false,
	hideCursorOnComplete = false,
	onComplete,
	size = "default",
	className,
}: Omit<TypingTextProps, "stumbles">) {
	const words = useMemo(() => text.split(/\s+/), [text]);
	const total = smooth ? words.length : text.length;
	const [index, setIndex] = useState(0);
	const [direction, setDirection] = useState<1 | -1>(1);
	const onCompleteRef = useRef(onComplete);
	const completedRef = useRef(false);
	onCompleteRef.current = onComplete;
	const blinkOn = useBlink(500);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run triggers the body never reads: text.
	useEffect(() => {
		setIndex(0);
		setDirection(1);
		completedRef.current = false;
	}, [text]);

	const atEnd = index >= total;
	const atStart = index <= 0;
	const paused = (atEnd && direction === 1) || (atStart && direction === -1);

	useEffect(() => {
		if (paused) return;
		const step = Math.max(1, delay);
		const id = setInterval(() => {
			setIndex((current) => {
				const next = current + direction;
				return direction === 1 ? Math.min(next, total) : Math.max(next, 0);
			});
		}, step);
		return () => clearInterval(id);
	}, [paused, direction, delay, total]);

	useEffect(() => {
		if (atEnd && direction === 1) {
			if (!repeat) {
				if (!completedRef.current) {
					completedRef.current = true;
					onCompleteRef.current?.();
				}
				return;
			}
			const id = setTimeout(() => setDirection(-1), waitMs);
			return () => clearTimeout(id);
		}
		if (atStart && direction === -1 && repeat) {
			const id = setTimeout(() => setDirection(1), waitMs);
			return () => clearTimeout(id);
		}
	}, [atEnd, atStart, direction, repeat, waitMs]);

	const isComplete = index === total && !repeat;
	const showCursor = !smooth && (!hideCursorOnComplete || !isComplete);

	return (
		<div
			data-slot="typing-text"
			className={cn(typingText({ size }), className)}
			style={{ "--tt-fade-duration": `${fadeDurationMs}ms` } as CSSProperties}
		>
			{!grow && <div className="invisible">{text}</div>}
			<div className={cn(!grow && "absolute inset-0")}>
				{smooth ? (
					<span className="flex flex-wrap whitespace-pre">
						{words.map((word, i) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								key={i}
								className={cn(
									"transition-opacity duration-[var(--tt-fade-duration,300ms)] ease-[var(--ease-ui-in-out)]",
									i < index ? "opacity-100" : "opacity-0",
								)}
							>
								{word}
								{i < words.length - 1 ? <span>&nbsp;</span> : null}
							</span>
						))}
					</span>
				) : (
					text.slice(0, index)
				)}
				{showCursor ? (
					<span className={blinkOn || atEnd || atStart ? "" : "opacity-0"}>|</span>
				) : null}
			</div>
		</div>
	);
}
