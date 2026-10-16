"use client";

import {
	type CSSProperties,
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar/react/avatar";
import { cn } from "../../lib/react/cn";
import {
	EMPTY_MENTIONS,
	findTrigger,
	initials,
	insertMention,
	type Mention,
	type MentionChannel,
	type MentionKind,
	type MentionPerson,
	type MentionValue,
	reconcileMentions,
	snapOutOfMentions,
	suggestMentions,
} from "./mention";
import { type MentionInputSize, mentionInput } from "./variants";

export type {
	Mention,
	MentionChannel,
	MentionInputSize,
	MentionKind,
	MentionPerson,
	MentionValue,
};

export interface MentionInputProps {
	value?: MentionValue;
	defaultValue?: MentionValue;
	onValueChange?: (value: MentionValue) => void;
	/** People offered after `@`; leave it out to turn person mentions off. */
	people?: MentionPerson[];
	/** Channels offered after `#`; leave it out to turn channel mentions off. */
	channels?: MentionChannel[];
	onMentionAdd?: (mention: Mention) => void;
	/** With `submitOnEnter`, Enter submits and Shift+Enter adds a line. */
	onSubmit?: (value: MentionValue) => void;
	submitOnEnter?: boolean;
	placeholder?: string;
	minRows?: number;
	/** The field grows to this many rows, then scrolls. */
	maxRows?: number;
	/** Which side of the field the suggestions open on. */
	side?: "top" | "bottom";
	size?: MentionInputSize;
	maxSuggestions?: number;
	disabled?: boolean;
	/** Submits the text with mentions as typed. */
	name?: string;
	"aria-label"?: string;
	className?: string;
}

/**
 * A textarea with `@` people and `#` channel mentions. Mentions are atomic: the caret steps
 * over them and one Backspace removes the whole token.
 */
export function MentionInput({
	value,
	defaultValue = EMPTY_MENTIONS,
	onValueChange,
	people,
	channels,
	onMentionAdd,
	onSubmit,
	submitOnEnter = false,
	placeholder,
	minRows = 2,
	maxRows = 8,
	side = "bottom",
	size = "default",
	maxSuggestions = 6,
	disabled = false,
	name,
	"aria-label": ariaLabel = "Message",
	className,
}: MentionInputProps) {
	const [own, setOwn] = useState(defaultValue);
	const current = value ?? own;
	const [caret, setCaret] = useState<number | null>(null);
	const [active, setActive] = useState(0);
	const [dismissed, setDismissed] = useState<number | null>(null);
	const areaRef = useRef<HTMLTextAreaElement>(null);
	const mirrorRef = useRef<HTMLDivElement>(null);
	const pendingCaret = useRef<number | null>(null);
	const lastCaret = useRef(0);
	const listId = useId();

	const kinds = { person: !!people, channel: !!channels };
	const trigger =
		caret === null ? null : findTrigger(current.text, caret, current.mentions, kinds);
	const open = !!trigger && trigger.start !== dismissed;
	const suggestions = trigger
		? suggestMentions(trigger, people ?? [], channels ?? [], maxSuggestions)
		: [];
	const activeIndex = Math.min(active, Math.max(0, suggestions.length - 1));

	useLayoutEffect(() => {
		const area = areaRef.current;
		if (!area || pendingCaret.current === null) return;
		area.setSelectionRange(pendingCaret.current, pendingCaret.current);
		pendingCaret.current = null;
	});

	const commit = (next: MentionValue) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next);
	};
	const choose = (index: number) => {
		const pick = suggestions[index];
		if (!pick || !trigger || caret === null) return;
		const result = insertMention(current, trigger, caret, pick);
		commit(result.value);
		pendingCaret.current = result.caret;
		setCaret(result.caret);
		setActive(0);
		onMentionAdd?.(result.mention);
	};
	const syncCaret = () => {
		const area = areaRef.current;
		if (!area) return;
		let start = snapOutOfMentions(area.selectionStart, current.mentions);
		let end = snapOutOfMentions(area.selectionEnd, current.mentions);
		if (start > end) [start, end] = [end, start];
		if (start !== area.selectionStart || end !== area.selectionEnd)
			area.setSelectionRange(start, end);
		lastCaret.current = area.selectionStart;
		setCaret(start === end ? start : null);
	};

	const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
		const area = event.currentTarget;
		lastCaret.current = area.selectionStart;
		if (open && suggestions.length) {
			if (event.key === "ArrowDown" || event.key === "ArrowUp") {
				event.preventDefault();
				const step = event.key === "ArrowDown" ? 1 : -1;
				setActive((activeIndex + step + suggestions.length) % suggestions.length);
				return;
			}
			if (event.key === "Enter" || event.key === "Tab") {
				event.preventDefault();
				choose(activeIndex);
				return;
			}
		}
		if (open && event.key === "Escape") {
			event.preventDefault();
			setDismissed(trigger?.start ?? null);
			return;
		}
		const start = area.selectionStart;
		const end = area.selectionEnd;
		// One Backspace or Delete removes a whole mention.
		if (
			start === end &&
			!event.metaKey &&
			(event.key === "Backspace" || event.key === "Delete")
		) {
			const hit = current.mentions.find((m) =>
				event.key === "Backspace"
					? start > m.start && start <= m.end
					: start >= m.start && start < m.end,
			);
			if (hit) {
				event.preventDefault();
				commit({
					text: current.text.slice(0, hit.start) + current.text.slice(hit.end),
					mentions: current.mentions
						.filter((m) => m !== hit)
						.map((m) =>
							m.start > hit.start
								? {
										...m,
										start: m.start - (hit.end - hit.start),
										end: m.end - (hit.end - hit.start),
									}
								: m,
						),
				});
				pendingCaret.current = hit.start;
				setCaret(hit.start);
				return;
			}
		}
		if (
			submitOnEnter &&
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			onSubmit?.(current);
		}
	};

	const s = mentionInput({ size });
	const mirror: ReactNode[] = [];
	let at = 0;
	for (const m of current.mentions) {
		mirror.push(current.text.slice(at, m.start));
		mirror.push(
			<span key={`${m.start}:${m.id}`} data-mention="" className={s.chip()}>
				{current.text.slice(m.start, m.end)}
			</span>,
		);
		at = m.end;
	}
	mirror.push(`${current.text.slice(at)} `);
	const rows = { "--mi-min": minRows, "--mi-max": maxRows } as CSSProperties;
	const activeId =
		open && suggestions[activeIndex] ? `${listId}-${activeIndex}` : undefined;

	return (
		<div data-slot="mention-input" className={cn(s.root(), className)}>
			<div className={s.frame()} style={rows}>
				<div ref={mirrorRef} aria-hidden className={s.mirror()}>
					{mirror}
				</div>
				<textarea
					ref={areaRef}
					role="combobox"
					aria-label={ariaLabel}
					aria-expanded={open}
					aria-controls={open ? listId : undefined}
					aria-autocomplete="list"
					aria-activedescendant={activeId}
					rows={minRows}
					disabled={disabled}
					placeholder={placeholder}
					value={current.text}
					className={s.area()}
					onChange={(event) => {
						const text = event.target.value;
						commit({
							text,
							mentions: reconcileMentions(current, text, lastCaret.current),
						});
						setCaret(
							event.target.selectionStart === event.target.selectionEnd
								? event.target.selectionStart
								: null,
						);
						lastCaret.current = event.target.selectionStart;
						setActive(0);
						setDismissed(null);
					}}
					onSelect={syncCaret}
					onKeyDown={onKeyDown}
					onBlur={() => setCaret(null)}
					onScroll={(event) => {
						if (mirrorRef.current)
							mirrorRef.current.scrollTop = event.currentTarget.scrollTop;
					}}
				/>
			</div>
			{open && (
				<div
					id={listId}
					role="listbox"
					data-side={side}
					aria-label={trigger?.kind === "person" ? "People" : "Channels"}
					className={s.list()}
				>
					{suggestions.length === 0 && <div className={s.empty()}>No matches</div>}
					{suggestions.map((item, index) => (
						// biome-ignore lint/a11y/useKeyWithClickEvents: the textarea drives the list with aria-activedescendant
						<div
							key={`${item.kind}:${item.id}`}
							id={`${listId}-${index}`}
							role="option"
							tabIndex={-1}
							aria-selected={index === activeIndex}
							data-active={index === activeIndex}
							className={s.option()}
							onPointerDown={(event) => event.preventDefault()}
							onPointerMove={() => setActive(index)}
							onClick={() => choose(index)}
						>
							{item.kind === "person" ? (
								<Avatar size="sm" className="size-6 text-xs">
									<AvatarFallback>{initials(item.label)}</AvatarFallback>
									{item.avatar && <AvatarImage src={item.avatar} alt="" />}
								</Avatar>
							) : (
								<span aria-hidden className={s.hash()}>
									#
								</span>
							)}
							<span className="grid min-w-0">
								<span className="truncate">{item.label}</span>
								{item.detail && <span className={s.detail()}>{item.detail}</span>}
							</span>
						</div>
					))}
				</div>
			)}
			{name && <input type="hidden" name={name} value={current.text} />}
		</div>
	);
}
