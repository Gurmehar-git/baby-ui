"use client";

import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { button } from "../button/variants";
import { cn } from "../lib/cn";
import { trackActiveWidth } from "../lib/morph";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import { Spinner } from "../spinner/spinner";
import {
	type ConfirmMorphFace,
	type ConfirmMorphMode,
	type ConfirmMorphState,
	createConfirmMorph,
} from "./confirm";
import {
	type ConfirmMorphSize,
	type ConfirmMorphVariant,
	confirmMorph,
} from "./variants";

export type {
	ConfirmMorphMode,
	ConfirmMorphSize,
	ConfirmMorphState,
	ConfirmMorphVariant,
};

export interface ConfirmMorphProps {
	/** The resting label, e.g. "Delete project". */
	label: string;
	icon?: ReactNode;
	/** The question while confirming; defaults to the label with a question mark. */
	prompt?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Beside the spinner while `onConfirm` resolves. */
	pendingLabel?: string;
	doneLabel?: string;
	errorLabel?: string;
	retryLabel?: string;
	undoLabel?: string;
	/** Beside the spinner while `onUndo` resolves. */
	undoingLabel?: string;
	/** Text before the seconds in `countdown` mode; defaults to the pending label plus "in". */
	countdownLabel?: string;
	/** Colour of the confirm answer: destructive for actions that destroy, default for reversible ones. */
	variant?: ConfirmMorphVariant;
	size?: ConfirmMorphSize;
	mode?: ConfirmMorphMode;
	/** Milliseconds the confirm must be held in `hold` mode. */
	holdDuration?: number;
	/** Seconds counted down in `countdown` mode. */
	countdown?: number;
	/** Runs on confirm. A promise shows the pending face; a rejection shows the error face. */
	onConfirm?: () => unknown;
	/** Offering it adds Undo to the result. */
	onUndo?: () => unknown;
	onCancel?: () => void;
	state?: ConfirmMorphState;
	defaultState?: ConfirmMorphState;
	onStateChange?: (state: ConfirmMorphState) => void;
	/** Milliseconds before an unanswered question returns to rest; 0 turns it off. */
	confirmTimeout?: number;
	/** Milliseconds a result stays before returning to rest; 0 turns it off. */
	resultTimeout?: number;
	cancelOnOutsidePress?: boolean;
	disabled?: boolean;
	className?: string;
}

function Face({
	id,
	current,
	className,
	labelledBy,
	children,
}: {
	id: ConfirmMorphFace;
	current: ConfirmMorphFace;
	className: string;
	labelledBy?: string;
	children: ReactNode;
}) {
	return (
		<div
			data-face={id}
			data-on={current === id}
			inert={current !== id}
			{...(labelledBy && { role: "group", "aria-labelledby": labelledBy })}
			className={className}
		>
			{children}
		</div>
	);
}

/**
 * A button that asks in place: the pill morphs into a question with Cancel and Confirm, then a
 * spinner, then a result with Undo. Escape, an outside press or the timeout return it to rest.
 */
export function ConfirmMorph({
	label,
	icon,
	prompt,
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	pendingLabel = "Deleting",
	doneLabel = "Deleted",
	errorLabel = "Couldn't finish",
	retryLabel = "Retry",
	undoLabel = "Undo",
	undoingLabel = "Restoring",
	countdownLabel,
	variant = "destructive",
	size = "default",
	mode = "press",
	holdDuration = 1000,
	countdown = 3,
	onConfirm,
	onUndo,
	onCancel,
	state: stateProp,
	defaultState = "idle",
	onStateChange,
	confirmTimeout = 6000,
	resultTimeout = 5000,
	cancelOnOutsidePress = true,
	disabled = false,
	className,
}: ConfirmMorphProps) {
	const promptId = useId();
	const [inner, setInner] = useState(defaultState);
	const state = stateProp ?? inner;
	const [working, setWorking] = useState<"confirm" | "undo">("confirm");
	const [seconds, setSeconds] = useState<number | null>(null);
	const face: ConfirmMorphFace =
		state === "confirming" && seconds !== null ? "counting" : state;

	const rootRef = useRef<HTMLDivElement>(null);
	const surfaceRef = useRef<HTMLDivElement>(null);
	const engine = useRef<ReturnType<typeof createConfirmMorph> | null>(null);
	const options = {
		state,
		mode,
		holdDuration,
		countdown,
		confirmTimeout,
		resultTimeout,
		cancelOnOutsidePress,
		onConfirm,
		onUndo,
		onCancel,
		go: (next: ConfirmMorphState) => {
			if (stateProp === undefined) setInner(next);
			onStateChange?.(next);
		},
		onWorkingChange: setWorking,
		onCount: setSeconds,
	};
	const optionsRef = useRef(options);
	optionsRef.current = options;

	useLayoutEffect(() => {
		if (!rootRef.current || !surfaceRef.current) return;
		const created = createConfirmMorph(rootRef.current, optionsRef.current);
		engine.current = created;
		const untrack = trackActiveWidth(surfaceRef.current);
		return () => {
			created.destroy();
			untrack();
			engine.current = null;
		};
	}, []);
	useEffect(() => {
		engine.current?.update(options);
	});

	const s = confirmMorph({ variant, size });
	const secondary = cn(
		button({ variant: "ghost", size: "sm" }),
		s.action(),
		s.secondary(),
	);
	const confirmClass = cn(
		button({
			variant: variant === "destructive" ? "destructive_soft" : "default",
			size: "sm",
		}),
		s.action(),
	);
	const shownPrompt = prompt ?? `${label}?`;
	const announcement =
		face === "confirming"
			? shownPrompt
			: face === "counting"
				? `${countdownLabel ?? `${pendingLabel} in`} ${countdown} seconds`
				: face === "done"
					? onUndo
						? `${doneLabel}. ${undoLabel} is available.`
						: doneLabel
					: face === "error"
						? errorLabel
						: "";

	const at = { current: face, className: s.face() };
	const part = (i: number, extra?: string) => ({
		className: cn(s.part(), extra),
		style: { "--i": i } as CSSProperties,
	});

	return (
		<div
			ref={rootRef}
			data-slot="confirm-morph"
			data-state={state}
			data-face={face}
			data-mode={mode}
			tabIndex={-1}
			aria-busy={state === "pending" || undefined}
			className={cn(s.root(), className)}
		>
			<div ref={surfaceRef} className={s.surface()}>
				<Face id="idle" {...at}>
					<span {...part(0)}>
						<button
							type="button"
							data-autofocus
							disabled={disabled}
							className={s.trigger()}
							onClick={() => engine.current?.ask()}
						>
							{icon && <span aria-hidden>{icon}</span>}
							{label}
						</button>
					</span>
				</Face>
				<Face id="confirming" {...at} labelledBy={promptId}>
					<span {...part(0, s.prompt())} id={promptId}>
						{shownPrompt}
					</span>
					<span {...part(1)}>
						<button
							type="button"
							className={secondary}
							onClick={() => engine.current?.cancel()}
						>
							{cancelLabel}
						</button>
					</span>
					<span {...part(2)}>
						{mode === "hold" ? (
							<button
								type="button"
								data-autofocus
								data-confirm-hold
								aria-label={`${confirmLabel}, press and hold`}
								className={cn(confirmClass, s.hold())}
							>
								{confirmLabel}
								<span data-hold-fill="" className={s.fill()} aria-hidden>
									{confirmLabel}
								</span>
							</button>
						) : (
							<button
								type="button"
								data-autofocus
								className={confirmClass}
								onClick={() => engine.current?.answer()}
							>
								{confirmLabel}
							</button>
						)}
					</span>
				</Face>
				{mode === "countdown" && (
					<Face id="counting" {...at}>
						<span {...part(0, cn(s.status(), s.muted()))}>
							<svg viewBox="0 0 16 16" fill="none" className={s.ring()} aria-hidden>
								<circle
									cx="8"
									cy="8"
									r="6.25"
									strokeWidth="1.75"
									className={s.ringTrack()}
								/>
								<circle
									data-confirm-ring=""
									cx="8"
									cy="8"
									r="6.25"
									strokeWidth="1.75"
									strokeLinecap="round"
									pathLength={1}
									className={s.ringFill()}
								/>
							</svg>
							<span>
								{countdownLabel ?? `${pendingLabel} in`}{" "}
								<RollingDigits
									value={seconds ?? countdown}
									direction="down"
									className="text-foreground"
								/>
							</span>
						</span>
						<span {...part(1)}>
							<button
								type="button"
								className={secondary}
								onClick={() => engine.current?.cancel()}
							>
								{cancelLabel}
							</button>
						</span>
					</Face>
				)}
				<Face id="pending" {...at}>
					<span {...part(0, cn(s.status(), s.muted(), "pr-4"))}>
						<Spinner size="sm" label={working === "undo" ? undoingLabel : pendingLabel} />
						{working === "undo" ? undoingLabel : pendingLabel}
					</span>
				</Face>
				<Face id="done" {...at}>
					<span {...part(0, cn(s.status(), !onUndo && "pr-3.5"))}>
						<svg viewBox="0 0 18 18" className={s.check()} aria-hidden>
							<circle cx="9" cy="9" r="8" stroke="none" />
							<path
								d="M5.6 9.3 7.8 11.4 12.4 6.7"
								fill="none"
								strokeWidth="1.9"
								strokeLinecap="round"
								strokeLinejoin="round"
								pathLength={1}
								className={s.tick()}
							/>
						</svg>
						{doneLabel}
					</span>
					{onUndo && (
						<span {...part(1)}>
							<button
								type="button"
								data-autofocus
								className={secondary}
								onClick={() => engine.current?.undo()}
							>
								{undoLabel}
							</button>
						</span>
					)}
				</Face>
				<Face id="error" {...at}>
					<span {...part(0, s.status())}>
						<svg viewBox="0 0 16 16" fill="none" className={s.alert()} aria-hidden>
							<circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
							<path
								d="M8 4.8v3.6M8 10.9v.1"
								stroke="currentColor"
								strokeWidth="1.6"
								strokeLinecap="round"
							/>
						</svg>
						{errorLabel}
					</span>
					<span {...part(1)}>
						<button
							type="button"
							data-autofocus
							className={secondary}
							onClick={() => engine.current?.retry()}
						>
							{retryLabel}
						</button>
					</span>
				</Face>
			</div>
			<span className="sr-only" role="status">
				{announcement}
			</span>
		</div>
	);
}
