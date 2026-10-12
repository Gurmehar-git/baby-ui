"use client";

import {
	type KeyboardEvent as ReactKeyboardEvent,
	useEffect,
	useId,
	useState,
} from "react";
import { Button } from "../button/button";
import { cn } from "../lib/cn";
import { isApplePlatform, parseShortcut } from "../lib/shortcut-keys";
import { shortcutCap } from "../shortcut/variants";
import {
	comboFromEvent,
	comboKey,
	hasModifier,
	heldCaps,
	heldModifiers,
	RESERVED_SHORTCUTS,
	type ShortcutBinding,
} from "./recorder";
import { type ShortcutRecorderSize, shortcutRecorder } from "./variants";

export type { ShortcutBinding, ShortcutRecorderSize };

export interface ShortcutRecorderProps {
	/** Accessible name, e.g. "Open search". */
	label: string;
	/** The shortcut as tokens, e.g. `"mod+shift+k"`; null is unset. */
	value?: string | null;
	defaultValue?: string | null;
	/** `replaced` is the binding it was taken from after "Use anyway", so you can unbind it. */
	onValueChange?: (value: string | null, details: { replaced?: ShortcutBinding }) => void;
	/** What the reset button restores. */
	resetValue?: string | null;
	/** Shortcuts already in use; recording one asks before taking it. */
	bindings?: ShortcutBinding[];
	/** Also warn about combinations the browser or system keeps, such as Command W. */
	warnReserved?: boolean;
	/** Require Command, Ctrl or Alt, so the shortcut cannot clash with typing. */
	requireModifier?: boolean;
	placeholder?: string;
	disabled?: boolean;
	size?: ShortcutRecorderSize;
	className?: string;
}

type Pending = { combo: string; reason: string; replaced?: ShortcutBinding };

/**
 * A field that records a keyboard shortcut: press it to listen, press the keys, and it warns
 * before taking a combination that is already bound or kept by the system.
 */
export function ShortcutRecorder({
	label,
	value,
	defaultValue = null,
	onValueChange,
	resetValue = defaultValue,
	bindings = [],
	warnReserved = true,
	requireModifier = true,
	placeholder = "Record shortcut",
	disabled = false,
	size = "default",
	className,
}: ShortcutRecorderProps) {
	const [own, setOwn] = useState(defaultValue);
	const current = value !== undefined ? value : own;
	const [recording, setRecording] = useState(false);
	const [held, setHeld] = useState<string[]>([]);
	const [pending, setPending] = useState<Pending | null>(null);
	const [message, setMessage] = useState("");
	const [apple, setApple] = useState(true);
	useEffect(() => setApple(isApplePlatform()), []);
	const statusId = useId();

	const commit = (next: string | null, replaced?: ShortcutBinding) => {
		if (value === undefined) setOwn(next);
		onValueChange?.(next, { replaced });
		setPending(null);
		setRecording(false);
		setHeld([]);
		setMessage(
			next
				? `Shortcut set to ${parseShortcut(next, apple)?.spoken ?? next}`
				: "Shortcut cleared",
		);
	};

	const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
		if (!recording) return;
		event.preventDefault();
		event.stopPropagation();
		const native = event.nativeEvent;
		if (event.key === "Escape" && !heldModifiers(native, apple).length) {
			setRecording(false);
			setHeld([]);
			setMessage("Recording cancelled");
			return;
		}
		if (
			(event.key === "Backspace" || event.key === "Delete") &&
			!heldModifiers(native, apple).length
		) {
			commit(null);
			return;
		}
		const combo = comboFromEvent(native, apple);
		if (!combo) {
			setHeld(heldModifiers(native, apple));
			return;
		}
		if (!parseShortcut(combo, apple)) return;
		if (requireModifier && !hasModifier(combo)) {
			setMessage("Add Command, Ctrl or Option to the keys.");
			return;
		}
		const taken = bindings.find(
			(binding) => comboKey(binding.shortcut) === comboKey(combo),
		);
		if (taken) {
			setRecording(false);
			setPending({ combo, reason: `Already used by "${taken.label}".`, replaced: taken });
			return;
		}
		if (
			warnReserved &&
			RESERVED_SHORTCUTS.some((reserved) => comboKey(reserved) === comboKey(combo))
		) {
			setRecording(false);
			setPending({ combo, reason: "Your browser or system may keep this shortcut." });
			return;
		}
		commit(combo);
	};

	const s = shortcutRecorder({ size });
	// Caps can repeat, so each one is keyed by its place in the combo.
	const kbds = (list: string[]) =>
		list
			.map((cap, place) => ({ cap, id: `${place}:${cap}` }))
			.map(({ cap, id }) => (
				<kbd key={id} aria-hidden className={shortcutCap({ size: "default" })}>
					{cap}
				</kbd>
			));
	const shown = pending?.combo ?? current;

	return (
		<div data-slot="shortcut-recorder" className={cn(s.root(), className)}>
			<div className={s.row()}>
				<button
					type="button"
					disabled={disabled}
					data-recording={recording}
					aria-label={`${label}: ${shown ? (parseShortcut(shown, apple)?.spoken ?? shown) : "not set"}. ${recording ? "Recording, press keys" : "Press to record"}`}
					aria-describedby={statusId}
					className={s.field()}
					onClick={() => {
						setPending(null);
						setRecording((on) => !on);
						setMessage(recording ? "" : "Recording. Press the keys, Escape to cancel.");
					}}
					onKeyDown={onKeyDown}
					onKeyUp={(event) =>
						recording && setHeld(heldModifiers(event.nativeEvent, apple))
					}
					onBlur={() => {
						setRecording(false);
						setHeld([]);
					}}
				>
					{recording ? (
						held.length ? (
							kbds(heldCaps(held, apple))
						) : (
							<span className={s.placeholder()}>Press keys…</span>
						)
					) : shown ? (
						kbds(parseShortcut(shown, apple)?.caps ?? shown.split("+"))
					) : (
						<span className={s.placeholder()}>{placeholder}</span>
					)}
					{recording && (
						<span aria-hidden className={s.hint()}>
							Recording
						</span>
					)}
				</button>
				{current && !recording && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						disabled={disabled}
						onClick={() => commit(null)}
					>
						Clear
					</Button>
				)}
				{resetValue && resetValue !== current && !recording && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						disabled={disabled}
						onClick={() => commit(resetValue)}
					>
						Reset
					</Button>
				)}
			</div>
			{pending && (
				<div role="alert" className={s.warning()}>
					{pending.reason}
					<button
						type="button"
						className={s.action()}
						onClick={() => commit(pending.combo, pending.replaced)}
					>
						Use anyway
					</button>
					<button type="button" className={s.action()} onClick={() => setPending(null)}>
						Cancel
					</button>
				</div>
			)}
			<span id={statusId} className="sr-only" role="status">
				{message}
			</span>
		</div>
	);
}
