"use client";

import { type FormEvent, type KeyboardEvent, useRef, useState } from "react";
import {
	clearSegment,
	type Draft,
	type FieldLayout,
	type SegmentPart,
	segmentRange,
	segmentText,
	stepSegment,
	typeDigit,
} from "./core";

/**
 * Keeps a half-typed draft beside a controlled value. A value changed from outside replaces
 * the draft; an edit emits only when the value it completes to actually changes.
 */
export function useFieldDraft<T, D>(
	value: T | null,
	valueKey: (value: T) => string,
	toDraft: (value: T | null) => D,
	fromDraft: (draft: D) => T | null,
	onValueChange: (value: T | null) => void,
): [D, (draft: D) => void] {
	const key = value === null ? null : valueKey(value);
	const [seen, setSeen] = useState(key);
	const [draft, setDraft] = useState(() => toDraft(value));
	if (key !== seen) {
		setSeen(key);
		setDraft(toDraft(value));
	}
	const change = (next: D) => {
		setDraft(next);
		const nextValue = fromDraft(next);
		const nextKey = nextValue === null ? null : valueKey(nextValue);
		if (nextKey === seen) return;
		setSeen(nextKey);
		onValueChange(nextValue);
	};
	return [draft, change];
}

export interface DateSegmentsProps {
	layout: FieldLayout;
	draft: Draft;
	onDraftChange: (draft: Draft) => void;
	/** Accessible name and empty text per segment. */
	labels: Record<SegmentPart, string>;
	placeholders: Record<SegmentPart, string>;
	hourCycle?: 12 | 24;
	/** Minutes moved per arrow press. */
	step?: number;
	locale?: string;
	disabled?: boolean;
	invalid?: boolean;
	className?: string;
	segmentClassName?: string;
}

/** Spinbutton segments with the locale's literals between them; focus runs across the whole group. */
export function DateSegments({
	layout,
	draft,
	onDraftChange,
	labels,
	placeholders,
	hourCycle = 24,
	step = 1,
	locale,
	disabled = false,
	invalid = false,
	className,
	segmentClassName,
}: DateSegmentsProps) {
	const ref = useRef<HTMLDivElement>(null);
	// The digits the focused segment has taken so far, so "1" then "2" reads as 12.
	const typed = useRef<{ part: SegmentPart; text: string } | null>(null);

	const segments = () => {
		const scope = ref.current?.closest("fieldset") ?? ref.current;
		return [...(scope?.querySelectorAll<HTMLElement>("[role=spinbutton]") ?? [])];
	};
	const move = (from: HTMLElement, delta: number) => {
		const list = segments();
		list[list.indexOf(from) + delta]?.focus();
	};

	function type(part: SegmentPart, target: HTMLElement, key: string) {
		if (part === "dayPeriod") {
			if (/^[ap]$/i.test(key))
				onDraftChange({ ...draft, dayPeriod: /p/i.test(key) ? 1 : 0 });
			return;
		}
		if (!/^\d$/.test(key)) return;
		const before = typed.current?.part === part ? typed.current.text : "";
		const result = typeDigit(draft, part, before, key, hourCycle);
		onDraftChange(result.draft);
		typed.current = result.done ? null : { part, text: result.typed };
		if (result.done) move(target, 1);
	}

	function onKeyDown(part: SegmentPart, event: KeyboardEvent<HTMLSpanElement>) {
		if (disabled) return;
		const target = event.currentTarget;
		const { key } = event;
		if (key === "ArrowUp" || key === "ArrowDown") {
			typed.current = null;
			onDraftChange(
				stepSegment(draft, part, key === "ArrowUp" ? 1 : -1, hourCycle, step),
			);
		} else if (key === "ArrowLeft" || key === "ArrowRight") {
			typed.current = null;
			const rtl = getComputedStyle(target).direction === "rtl";
			move(target, (key === "ArrowRight") !== rtl ? 1 : -1);
		} else if (key === "Backspace" || key === "Delete") {
			typed.current = null;
			if (draft[part] === undefined) move(target, -1);
			else onDraftChange(clearSegment(draft, part));
		} else if (key.length === 1 && !event.metaKey && !event.ctrlKey) {
			type(part, target, key);
		} else return;
		event.preventDefault();
	}

	// Phone keyboards send "Unidentified" keydowns; the characters arrive here instead.
	function onBeforeInput(part: SegmentPart, event: FormEvent<HTMLSpanElement>) {
		event.preventDefault();
		const data = (event.nativeEvent as InputEvent).data ?? "";
		for (const char of data) type(part, event.currentTarget, char);
	}

	return (
		<div ref={ref} data-slot="date-segments" className={className}>
			{layout.map((segment, i) => {
				if (segment.part === "literal") {
					return (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={i}
							aria-hidden="true"
							data-segment="literal"
							className={segmentClassName}
						>
							{segment.text}
						</span>
					);
				}
				const { part } = segment;
				const value = draft[part];
				const [min, max] = segmentRange(part, draft, hourCycle);
				const text = segmentText(part, value, placeholders[part], locale);
				return (
					<span
						key={part}
						role="spinbutton"
						tabIndex={disabled ? -1 : 0}
						contentEditable={!disabled}
						suppressContentEditableWarning
						spellCheck={false}
						autoCorrect="off"
						inputMode={part === "dayPeriod" ? "text" : "numeric"}
						enterKeyHint="next"
						aria-label={labels[part]}
						aria-valuemin={min}
						aria-valuemax={max}
						aria-valuenow={value}
						aria-valuetext={value === undefined ? "Empty" : text}
						aria-disabled={disabled || undefined}
						aria-invalid={invalid || undefined}
						data-segment={part}
						data-invalid={invalid ? "" : undefined}
						className={segmentClassName}
						onKeyDown={(e) => onKeyDown(part, e)}
						onBeforeInput={(e) => onBeforeInput(part, e)}
						onPaste={(e) => e.preventDefault()}
						onBlur={() => {
							typed.current = null;
						}}
					>
						{text}
					</span>
				);
			})}
		</div>
	);
}
