"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	type RefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Badge } from "../../badge/react/badge";
import { Button } from "../../button/react/button";
import { cn } from "../../lib/cn";
import { Textarea } from "../../textarea/react/textarea";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import { EMAIL_DRAFT_ICONS } from "../icons";
import { type EmailDraftStatus, type EmailDraftVariant, emailDraft } from "../variants";

type Focus = "receipt" | "send" | null;
type Ctx = {
	status: EmailDraftStatus;
	editing: boolean;
	setEditing: (editing: boolean) => void;
	send: () => void;
	discard: () => void;
	undo: () => void;
	/** Where focus goes once the status flips, so it never falls to the page. */
	pendingFocus: RefObject<Focus>;
	styles: ReturnType<typeof emailDraft>;
};
const EmailDraftContext = createContext<Ctx | null>(null);

function useEmailDraft(part: string): Ctx {
	const ctx = useContext(EmailDraftContext);
	if (!ctx) throw new Error(`${part} must be used inside <EmailDraft>`);
	return ctx;
}

function Icon({ d }: { d: string }) {
	const { styles } = useEmailDraft("EmailDraft icon");
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon()}>
			<path d={d} />
		</svg>
	);
}

const folded = (status: EmailDraftStatus) => status === "sent" || status === "discarded";

export interface EmailDraftProps extends ComponentProps<"article"> {
	/** Where the draft is. Set it from your send flow: `sending`, then `sent`. */
	status?: EmailDraftStatus;
	onSend?: () => void;
	onDiscard?: () => void;
	onUndo?: () => void;
	variant?: EmailDraftVariant;
}

/** The root: an agent-written email waiting for review, with its status and decisions. */
export function EmailDraft({
	status = "draft",
	onSend,
	onDiscard,
	onUndo,
	variant = "tray",
	className,
	children,
	...props
}: EmailDraftProps) {
	const [editing, setEditing] = useState(false);
	const pendingFocus = useRef<Focus>(null);
	const styles = emailDraft({ variant });
	const ctx: Ctx = {
		status,
		editing,
		setEditing,
		send: () => {
			if (status !== "draft") return;
			setEditing(false);
			pendingFocus.current = "receipt";
			onSend?.();
		},
		discard: () => {
			setEditing(false);
			pendingFocus.current = "receipt";
			onDiscard?.();
		},
		undo: () => {
			pendingFocus.current = "send";
			onUndo?.();
		},
		pendingFocus,
		styles,
	};
	return (
		<EmailDraftContext.Provider value={ctx}>
			<article
				data-slot="email-draft"
				data-variant={variant}
				data-status={status}
				className={cn(styles.root(), className)}
				{...props}
			>
				{children}
			</article>
		</EmailDraftContext.Provider>
	);
}

/** The record the email is about: title, a status Badge, amount and description. */
export function EmailDraftHeader({ className, ...props }: ComponentProps<"header">) {
	const { styles } = useEmailDraft("EmailDraftHeader");
	return (
		<header
			data-slot="email-draft-header"
			className={cn(styles.header(), className)}
			{...props}
		/>
	);
}

export function EmailDraftTitle({ className, ...props }: ComponentProps<"h3">) {
	const { styles } = useEmailDraft("EmailDraftTitle");
	return (
		<h3
			data-slot="email-draft-title"
			className={cn(styles.title(), className)}
			{...props}
		/>
	);
}

export function EmailDraftAmount({ className, ...props }: ComponentProps<"span">) {
	const { styles } = useEmailDraft("EmailDraftAmount");
	return (
		<span
			data-slot="email-draft-amount"
			className={cn(styles.amount(), className)}
			{...props}
		/>
	);
}

export function EmailDraftDescription({ className, ...props }: ComponentProps<"p">) {
	const { styles } = useEmailDraft("EmailDraftDescription");
	return (
		<p
			data-slot="email-draft-description"
			className={cn(styles.description(), className)}
			{...props}
		/>
	);
}

/** The raised surface under the header that holds the email, the receipt and the footer. */
export function EmailDraftPanel({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useEmailDraft("EmailDraftPanel");
	return (
		<div
			data-slot="email-draft-panel"
			className={cn(styles.panel(), className)}
			{...props}
		/>
	);
}

/** The email itself; folds away once it is sent or discarded, and dims while sending. */
export function EmailDraftContent({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	const { status, styles } = useEmailDraft("EmailDraftContent");
	const gone = folded(status);
	return (
		<div
			data-slot="email-draft-content"
			data-folded={gone || undefined}
			inert={gone}
			className={cn(styles.content(), className)}
			{...props}
		>
			<div className={styles.contentClip()}>
				<div
					data-sending={status === "sending" || undefined}
					className={styles.contentBody()}
				>
					{children}
				</div>
			</div>
		</div>
	);
}

/** The row with the recipient and the attachment. */
export function EmailDraftFields({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useEmailDraft("EmailDraftFields");
	return (
		<div
			data-slot="email-draft-fields"
			className={cn(styles.fields(), className)}
			{...props}
		/>
	);
}

/** "To" and the recipient: put a Select or a plain name inside. */
export function EmailDraftTo({
	label = "To",
	className,
	children,
	...props
}: ComponentProps<"div"> & { label?: string }) {
	const { styles } = useEmailDraft("EmailDraftTo");
	return (
		<div data-slot="email-draft-to" className={cn(styles.to(), className)} {...props}>
			<span className={styles.toLabel()}>{label}</span>
			{children}
		</div>
	);
}

/** The attached file, removable; once removed it offers to attach the file again. */
export function EmailDraftAttachment({
	name,
	attached,
	onAttachedChange,
	className,
}: {
	name: string;
	attached: boolean;
	onAttachedChange: (attached: boolean) => void;
	className?: string;
}) {
	const { styles } = useEmailDraft("EmailDraftAttachment");
	const ref = useRef<HTMLDivElement>(null);
	const toggle = (next: boolean) => {
		onAttachedChange(next);
		// The button swaps for its opposite; keep focus on whichever is now there.
		requestAnimationFrame(() => ref.current?.querySelector("button")?.focus());
	};
	return (
		<div
			ref={ref}
			data-slot="email-draft-attachment"
			className={cn(styles.attachment(), className)}
		>
			{attached ? (
				<>
					<Icon d={EMAIL_DRAFT_ICONS.clip} />
					<span className={styles.attachmentName()}>{name}</span>
					<Button
						variant="ghost"
						size="icon-xs"
						aria-label={`Remove ${name}`}
						onClick={() => toggle(false)}
					>
						<Icon d={EMAIL_DRAFT_ICONS.close} />
					</Button>
				</>
			) : (
				<Button variant="ghost" size="sm" onClick={() => toggle(true)}>
					<Icon d={EMAIL_DRAFT_ICONS.plus} />
					<span className={styles.attachmentName()}>Attach {name}</span>
				</Button>
			)}
		</div>
	);
}

/** The email text. Click it, or press EmailDraftEdit, to edit in place; ⌘/Ctrl Enter sends. */
export function EmailDraftMessage({
	value,
	onValueChange,
	label = "Email text",
	className,
	children,
}: {
	value: string;
	onValueChange: (value: string) => void;
	label?: string;
	className?: string;
	/** Shown after the text while it is not being edited, such as a link. */
	children?: ReactNode;
}) {
	const { editing, setEditing, send, styles } = useEmailDraft("EmailDraftMessage");
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!editing) return;
		const field = ref.current?.querySelector("textarea");
		field?.focus();
		field?.setSelectionRange(field.value.length, field.value.length);
	}, [editing]);

	return (
		<div
			ref={ref}
			data-slot="email-draft-message"
			className={cn(styles.message(), className)}
		>
			{editing ? (
				<Textarea
					autoGrow
					rows={1}
					size="sm"
					variant="soft"
					aria-label={label}
					value={value}
					className={styles.editor()}
					onChange={(event) => onValueChange(event.currentTarget.value)}
					onBlur={() => setEditing(false)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
							event.preventDefault();
							send();
						}
						if (event.key === "Escape") setEditing(false);
					}}
				/>
			) : (
				// biome-ignore lint/a11y/useKeyWithClickEvents: a pointer shortcut; EmailDraftEdit is the keyboard path.
				<p className={styles.text()} onClick={() => setEditing(true)}>
					{value} {children}
				</p>
			)}
		</div>
	);
}

/** The row under the text: tones, the edit button and the hint. */
export function EmailDraftOptions({ className, ...props }: ComponentProps<"div">) {
	const { styles } = useEmailDraft("EmailDraftOptions");
	return (
		<div
			data-slot="email-draft-options"
			className={cn(styles.options(), className)}
			{...props}
		/>
	);
}

/** Rewrites of the text to pick from. Pass "" as `value` once the text is edited by hand. */
export function EmailDraftTones({
	value,
	onValueChange,
	label = "Tone",
	className,
	children,
}: {
	value: string;
	onValueChange: (value: string) => void;
	label?: string;
	className?: string;
	children?: ReactNode;
}) {
	const { setEditing } = useEmailDraft("EmailDraftTones");
	return (
		<ToggleGroup
			type="single"
			variant="outline"
			size="sm"
			label={label}
			value={value}
			className={className}
			onValueChange={(next) => {
				setEditing(false);
				onValueChange(typeof next === "string" ? next : "");
			}}
		>
			{children}
		</ToggleGroup>
	);
}

export function EmailDraftTone(props: ComponentProps<typeof ToggleGroupItem>) {
	return <ToggleGroupItem data-slot="email-draft-tone" {...props} />;
}

/** Starts editing the text in place. */
export function EmailDraftEdit({
	label = "Edit text",
	className,
}: {
	label?: string;
	className?: string;
}) {
	const { editing, setEditing } = useEmailDraft("EmailDraftEdit");
	return (
		<Button
			data-slot="email-draft-edit"
			variant="ghost"
			size="icon-sm"
			aria-label={label}
			aria-pressed={editing}
			className={className}
			// Keep the field's blur from closing it just before this press reopens it.
			onMouseDown={(event) => event.preventDefault()}
			onClick={() => setEditing(true)}
		>
			<Icon d={EMAIL_DRAFT_ICONS.pencil} />
		</Button>
	);
}

/** A quiet shortcut hint; hidden when the card is narrow. */
export function EmailDraftHint({
	className,
	children,
	...props
}: ComponentProps<"span">) {
	const { styles } = useEmailDraft("EmailDraftHint");
	return (
		<span
			data-slot="email-draft-hint"
			className={cn(styles.hint(), className)}
			{...props}
		>
			{children ?? "⌘ Enter to send"}
		</span>
	);
}

/** The one-line note that replaces the email once sent or discarded, with Undo. */
export function EmailDraftReceipt({
	undoLabel = "Undo",
	className,
	children,
}: {
	undoLabel?: string;
	className?: string;
	/** What happened, e.g. "Sent to <b>Jonas</b>". Defaults to the status. */
	children?: ReactNode;
}) {
	const { status, undo, pendingFocus, styles } = useEmailDraft("EmailDraftReceipt");
	const shown = folded(status);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!shown || pendingFocus.current !== "receipt") return;
		pendingFocus.current = null;
		ref.current?.querySelector("button")?.focus();
	}, [shown, pendingFocus]);

	return (
		<div
			ref={ref}
			data-slot="email-draft-receipt"
			data-shown={shown || undefined}
			inert={!shown}
			className={cn(styles.receipt(), className)}
		>
			<div className={styles.receiptClip()}>
				<div className={styles.receiptBody()}>
					<span
						aria-hidden="true"
						data-tone={status === "sent" ? "success" : undefined}
						className={styles.receiptIcon()}
					>
						<Icon
							d={status === "sent" ? EMAIL_DRAFT_ICONS.check : EMAIL_DRAFT_ICONS.close}
						/>
					</span>
					<span role="status" className={styles.receiptText()}>
						{shown
							? (children ?? (status === "sent" ? "Sent" : "Draft discarded"))
							: null}
					</span>
					<Button variant="ghost" size="sm" onClick={undo}>
						{undoLabel}
					</Button>
				</div>
			</div>
		</div>
	);
}

/** The last row: who wrote it, its state, and the decision. */
export function EmailDraftFooter({ className, ...props }: ComponentProps<"footer">) {
	const { styles } = useEmailDraft("EmailDraftFooter");
	return (
		<footer
			data-slot="email-draft-footer"
			className={cn(styles.footer(), className)}
			{...props}
		/>
	);
}

export function EmailDraftAuthor({ className, ...props }: ComponentProps<"span">) {
	const { styles } = useEmailDraft("EmailDraftAuthor");
	return (
		<span
			data-slot="email-draft-author"
			className={cn(styles.author(), className)}
			{...props}
		/>
	);
}

const STATE_LABELS: Record<EmailDraftStatus, string> = {
	draft: "Ready for review",
	sending: "Sending",
	sent: "Sent",
	discarded: "Discarded",
};

/** A Badge that follows the status. */
export function EmailDraftState({
	labels = STATE_LABELS,
	className,
}: {
	labels?: Record<EmailDraftStatus, string>;
	className?: string;
}) {
	const { status } = useEmailDraft("EmailDraftState");
	return (
		<Badge
			data-slot="email-draft-state"
			variant={status === "discarded" ? "secondary" : "success"}
			className={cn("shrink-0", className)}
		>
			{labels[status]}
		</Badge>
	);
}

/** Discard and Send; fold away once the email is out. */
export function EmailDraftActions({
	className,
	children,
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { status, styles } = useEmailDraft("EmailDraftActions");
	const gone = folded(status);
	return (
		<div
			data-slot="email-draft-actions"
			data-folded={gone || undefined}
			inert={gone}
			className={cn(styles.actions(), className)}
		>
			<div className={styles.actionsClip()}>
				<div className={styles.actionsBody()}>{children}</div>
			</div>
		</div>
	);
}

export function EmailDraftDiscard({
	className,
	children = "Discard",
}: {
	className?: string;
	children?: ReactNode;
}) {
	const { status, discard } = useEmailDraft("EmailDraftDiscard");
	return (
		<Button
			data-slot="email-draft-discard"
			variant="outline"
			size="sm"
			disabled={status === "sending"}
			className={className}
			onClick={discard}
		>
			{children}
		</Button>
	);
}

export function EmailDraftSend({
	loadingLabel = "Sending",
	className,
	children = "Send email",
}: {
	loadingLabel?: string;
	className?: string;
	children?: ReactNode;
}) {
	const { status, send, pendingFocus } = useEmailDraft("EmailDraftSend");
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (status !== "draft" || pendingFocus.current !== "send") return;
		pendingFocus.current = null;
		ref.current?.closest("button")?.focus();
	}, [status, pendingFocus]);

	return (
		<Button
			data-slot="email-draft-send"
			size="sm"
			loading={status === "sending"}
			loadingLabel={loadingLabel}
			className={className}
			onClick={send}
		>
			<span ref={ref} className="contents">
				{children}
			</span>
		</Button>
	);
}
