"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../../lib/cn";
import { transitionMs } from "../../lib/motion";
import { ATTACHMENT_LABELS, type AttachmentLabels } from "../labels";
import {
	ATTACHMENT_ICON,
	type AttachmentStatus,
	type AttachmentsVariant,
	type AttachmentVariant,
	attachment,
	attachments,
	fileType,
} from "../variants";

export type { AttachmentLabels, AttachmentStatus, AttachmentsVariant, AttachmentVariant };

type AttachmentCtx = {
	name: string;
	status: AttachmentStatus;
	progress: number;
	variant: AttachmentVariant;
	labels: AttachmentLabels;
	leaving: boolean;
	leave: (then?: () => void) => void;
};

const AttachmentContext = createContext<AttachmentCtx | null>(null);
// Set by Attachments, so a lone Attachment is not an orphaned listitem.
const InList = createContext(false);

function useAttachment(part: string): AttachmentCtx {
	const ctx = useContext(AttachmentContext);
	if (!ctx) throw new Error(`${part} must be used inside <Attachment>`);
	return ctx;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

export interface AttachmentsProps extends ComponentProps<"div"> {
	/** `scroll`: one line that scrolls, for a composer; `wrap`: wraps, for a sent message. */
	variant?: AttachmentsVariant;
}

export function Attachments({
	variant = "scroll",
	className,
	...props
}: AttachmentsProps) {
	return (
		<InList.Provider value>
			{/* biome-ignore lint/a11y/useSemanticElements: an Attachment may stand alone, so it can't always be an li; roles pair up instead. */}
			<div
				role="list"
				data-slot="attachments"
				data-variant={variant}
				className={cn(attachments({ variant }), className)}
				{...props}
			/>
		</InList.Provider>
	);
}

export interface AttachmentProps extends ComponentProps<"div"> {
	/** The file name: it names the remove and retry buttons and the announcements. */
	name: string;
	status?: AttachmentStatus;
	/** Upload percentage, 0 to 100, while uploading. */
	progress?: number;
	/** `chip` for a composer, `card` for a full row, `tile` for an image square. */
	variant?: AttachmentVariant;
	labels?: Partial<AttachmentLabels>;
}

/** One attached file. Compose AttachmentPreview, AttachmentName, AttachmentMeta and actions inside. */
export function Attachment({
	name,
	status = "ready",
	progress = 0,
	variant = "chip",
	labels: labelsProp,
	className,
	children,
	...props
}: AttachmentProps) {
	const s = attachment({ variant, status });
	const root = useRef<HTMLDivElement>(null);
	const [leaving, setLeaving] = useState(false);
	const after = useRef<(() => void) | undefined>(undefined);
	const labels = { ...ATTACHMENT_LABELS, ...labelsProp };
	const inList = useContext(InList);

	// The fold runs first, then the action; reduced motion skips straight to it.
	useEffect(() => {
		if (!leaving) return;
		const ms = root.current ? transitionMs(root.current) : 0;
		const timer = setTimeout(() => after.current?.(), ms);
		return () => clearTimeout(timer);
	}, [leaving]);

	const ctx: AttachmentCtx = {
		name,
		status,
		progress: clamp(progress),
		variant,
		labels,
		leaving,
		leave: (then) => {
			after.current = then;
			setLeaving(true);
		},
	};

	return (
		<AttachmentContext.Provider value={ctx}>
			<div
				ref={root}
				role={inList ? "listitem" : undefined}
				data-slot="attachment"
				data-variant={variant}
				data-status={status}
				data-leaving={leaving}
				className={cn(s.root(), className)}
				{...props}
			>
				<div className={s.clip()}>
					<div className={s.surface()}>{children}</div>
				</div>
				{/* Announces state changes only; every percent would be noise. */}
				<span className="sr-only" aria-live="polite">
					{status === "uploading" ? "" : `${name}: ${labels[status]}`}
				</span>
			</div>
		</AttachmentContext.Provider>
	);
}

export interface AttachmentPreviewProps extends Omit<ComponentProps<"span">, "children"> {
	/** Image URL, e.g. an object URL. Without it the preview shows the file type. */
	src?: string;
}

/** Thumbnail or file type; while uploading, a ring over it fills with progress. */
export function AttachmentPreview({ src, className, ...props }: AttachmentPreviewProps) {
	const ctx = useAttachment("AttachmentPreview");
	const s = attachment({ variant: ctx.variant, status: ctx.status });
	const type = fileType(ctx.name);
	const ring = ctx.variant !== "card" && ctx.status === "uploading";
	const circumference = 2 * Math.PI * 9;

	return (
		<span
			aria-hidden
			data-slot="attachment-preview"
			className={cn(s.preview(), className)}
			{...props}
		>
			{src && ctx.status !== "error" ? (
				<img src={src} alt="" className={s.image()} />
			) : ctx.status === "error" || !type ? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<path
						d={ATTACHMENT_ICON[ctx.status === "error" ? "error" : "file"]}
						stroke="currentColor"
						strokeWidth="1.2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			) : (
				<span className={s.type()}>{type}</span>
			)}
			{ring ? (
				<span className={s.ring()}>
					<svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-6 -rotate-90">
						<circle cx="12" cy="12" r="9" strokeWidth="2.5" className={s.ringTrack()} />
						<circle
							cx="12"
							cy="12"
							r="9"
							strokeWidth="2.5"
							strokeLinecap="round"
							stroke="currentColor"
							strokeDasharray={circumference}
							strokeDashoffset={circumference * (1 - ctx.progress / 100)}
							className={s.ringFill()}
						/>
					</svg>
				</span>
			) : null}
		</span>
	);
}

/** Holds the name and meta lines; `tile` keeps it for screen readers only. */
export function AttachmentContent({ className, ...props }: ComponentProps<"span">) {
	const ctx = useAttachment("AttachmentContent");
	return (
		<span
			data-slot="attachment-content"
			className={cn(
				attachment({ variant: ctx.variant }).text(),
				"flex flex-col",
				className,
			)}
			{...props}
		/>
	);
}

/** The file name; defaults to the root's `name`. */
export function AttachmentName({
	className,
	children,
	...props
}: ComponentProps<"span">) {
	const ctx = useAttachment("AttachmentName");
	return (
		<span
			data-slot="attachment-name"
			title={ctx.name}
			className={cn(attachment({ variant: ctx.variant }).name(), className)}
			{...props}
		>
			{children ?? ctx.name}
		</span>
	);
}

export interface AttachmentMetaProps extends ComponentProps<"span"> {
	/** Shown once ready, e.g. "248 KB"; uploading and failed states write their own text. */
	children?: ReactNode;
}

/** The second line: a percent while uploading, the reason when failed, your text once ready. */
export function AttachmentMeta({ className, children, ...props }: AttachmentMetaProps) {
	const ctx = useAttachment("AttachmentMeta");
	const s = attachment({ variant: ctx.variant, status: ctx.status });
	const text =
		ctx.status === "uploading"
			? `${ctx.labels.uploading} ${Math.round(ctx.progress)}%`
			: ctx.status === "error"
				? ctx.labels.error
				: (children ?? ctx.labels.ready);
	return (
		<span data-slot="attachment-meta" className={cn(s.meta(), className)} {...props}>
			{text}
		</span>
	);
}

/** Card only: a bar under the name that folds away once the upload settles. */
export function AttachmentProgress({ className }: { className?: string }) {
	const ctx = useAttachment("AttachmentProgress");
	const s = attachment({ variant: ctx.variant, status: ctx.status });
	return (
		<span
			data-slot="attachment-progress"
			className={cn(s.progress(), className)}
			inert={ctx.status !== "uploading"}
		>
			<span className="min-h-0 overflow-hidden">
				<span
					role="progressbar"
					aria-label={ctx.name}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={Math.round(ctx.progress)}
					className={cn(s.track(), "block")}
				>
					<span
						className={cn(s.fill(), "block")}
						style={{ scale: `${ctx.progress / 100} 1` }}
					/>
				</span>
			</span>
		</span>
	);
}

/** Removes the file; the attachment folds shut first, then `onClick` runs. */
export function AttachmentRemove({
	className,
	onClick,
	children,
	...props
}: ComponentProps<"button">) {
	const ctx = useAttachment("AttachmentRemove");
	return (
		<button
			type="button"
			data-slot="attachment-remove"
			aria-label={`${ctx.labels.remove} ${ctx.name}`}
			disabled={ctx.leaving}
			className={cn(attachment({ variant: ctx.variant }).action(), className)}
			onClick={(event) => ctx.leave(() => onClick?.(event))}
			{...props}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<path
						d="m4 4 8 8M12 4l-8 8"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
			)}
		</button>
	);
}

/** Retries a failed upload; renders nothing unless the status is `error`. */
export function AttachmentRetry({
	className,
	children,
	...props
}: ComponentProps<"button">) {
	const ctx = useAttachment("AttachmentRetry");
	if (ctx.status !== "error") return null;
	return (
		<button
			type="button"
			data-slot="attachment-retry"
			aria-label={`${ctx.labels.retry} ${ctx.name}`}
			className={cn(attachment({ variant: ctx.variant }).action(), className)}
			{...props}
		>
			{children ?? (
				<svg viewBox="0 0 16 16" fill="none" aria-hidden>
					<path
						d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v3h-3"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			)}
		</button>
	);
}
