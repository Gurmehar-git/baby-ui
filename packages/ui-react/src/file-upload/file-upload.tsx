"use client";

import {
	type ComponentProps,
	createContext,
	type ReactNode,
	type RefObject,
	useContext,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from "react";
import { Button } from "../button/button";
import { FieldError } from "../field/field";
import { cn } from "../lib/cn";
import { transitionMs } from "../lib/motion";
import {
	FILE_UPLOAD_LABELS,
	type FileRejection,
	type FileUploadLabels,
	formatBytes,
	isImage,
	rejectionMessage,
	splitFiles,
	statusLabel,
	type UploadFile,
	uploadHint,
	uploadSummary,
} from "./core";
import {
	type FileUploadSize,
	type FileUploadStatus,
	type FileUploadVariant,
	fileUpload,
} from "./variants";

export type {
	FileRejection,
	FileUploadLabels,
	FileUploadSize,
	FileUploadStatus,
	FileUploadVariant,
	UploadFile,
};

type UploadCtx = {
	files: UploadFile[];
	variant: FileUploadVariant;
	size: FileUploadSize;
	labels: FileUploadLabels;
	disabled: boolean;
	dragging: boolean;
	setDragging: (on: boolean) => void;
	rejections: FileRejection[];
	maxSize?: number;
	maxFiles?: number;
	hint: string;
	hintId: string;
	compactAt?: number;
	previews: Record<string, string>;
	zone: RefObject<HTMLButtonElement | null>;
	browse: () => void;
	take: (list: FileList | null) => void;
};

const UploadContext = createContext<UploadCtx | null>(null);

function useUpload(part: string): UploadCtx {
	const ctx = useContext(UploadContext);
	if (!ctx) throw new Error(`${part} must be used inside <FileUpload>`);
	return ctx;
}

export interface FileUploadProps extends Omit<ComponentProps<"div">, "onDrop"> {
	/** Files the parent is tracking; it owns uploading and progress. */
	files: UploadFile[];
	/** Accepted files from a drop or the picker, already validated. */
	onFilesAdded: (files: File[]) => void;
	/** Files turned away by `accept`, `maxSize` or `maxFiles`; FileUploadError lists them too. */
	onReject?: (rejections: FileRejection[]) => void;
	/** Same syntax as the input attribute: `"image/*,.pdf"`. */
	accept?: string;
	/** Largest file in bytes. */
	maxSize?: number;
	maxFiles?: number;
	multiple?: boolean;
	disabled?: boolean;
	/** `default`: a roomy drop zone; `inline`: a slim bar from the start. */
	variant?: FileUploadVariant;
	size?: FileUploadSize;
	labels?: Partial<FileUploadLabels>;
	/** Once the list holds this many files, the drop zone folds to a slim bar; a drag brings it back. */
	compactAt?: number;
}

/** The root: validation, the hidden file input and the live summary. Compose the parts inside. */
export function FileUpload({
	files,
	onFilesAdded,
	onReject,
	accept,
	maxSize,
	maxFiles,
	multiple = true,
	disabled = false,
	variant = "default",
	size = "default",
	labels: labelsProp,
	compactAt,
	className,
	children,
	...props
}: FileUploadProps) {
	const labels = { ...FILE_UPLOAD_LABELS, ...labelsProp };
	const hintId = useId();
	const input = useRef<HTMLInputElement>(null);
	const zone = useRef<HTMLButtonElement>(null);
	const [dragging, setDragging] = useState(false);
	const [rejections, setRejections] = useState<FileRejection[]>([]);
	const previews = usePreviews(files);

	function take(list: FileList | null) {
		if (!list?.length || disabled) return;
		const { accepted, rejected } = splitFiles(Array.from(list), {
			accept,
			maxSize,
			maxFiles,
			current: files.length,
		});
		setRejections(rejected);
		if (rejected.length) {
			onReject?.(rejected);
			// Restart the shake on every refusal.
			const el = zone.current;
			if (el) {
				el.dataset.nudge = "false";
				el.getBoundingClientRect();
				el.dataset.nudge = "true";
			}
		}
		if (accepted.length) onFilesAdded(accepted);
	}

	const ctx: UploadCtx = {
		files,
		variant,
		size,
		labels,
		disabled,
		dragging,
		setDragging,
		rejections,
		maxSize,
		maxFiles,
		hint: uploadHint(labels, accept, maxSize),
		hintId,
		compactAt,
		previews,
		zone,
		browse: () => input.current?.click(),
		take,
	};

	return (
		<UploadContext.Provider value={ctx}>
			<div
				data-slot="file-upload"
				data-variant={variant}
				className={cn(fileUpload({ variant, size }).root(), className)}
				{...props}
			>
				{children}
				<input
					ref={input}
					type="file"
					tabIndex={-1}
					aria-hidden
					className="sr-only"
					accept={accept}
					multiple={multiple}
					disabled={disabled}
					onChange={(e) => {
						take(e.currentTarget.files);
						e.currentTarget.value = "";
					}}
				/>
				<p aria-live="polite" className="sr-only">
					{uploadSummary(files, labels)}
				</p>
			</div>
		</UploadContext.Provider>
	);
}

export interface FileUploadDropzoneProps
	extends Omit<ComponentProps<"button">, "children"> {
	/** Replaces the default icon, title and hint. */
	children?: ReactNode;
}

/** The drop target and picker button; a drag-over, a refusal and the compact bar all show here. */
export function FileUploadDropzone({
	className,
	children,
	...props
}: FileUploadDropzoneProps) {
	const ctx = useUpload("FileUploadDropzone");
	const s = fileUpload({ variant: ctx.variant, size: ctx.size });
	const compact =
		ctx.variant === "inline" ||
		(ctx.compactAt !== undefined && ctx.files.length >= ctx.compactAt && !ctx.dragging);

	return (
		<button
			ref={ctx.zone}
			type="button"
			data-slot="file-upload-dropzone"
			data-dragging={ctx.dragging}
			data-compact={compact}
			disabled={ctx.disabled}
			aria-describedby={ctx.hint ? ctx.hintId : undefined}
			className={cn(s.zone(), className)}
			onClick={ctx.browse}
			onDragEnter={(e) => {
				e.preventDefault();
				ctx.setDragging(true);
			}}
			onDragOver={(e) => e.preventDefault()}
			onDragLeave={(e) => {
				if (!e.currentTarget.contains(e.relatedTarget as Node | null))
					ctx.setDragging(false);
			}}
			onDrop={(e) => {
				e.preventDefault();
				ctx.setDragging(false);
				ctx.take(e.dataTransfer.files);
			}}
			{...props}
		>
			{children ?? (
				<>
					<span aria-hidden className={s.zoneIcon()}>
						<UploadIcon />
					</span>
					<span className={s.zoneTitle()}>
						{ctx.dragging ? ctx.labels.dropping : ctx.labels.title}
					</span>
					{ctx.hint ? (
						<span id={ctx.hintId} className={s.zoneHint()}>
							{ctx.hint}
						</span>
					) : null}
				</>
			)}
		</button>
	);
}

/** One line per turned-away file, read from the last drop or pick. */
export function FileUploadError({ className }: { className?: string }) {
	const ctx = useUpload("FileUploadError");
	return (
		<FieldError
			className={className}
			errors={ctx.rejections.map((r) => ({
				message: rejectionMessage(r, ctx.labels, {
					maxSize: ctx.maxSize,
					maxFiles: ctx.maxFiles,
				}),
			}))}
		/>
	);
}

export function FileUploadList({ className, ...props }: ComponentProps<"ul">) {
	const ctx = useUpload("FileUploadList");
	if (!ctx.files.length) return null;
	return (
		<ul
			data-slot="file-upload-list"
			className={cn(fileUpload({ size: ctx.size }).list(), className)}
			{...props}
		/>
	);
}

export interface FileUploadItemProps extends Omit<ComponentProps<"li">, "children"> {
	file: UploadFile;
	/** Shows a remove action; the row folds shut before this runs. */
	onRemove?: () => void;
	/** Shows a retry action on a failed upload. */
	onRetry?: () => void;
}

/** One file row: thumbnail, name, state, and a progress bar that folds away once done. */
export function FileUploadItem({
	file: item,
	onRemove,
	onRetry,
	className,
	...props
}: FileUploadItemProps) {
	const ctx = useUpload("FileUploadItem");
	const { labels, size } = ctx;
	const status = item.status;
	const s = fileUpload({ size, status });
	const root = useRef<HTMLLIElement>(null);
	const [leaving, setLeaving] = useState(false);
	const name = item.file.name;
	const preview = ctx.previews[item.id];
	const clamped = Math.min(100, Math.max(0, item.progress));
	const uploading = status === "uploading";
	const meta =
		status === "error"
			? (item.error ?? labels.failed)
			: uploading
				? `${Math.round(clamped)}%`
				: status === "done"
					? formatBytes(item.file.size)
					: labels.queued;

	// A ref, so parent re-renders during the fold (progress ticks) don't restart the timer.
	const remove = useRef(onRemove);
	useEffect(() => {
		remove.current = onRemove;
	});
	// Removal waits for the fold, then hands back; under reduced motion it runs at once.
	useEffect(() => {
		if (!leaving) return;
		const ms = root.current ? transitionMs(root.current) : 0;
		const timer = setTimeout(() => remove.current?.(), ms);
		return () => clearTimeout(timer);
	}, [leaving]);

	return (
		<li
			ref={root}
			data-slot="file-upload-item"
			data-status={status}
			data-leaving={leaving}
			className={cn(s.item(), className)}
			{...props}
		>
			{/* The clip folds to 0; the row's own padding and border could not. */}
			<div className="min-h-0 overflow-hidden">
				<div className={s.row()}>
					<span aria-hidden className={s.thumb()}>
						{preview && status !== "error" ? (
							<img src={preview} alt="" className={s.thumbImage()} />
						) : status === "error" ? (
							<AlertIcon />
						) : (
							<FileIcon />
						)}
					</span>
					<span className={s.body()}>
						<span className={s.line()}>
							<span className={s.name()} title={name}>
								{name}
							</span>
							<span className={s.meta()}>{meta}</span>
						</span>
						<span className={s.progress()} inert={!uploading}>
							<span className="min-h-0 overflow-hidden">
								<span
									role="progressbar"
									aria-label={`${name}, ${labels[statusLabel(status)]}`}
									aria-valuemin={0}
									aria-valuemax={100}
									aria-valuenow={Math.round(clamped)}
									className={cn(s.track(), "block")}
								>
									<span
										className={cn(s.bar(), "block")}
										style={{ scale: `${clamped / 100} 1` }}
									/>
								</span>
							</span>
						</span>
					</span>
					<span className={s.actions()}>
						{status === "error" && onRetry ? (
							<Button
								size="icon-xs"
								variant="ghost"
								aria-label={`${labels.retry} ${name}`}
								onClick={onRetry}
							>
								<RetryIcon />
							</Button>
						) : null}
						{onRemove ? (
							<Button
								size="icon-xs"
								variant="ghost"
								aria-label={`${labels.remove} ${name}`}
								disabled={leaving}
								onClick={() => setLeaving(true)}
							>
								<CloseIcon />
							</Button>
						) : null}
					</span>
				</div>
			</div>
		</li>
	);
}

/** Object URLs for image files, revoked when a file leaves the list or on unmount. */
function usePreviews(files: UploadFile[]): Record<string, string> {
	const cache = useRef(new Map<string, string>());
	const ids = files.map((f) => f.id).join("|");
	// Keyed by the id list, not array identity, so progress updates keep the same URLs.
	// biome-ignore lint/correctness/useExhaustiveDependencies: ids only invalidate it on change; files left out on purpose, the listed values decide when it runs.
	const previews = useMemo(() => {
		const next = new Map<string, string>();
		for (const item of files) {
			if (!isImage(item.file)) continue;
			next.set(item.id, cache.current.get(item.id) ?? URL.createObjectURL(item.file));
		}
		for (const [id, url] of cache.current) if (!next.has(id)) URL.revokeObjectURL(url);
		cache.current = next;
		return Object.fromEntries(next);
	}, [ids]);
	useEffect(
		() => () => {
			for (const url of cache.current.values()) URL.revokeObjectURL(url);
			cache.current.clear();
		},
		[],
	);
	return previews;
}

function UploadIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
			<path d="M7 9l5-5 5 5" />
			<path d="M12 4v12" />
		</svg>
	);
}

function FileIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M14 3v4a1 1 0 0 0 1 1h4" />
			<path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
		</svg>
	);
}

function AlertIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 8v5M12 16.5h.01" />
			<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
		</svg>
	);
}

function RetryIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
			<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M18 6 6 18M6 6l12 12" />
		</svg>
	);
}
