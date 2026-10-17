"use client";

import {
	createElement,
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { Spinner } from "../../spinner/react/spinner";
import { caretAt, cleanDraft, type InlineEditPhase, runSave } from "../edit";
import { type InlineEditSize, type InlineEditVariant, inlineEdit } from "../variants";

export type { InlineEditSize, InlineEditVariant };

export interface InlineEditProps {
	/** The saved value; a new one from outside replaces the text while it is not being edited. */
	value: string;
	/** Persists the new value. Return a promise to show saving; reject it to roll back. */
	onSave: (next: string) => unknown;
	/** Accessible name, e.g. "Project name". */
	label: string;
	/** Returns a message when the draft cannot be saved. */
	validate?: (next: string) => string | null | undefined;
	placeholder?: string;
	/** Wraps and grows in height. Enter saves; Shift+Enter adds a line break. */
	multiline?: boolean;
	/** `title` for names and headings, `body` for descriptions. */
	variant?: InlineEditVariant;
	size?: InlineEditSize;
	/** The element that holds the text, so a title can stay a heading. */
	as?: "span" | "p" | "h1" | "h2" | "h3";
	className?: string;
}

/**
 * Text that edits in place: click to put the caret where you clicked, Enter or blur saves,
 * Escape cancels, and a failed save rolls the text back with a retry.
 */
export function InlineEdit({
	value,
	onSave,
	label,
	validate,
	placeholder = "",
	multiline = false,
	variant = "title",
	size = "default",
	as = "span",
	className,
}: InlineEditProps) {
	const ids = useId();
	const messageId = `${ids}-message`;
	const [shown, setShown] = useState(value);
	const [committed, setCommitted] = useState(value);
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);
	const [phase, setPhase] = useState<InlineEditPhase>("idle");
	const [error, setError] = useState<string | null>(null);
	const [failed, setFailed] = useState<string | null>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const displayRef = useRef<HTMLButtonElement>(null);
	const controlRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
	const selection = useRef<number | "all" | null>(null);
	const refocus = useRef(false);
	const run = useRef(0);
	const timer = useRef(0);

	// A new outside value replaces the text unless someone is typing or a save is in flight.
	const busy = useRef(false);
	busy.current = editing || phase === "saving";
	useEffect(() => {
		setCommitted(value);
		if (!busy.current) setShown(value);
	}, [value]);
	useEffect(() => () => clearTimeout(timer.current), []);

	// Focus follows the mode: into the field at the caret, or back to the text after Enter or Escape.
	useLayoutEffect(() => {
		const field = controlRef.current;
		if (editing && field && selection.current !== null) {
			const at = selection.current;
			selection.current = null;
			field.focus({ preventScroll: true });
			if (at === "all") field.select();
			else field.setSelectionRange(at, at);
		}
		if (!editing && refocus.current) {
			refocus.current = false;
			displayRef.current?.focus({ preventScroll: true });
		}
	});

	const start = (at: number | "all", text = shown) => {
		if (editing || phase === "saving") return;
		setDraft(text);
		setError(null);
		setFailed(null);
		setPhase("idle");
		selection.current = at;
		setEditing(true);
	};
	const save = async (next: string) => {
		const previous = committed;
		const token = ++run.current;
		setShown(next);
		setPhase("saving");
		const ok = await runSave(onSave, next);
		if (token !== run.current) return;
		if (ok) {
			setCommitted(next);
			setPhase("saved");
			clearTimeout(timer.current);
			timer.current = window.setTimeout(
				() => setPhase((p) => (p === "saved" ? "idle" : p)),
				1800,
			);
			return;
		}
		setShown(previous);
		setFailed(next);
		setPhase("failed");
	};
	const submit = (source: "key" | "blur") => {
		const next = cleanDraft(draft, multiline);
		const problem = validate?.(next) || null;
		if (problem) {
			setError(problem);
			if (source === "key") controlRef.current?.focus();
			return;
		}
		setEditing(false);
		setError(null);
		if (source === "key") refocus.current = true;
		if (next !== shown) void save(next);
	};
	const cancel = () => {
		setEditing(false);
		setError(null);
		refocus.current = true;
	};

	const s = inlineEdit({ variant, size });
	const message = error
		? { tone: "error", text: error }
		: phase === "failed"
			? { tone: "failed", text: "Couldn't save." }
			: null;
	const controlProps = {
		ref: controlRef,
		value: draft,
		rows: 1,
		"aria-label": label,
		"aria-invalid": !!error || undefined,
		"aria-describedby": message ? messageId : undefined,
		placeholder,
		className: s.control(),
		onChange: (event: { target: { value: string } }) => {
			setDraft(event.target.value);
			if (error) setError(null);
		},
		onBlur: () => submit("blur"),
		onKeyDown: (event: ReactKeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				cancel();
			} else if (event.key === "Enter" && !(multiline && event.shiftKey)) {
				event.preventDefault();
				submit("key");
			}
		},
	};

	return (
		<span data-slot="inline-edit" className={cn(s.root(), className)}>
			<span className={s.row()}>
				{editing ? (
					<span className={s.field()}>
						<span aria-hidden className={s.sizer()}>
							{`${draft || placeholder} `}
						</span>
						{multiline ? <textarea {...controlProps} /> : <input {...controlProps} />}
					</span>
				) : (
					createElement(
						as,
						{ className: "m-0 min-w-0 font-[inherit] text-[length:inherit]" },
						<button
							ref={displayRef}
							type="button"
							data-phase={phase}
							aria-label={`${label}: ${shown || placeholder}. Edit`}
							className={s.display()}
							onClick={(event) => {
								if (phase === "saving") return;
								// A keyboard press selects all, ready to retype; a click puts the caret where it landed.
								start(
									event.detail === 0
										? "all"
										: caretAt(
												textRef.current?.firstChild,
												event.clientX,
												event.clientY,
												shown.length,
											),
								);
							}}
						>
							<span
								key={shown}
								ref={textRef}
								className={cn(s.text(), !shown && s.placeholder())}
							>
								{shown || placeholder}
							</span>
						</button>,
					)
				)}
				<span aria-hidden className={s.status()}>
					{phase === "saving" && <Spinner size="sm" label="Saving" />}
					<svg
						viewBox="0 0 14 14"
						fill="none"
						aria-hidden
						data-on={phase === "saved"}
						className={s.tick()}
					>
						<path
							d="M3 7.4 5.6 10 11 4.2"
							pathLength={1}
							stroke="currentColor"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</span>
			{message && (
				<span
					id={messageId}
					role={message.tone === "error" ? "alert" : "status"}
					data-tone={message.tone}
					className={s.message()}
				>
					{message.text}
					{failed !== null && message.tone === "failed" && (
						<button
							type="button"
							className={s.retry()}
							onClick={() => start(failed.length, failed)}
						>
							Edit again
						</button>
					)}
				</span>
			)}
			<span className="sr-only" role="status">
				{phase === "saving"
					? `Saving ${label.toLowerCase()}`
					: phase === "saved"
						? `${label} saved`
						: ""}
			</span>
		</span>
	);
}
