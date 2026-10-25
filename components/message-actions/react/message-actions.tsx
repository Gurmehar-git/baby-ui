"use client";

import {
	type ComponentProps,
	createContext,
	type KeyboardEvent,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { Button } from "../../button/react/button";
import { CopyButton } from "../../copy-button/react/copy-button";
import { Input } from "../../input/react/input";
import { cn } from "../../lib/cn";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import { MESSAGE_ICONS } from "../icons";
import {
	type MessageActionsVariant,
	type MessageFeedback,
	messageActions,
} from "../variants";

type Ctx = {
	feedback: MessageFeedback | null;
	setFeedback: (next: MessageFeedback | null) => void;
	announce: (message: string) => void;
	styles: ReturnType<typeof messageActions>;
};
const MessageActionsContext = createContext<Ctx | null>(null);

function useMessageActions(part: string): Ctx {
	const ctx = useContext(MessageActionsContext);
	if (!ctx) throw new Error(`${part} must be used inside <MessageActions>`);
	return ctx;
}

function Icon({ d, className }: { d: string; className?: string }) {
	const { styles } = useMessageActions("MessageActions icon");
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={cn(styles.icon(), className)}>
			<path d={d} />
		</svg>
	);
}

export interface MessageActionsProps extends ComponentProps<"div"> {
	/** The vote on this message. Controlled with onFeedbackChange. */
	feedback?: MessageFeedback | null;
	defaultFeedback?: MessageFeedback | null;
	onFeedbackChange?: (feedback: MessageFeedback | null) => void;
	variant?: MessageActionsVariant;
}

/** The root: the vote on the message, and a polite status line for what the actions did. */
export function MessageActions({
	feedback: feedbackProp,
	defaultFeedback = null,
	onFeedbackChange,
	variant = "quiet",
	className,
	children,
	...props
}: MessageActionsProps) {
	const [internal, setInternal] = useState(defaultFeedback);
	const [status, setStatus] = useState("");
	const feedback = feedbackProp === undefined ? internal : feedbackProp;
	const setFeedback = (next: MessageFeedback | null) => {
		if (feedbackProp === undefined) setInternal(next);
		onFeedbackChange?.(next);
	};
	// A trailing space makes a repeated message count as a change, so it is read again.
	const announce = (message: string) =>
		setStatus((old) => (old === message ? `${message} ` : message));
	const styles = messageActions({ variant });
	return (
		<MessageActionsContext.Provider value={{ feedback, setFeedback, announce, styles }}>
			<div
				data-slot="message-actions"
				data-variant={variant}
				className={cn(styles.root(), className)}
				{...props}
			>
				{children}
				<span role="status" className="sr-only">
					{status}
				</span>
			</div>
		</MessageActionsContext.Provider>
	);
}

/** The toolbar row; arrow keys move between its buttons. */
export function MessageActionsBar({
	className,
	"aria-label": ariaLabel = "Message actions",
	onKeyDown,
	...props
}: ComponentProps<"div">) {
	const { styles } = useMessageActions("MessageActionsBar");
	const move = (event: KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
		if (!step) return;
		const buttons = [
			...event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"),
		];
		const at = buttons.findIndex((b) => b.contains(document.activeElement));
		if (at < 0) return;
		event.preventDefault();
		buttons[(at + step + buttons.length) % buttons.length]?.focus();
	};
	return (
		<div
			role="toolbar"
			tabIndex={-1}
			aria-label={ariaLabel}
			data-slot="message-actions-bar"
			className={cn(styles.bar(), className)}
			onKeyDown={move}
			{...props}
		/>
	);
}

/** Copies the message; the icon turns into a check for a moment. */
export function MessageActionsCopy({
	text,
	label = "Copy",
	copiedLabel = "Copied",
	className,
}: {
	text: string;
	label?: string;
	copiedLabel?: string;
	className?: string;
}) {
	const { styles } = useMessageActions("MessageActionsCopy");
	return (
		<CopyButton
			text={text}
			iconOnly
			label={label}
			copiedLabel={copiedLabel}
			className={cn(styles.button(), className)}
		/>
	);
}

/** Asks for a new version. The arrow turns once per press, and keeps turning while `loading`. */
export function MessageActionsRegenerate({
	label = "Regenerate",
	loading = false,
	onClick,
	className,
}: {
	label?: string;
	/** A new version is being written. */
	loading?: boolean;
	onClick?: () => void;
	className?: string;
}) {
	const { styles } = useMessageActions("MessageActionsRegenerate");
	const [turns, setTurns] = useState(0);
	return (
		<button
			type="button"
			data-slot="message-actions-regenerate"
			aria-label={label}
			aria-busy={loading || undefined}
			className={cn(styles.button(), className)}
			onClick={() => {
				setTurns((t) => t + 1);
				onClick?.();
			}}
		>
			<span
				data-motion={loading ? "explanatory" : undefined}
				className={cn(
					"grid place-items-center",
					loading ? "animate-spin" : styles.spin(),
				)}
				style={loading ? undefined : { rotate: `${turns * 360}deg` }}
			>
				<Icon d={MESSAGE_ICONS.redo} />
			</span>
		</button>
	);
}

/** Steps between versions of the message; folds open once there are two. */
export function MessageActionsVersions({
	value,
	count,
	onValueChange,
	label = (index, total) => `Version ${index + 1} of ${total}`,
	className,
}: {
	/** The shown version, from 0. */
	value: number;
	count: number;
	onValueChange: (value: number) => void;
	label?: (index: number, total: number) => string;
	className?: string;
}) {
	const { announce, styles } = useMessageActions("MessageActionsVersions");
	const go = (next: number) => {
		onValueChange(next);
		announce(label(next, count));
	};
	return (
		<div
			data-slot="message-actions-versions"
			data-shown={count > 1 || undefined}
			className={cn(styles.versions(), className)}
		>
			<div className={styles.versionsClip()} inert={count < 2}>
				<button
					type="button"
					aria-label="Previous version"
					disabled={value <= 0}
					className={styles.button()}
					onClick={() => go(value - 1)}
				>
					<Icon d={MESSAGE_ICONS.prev} />
				</button>
				<span className={styles.versionLabel()}>
					<span aria-hidden="true">
						{value + 1} / {count}
					</span>
					<span className="sr-only">{label(value, count)}</span>
				</span>
				<button
					type="button"
					aria-label="Next version"
					disabled={value >= count - 1}
					className={styles.button()}
					onClick={() => go(value + 1)}
				>
					<Icon d={MESSAGE_ICONS.next} />
				</button>
			</div>
		</div>
	);
}

/** Thumbs up and down; each fills with a squish, and pressing it again takes the vote back. */
export function MessageActionsFeedback({
	upLabel = "Good response",
	downLabel = "Bad response",
	className,
}: {
	upLabel?: string;
	downLabel?: string;
	className?: string;
}) {
	const { feedback, setFeedback, announce, styles } = useMessageActions(
		"MessageActionsFeedback",
	);
	const vote = (kind: MessageFeedback, name: string) => {
		const next = feedback === kind ? null : kind;
		setFeedback(next);
		if (next) announce(`Marked as ${name.toLowerCase()}`);
	};
	return (
		<>
			<button
				type="button"
				data-slot="message-actions-up"
				aria-label={upLabel}
				aria-pressed={feedback === "up"}
				className={cn(styles.button(), className)}
				onClick={() => vote("up", upLabel)}
			>
				<Icon d={MESSAGE_ICONS.thumb} className={styles.thumb()} />
			</button>
			<button
				type="button"
				data-slot="message-actions-down"
				aria-label={downLabel}
				aria-pressed={feedback === "down"}
				className={cn(styles.button(), className)}
				onClick={() => vote("down", downLabel)}
			>
				<Icon d={MESSAGE_ICONS.thumb} className={cn(styles.thumb(), "rotate-180")} />
			</button>
		</>
	);
}

/** Reads the message aloud; the speaker becomes an equalizer while it plays. */
export function MessageActionsSpeak({
	pressed,
	onPressedChange,
	label = "Read aloud",
	stopLabel = "Stop reading",
	className,
}: {
	/** Playing. Drive it from your speech player. */
	pressed: boolean;
	onPressedChange: (pressed: boolean) => void;
	label?: string;
	stopLabel?: string;
	className?: string;
}) {
	const { styles } = useMessageActions("MessageActionsSpeak");
	return (
		<button
			type="button"
			data-slot="message-actions-speak"
			aria-label={pressed ? stopLabel : label}
			aria-pressed={pressed}
			className={cn(styles.button(), className)}
			onClick={() => onPressedChange(!pressed)}
		>
			{pressed ? (
				<span aria-hidden="true" data-motion="explanatory" className={styles.equalizer()}>
					<span className={styles.speakBar()} />
					<span className={styles.speakBar()} />
					<span className={styles.speakBar()} />
				</span>
			) : (
				<Icon d={MESSAGE_ICONS.speaker} />
			)}
		</button>
	);
}

/** Opens under the bar on a thumbs down: pick a reason (or write one), then send. */
export function MessageActionsFeedbackPanel({
	reasons,
	otherReason = "Other",
	title = "What went wrong?",
	placeholder = "Tell us more",
	submitLabel = "Send",
	thanks = "Thanks for the feedback",
	onSubmit,
	className,
}: {
	reasons: string[];
	/** The reason that opens a text field. */
	otherReason?: string;
	title?: ReactNode;
	placeholder?: string;
	submitLabel?: string;
	thanks?: string;
	onSubmit?: (reason: string) => void;
	className?: string;
}) {
	const { feedback, announce, styles } = useMessageActions("MessageActionsFeedbackPanel");
	const [reason, setReason] = useState("");
	const [other, setOther] = useState("");
	const [sent, setSent] = useState(false);
	const [dismissed, setDismissed] = useState(false);
	const open = feedback === "down" && !dismissed;

	// A new thumbs down starts the panel fresh.
	useEffect(() => {
		if (feedback !== "down") return;
		setDismissed(false);
		setSent(false);
		setReason("");
		setOther("");
	}, [feedback]);

	// The thanks line shows for a moment, then the panel folds away.
	useEffect(() => {
		if (!sent) return;
		const timer = setTimeout(() => setDismissed(true), 1500);
		return () => clearTimeout(timer);
	}, [sent]);

	const send = () => {
		if (!reason || sent) return;
		onSubmit?.(reason === otherReason ? other.trim() || otherReason : reason);
		setSent(true);
		announce(thanks);
	};

	return (
		<div
			data-slot="message-actions-feedback-panel"
			data-open={open || undefined}
			inert={!open}
			className={cn(styles.panel(), className)}
		>
			<div className={styles.panelClip()}>
				<div className={styles.panelCard()}>
					<div className={styles.panelHead()}>
						{sent ? (
							<p className={styles.thanks()}>
								<Icon d={MESSAGE_ICONS.check} />
								{thanks}
							</p>
						) : (
							title
						)}
						<button
							type="button"
							aria-label="Close"
							className={styles.button()}
							onClick={() => setDismissed(true)}
						>
							<Icon d={MESSAGE_ICONS.close} />
						</button>
					</div>
					<div data-folded={sent || undefined} inert={sent} className={styles.fold()}>
						<div className={styles.foldClip()}>
							<div className={styles.foldBody()}>
								<ToggleGroup
									type="single"
									variant="chip"
									size="sm"
									label={typeof title === "string" ? title : "Reason"}
									value={reason}
									onValueChange={(next) =>
										setReason(typeof next === "string" ? next : "")
									}
								>
									{reasons.map((r) => (
										<ToggleGroupItem key={r} value={r}>
											{r}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
								<div
									data-folded={reason !== otherReason || undefined}
									inert={reason !== otherReason}
									className={styles.fold()}
								>
									<div className={styles.foldClip()}>
										<div className={styles.foldBody()}>
											<Input
												value={other}
												placeholder={placeholder}
												aria-label={placeholder}
												onChange={(event) => setOther(event.currentTarget.value)}
											/>
										</div>
									</div>
								</div>
								<Button
									size="sm"
									className={styles.submit()}
									disabled={!reason}
									onClick={send}
								>
									{submitLabel}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
