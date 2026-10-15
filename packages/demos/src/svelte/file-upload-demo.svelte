<script lang="ts">
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadError,
	FileUploadItem,
	FileUploadList,
	type UploadFile,
} from "@baby-ui/svelte";
import { type ComponentProps, untrack } from "svelte";
import { controlProps } from "../data/preview-props";
import { AVATAR_MAX_BYTES, sampleUploads, UPLOAD_TICK_MS } from "../data/utility-inputs";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FileUpload>>(props));

let files = $state<UploadFile[]>(sampleUploads());
const timers = new Map<string, ReturnType<typeof setInterval>>();
const retried = new Set<string>();

// Once on mount: start the queued samples; untracked so progress ticks don't rerun it.
$effect(() => {
	untrack(() => {
		for (const f of files) if (f.status === "queued") upload(f.id);
	});
	return () => {
		for (const timer of timers.values()) clearInterval(timer);
	};
});

function patch(id: string, next: (f: UploadFile) => UploadFile) {
	files = files.map((f) => (f.id === id ? next(f) : f));
}

// Stands in for a real upload request reporting progress.
function upload(id: string) {
	patch(id, (f) => ({ ...f, status: "uploading", progress: 0, error: undefined }));
	const timer = setInterval(() => {
		patch(id, (f) => {
			if (f.status !== "uploading") return f;
			const progress = Math.min(100, f.progress + 12 + Math.random() * 14);
			if (progress < 100) return { ...f, progress };
			clearInterval(timers.get(id));
			// Every third file fails once, so retry has something to do.
			const fails = f.file.name.length % 3 === 0 && !retried.has(id);
			return fails
				? { ...f, progress: 100, status: "error", error: "Network error" }
				: { ...f, progress: 100, status: "done" };
		});
	}, UPLOAD_TICK_MS);
	timers.set(id, timer);
}
</script>

<div class="w-full max-w-md">
	<FileUpload
		{files}
		accept="image/*,.pdf,.csv"
		maxSize={AVATAR_MAX_BYTES}
		maxFiles={5}
		compactAt={3}
		variant={p.variant ?? "default"}
		size={p.size ?? "default"}
		disabled={p.disabled ?? false}
		onFilesAdded={(added) => {
			const next = added.map((file) => ({
				id: crypto.randomUUID(),
				file,
				progress: 0,
				status: "queued" as const,
			}));
			files = [...files, ...next];
			for (const item of next) upload(item.id);
		}}
	>
		<FileUploadDropzone />
		<FileUploadError />
		<FileUploadList>
			{#each files as file (file.id)}
				<FileUploadItem
					{file}
					onRetry={() => {
						retried.add(file.id);
						upload(file.id);
					}}
					onRemove={() => {
						clearInterval(timers.get(file.id));
						files = files.filter((f) => f.id !== file.id);
					}}
				/>
			{/each}
		</FileUploadList>
	</FileUpload>
</div>
