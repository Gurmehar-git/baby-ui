<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import Button from "../button/button.svelte";
import FieldError from "../field/field-error.svelte";
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

let {
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
	class: classProp,
	...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "ondrop"> & {
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
} = $props();

const labels = $derived({ ...FILE_UPLOAD_LABELS, ...labelsProp });
const s = $derived(fileUpload({ size }));
const hintId = $props.id();
const hint = $derived(uploadHint(labels, accept, maxSize));
let input = $state<HTMLInputElement>();
let dragging = $state(false);
let rejections = $state<FileRejection[]>([]);
let zone = $state<HTMLButtonElement>();

// Object URLs for image files, revoked when a file leaves the list or on unmount.
let cache = new Map<string, string>();
const previews = $derived.by(() => {
	const next = new Map<string, string>();
	for (const item of files) {
		if (!isImage(item.file)) continue;
		next.set(item.id, cache.get(item.id) ?? URL.createObjectURL(item.file));
	}
	for (const [id, url] of cache) if (!next.has(id)) URL.revokeObjectURL(url);
	cache = next;
	return Object.fromEntries(next);
});
$effect(() => () => {
	for (const url of cache.values()) URL.revokeObjectURL(url);
	cache.clear();
});

function take(list: FileList | null | undefined) {
	if (!list?.length || disabled) return;
	const { accepted, rejected } = splitFiles(Array.from(list), {
		accept,
		maxSize,
		maxFiles,
		current: files.length,
	});
	rejections = rejected;
	if (rejected.length && zone) {
		// Restart the shake on every refusal.
		zone.dataset.nudge = "false";
		zone.getBoundingClientRect();
		zone.dataset.nudge = "true";
	}
	if (rejected.length) onReject?.(rejected);
	if (accepted.length) onFilesAdded(accepted);
}

const statusLabel = (status: UploadFile["status"]) =>
	status === "error" ? "failed" : status;
</script>

<div data-slot="file-upload" class={cn(s.root(), classProp)} {...rest}>
	<button
		bind:this={zone}
		data-compact={compactAt !== undefined && files.length >= compactAt && !dragging}
		type="button"
		data-dragging={dragging}
		{disabled}
		aria-describedby={hint ? hintId : undefined}
		class={s.zone()}
		onclick={() => input?.click()}
		ondragenter={(e) => {
			e.preventDefault();
			dragging = true;
		}}
		ondragover={(e) => e.preventDefault()}
		ondragleave={(e) => {
			if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dragging = false;
		}}
		ondrop={(e) => {
			e.preventDefault();
			dragging = false;
			take(e.dataTransfer?.files);
		}}
	>
		<span aria-hidden="true" class={s.zoneIcon()}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
				<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
				<path d="M7 9l5-5 5 5" />
				<path d="M12 4v12" />
			</svg>
		</span>
		<span class={s.zoneTitle()}>{dragging ? labels.dropping : labels.title}</span>
		{#if hint}<span id={hintId} class={s.zoneHint()}>{hint}</span>{/if}
	</button>
	<input
		bind:this={input}
		type="file"
		tabindex={-1}
		aria-hidden="true"
		class="sr-only"
		{accept}
		{multiple}
		{disabled}
		onchange={(e) => {
			take(e.currentTarget.files);
			e.currentTarget.value = "";
		}}
	/>
	<FieldError
		errors={rejections.map((r) => ({ message: rejectionMessage(r, labels, { maxSize, maxFiles }) }))}
	/>
	{#if files.length}
		<ul class={s.list()}>
			{#each files as item (item.id)}
				<li class={s.item()} data-status={item.status}>
					<div class={s.row()}>
					<span aria-hidden="true" class={s.thumb()}>
						{#if previews[item.id]}
							<img src={previews[item.id]} alt="" class={s.thumbImage()} />
						{:else}
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
								<path d="M14 3v4a1 1 0 0 0 1 1h4" />
								<path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
							</svg>
						{/if}
					</span>
					<span class={s.body()}>
						<span class={s.line()}>
							<span class={s.name()} title={item.file.name}>{item.file.name}</span>
							<span class={s.meta()}>
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
							aria-label="{item.file.name}, {labels[statusLabel(item.status)]}"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={Math.round(item.progress)}
							class={s.track()}
						>
							<span
								data-status={item.status}
								class={s.bar()}
								style:scale="{Math.min(100, Math.max(0, item.progress)) / 100} 1"
							></span>
						</span>
					</span>
					<span class={s.actions()}>
						{#if item.status === "error" && onRetry}
							<Button
								size="icon-xs"
								variant="ghost"
								aria-label="{labels.retry} {item.file.name}"
								onclick={() => onRetry?.(item.id)}
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
									<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
								</svg>
							</Button>
						{/if}
						{#if onRemove}
							<Button
								size="icon-xs"
								variant="ghost"
								aria-label="{labels.remove} {item.file.name}"
								onclick={() => onRemove?.(item.id)}
							>
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M18 6 6 18M6 6l12 12" />
								</svg>
							</Button>
						{/if}
					</span>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
	<p aria-live="polite" class="sr-only">{uploadSummary(files, labels)}</p>
</div>
