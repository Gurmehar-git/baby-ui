"use client";

import { type ComponentProps, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "../button/button";
import { FieldError } from "../field/field";
import { cn } from "../lib/cn";
import {
	FILE_UPLOAD_LABELS,
	type FileRejection,
	type FileUploadLabels,
	formatBytes,
	isImage,
	rejectionMessage,
	splitFiles,
	type UploadFile,
	uploadHint,
	uploadSummary,
} from "./core";
import { type FileUploadSize, fileUpload } from "./variants";

export type { FileRejection, FileUploadLabels, FileUploadSize, UploadFile };

export interface FileUploadProps extends Omit<ComponentProps<"div">, "onDrop"> {
	/** Files the parent is tracking; it owns uploading and progress. */
	files: UploadFile[];
	/** Accepted files from a drop or the picker, already validated. */
	onFilesAdded: (files: File[]) => void;
	onRetry?: (id: string) => void;
	onRemove?: (id: string) => void;
	/** Files turned away by `accept`, `maxSize` or `maxFiles`. They are also listed inline. */
	onReject?: (rejections: FileRejection[]) => void;
	/** Same syntax as the input attribute: `"image/*,.pdf"`. */
	accept?: string;
	/** Largest file in bytes. */
	maxSize?: number;
	maxFiles?: number;
	multiple?: boolean;
	disabled?: boolean;
	size?: FileUploadSize;
	labels?: Partial<FileUploadLabels>;
	/** Once the list holds this many files, the prompt folds to a slim bar; a drag brings it back. */
	compactAt?: number;
}

export function FileUpload({
	files,
	onFilesAdded,
	onRetry,
	onRemove,
	onReject,
	accept,
	maxSize,
	maxFiles,
	multiple = true,
	disabled = false,
	size = "default",
	labels: labelsProp,
	compactAt,
	className,
	...props
}: FileUploadProps) {
	const labels = { ...FILE_UPLOAD_LABELS, ...labelsProp };
	const s = fileUpload({ size });
	const hintId = useId();
	const input = useRef<HTMLInputElement>(null);
	const zone = useRef<HTMLButtonElement>(null);
	const [dragging, setDragging] = useState(false);
	const [rejections, setRejections] = useState<FileRejection[]>([]);
	const previews = usePreviews(files);
	const hint = uploadHint(labels, accept, maxSize);

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
			const el = zone.current;
			if (el) {
				el.dataset.nudge = "false";
				el.getBoundingClientRect();
				el.dataset.nudge = "true";
			}
		}
		if (accepted.length) onFilesAdded(accepted);
	}

	return (
		<div data-slot="file-upload" className={cn(s.root(), className)} {...props}>
			<button
				ref={zone}
				type="button"
				data-dragging={dragging}
				data-compact={compactAt !== undefined && files.length >= compactAt && !dragging}
				disabled={disabled}
				aria-describedby={hint ? hintId : undefined}
				className={s.zone()}
				onClick={() => input.current?.click()}
				onDragEnter={(e) => {
					e.preventDefault();
					setDragging(true);
				}}
				onDragOver={(e) => e.preventDefault()}
				onDragLeave={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget as Node | null))
						setDragging(false);
				}}
				onDrop={(e) => {
					e.preventDefault();
					setDragging(false);
					take(e.dataTransfer.files);
				}}
			>
				<span aria-hidden className={s.zoneIcon()}>
					<UploadIcon />
				</span>
				<span className={s.zoneTitle()}>{dragging ? labels.dropping : labels.title}</span>
				{hint ? (
					<span id={hintId} className={s.zoneHint()}>
						{hint}
					</span>
				) : null}
			</button>
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
			<FieldError
				errors={rejections.map((r) => ({
					message: rejectionMessage(r, labels, { maxSize, maxFiles }),
				}))}
			/>
			{files.length ? (
				<ul className={s.list()}>
					{files.map((item) => (
						<li key={item.id} className={s.item()} data-status={item.status}>
							<div className={s.row()}>
								<span aria-hidden className={s.thumb()}>
									{previews[item.id] ? (
										<img src={previews[item.id]} alt="" className={s.thumbImage()} />
									) : (
										<FileIcon />
									)}
								</span>
								<span className={s.body()}>
									<span className={s.line()}>
										<span className={s.name()} title={item.file.name}>
											{item.file.name}
										</span>
										<span className={s.meta()}>
											{item.status === "error"
												? (item.error ?? labels.failed)
												: item.status === "uploading"
													? `${Math.round(item.progress)}%`
													: item.status === "done"
														? formatBytes(item.file.size)
														: labels.queued}
										</span>
									</span>
									<span
										role="progressbar"
										aria-label={`${item.file.name}, ${labels[statusLabel(item.status)]}`}
										aria-valuemin={0}
										aria-valuemax={100}
										aria-valuenow={Math.round(item.progress)}
										className={s.track()}
									>
										<span
											data-status={item.status}
											className={s.bar()}
											style={{
												scale: `${Math.min(100, Math.max(0, item.progress)) / 100} 1`,
											}}
										/>
									</span>
								</span>
								<span className={s.actions()}>
									{item.status === "error" && onRetry ? (
										<Button
											size="icon-xs"
											variant="ghost"
											aria-label={`${labels.retry} ${item.file.name}`}
											onClick={() => onRetry(item.id)}
										>
											<RetryIcon />
										</Button>
									) : null}
									{onRemove ? (
										<Button
											size="icon-xs"
											variant="ghost"
											aria-label={`${labels.remove} ${item.file.name}`}
											onClick={() => onRemove(item.id)}
										>
											<CloseIcon />
										</Button>
									) : null}
								</span>
							</div>
						</li>
					))}
				</ul>
			) : null}
			<p aria-live="polite" className="sr-only">
				{uploadSummary(files, labels)}
			</p>
		</div>
	);
}

const statusLabel = (status: UploadFile["status"]) =>
	status === "error" ? "failed" : status;

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
