import { defineComponent } from "@baby-ui/registry-schema";

const SVELTE_PARTS = ["dropzone", "error", "list", "item"];

export const fileUpload = defineComponent({
	slug: "file-upload",
	name: "File Upload",
	description:
		"Composable upload: a drop zone with type, size and count checks, and file rows with progress, retry and remove. You own the upload.",
	category: "base",
	status: "beta",
	variants: { variant: ["default", "inline"], size: ["sm", "default"] },
	props: [
		{
			name: "files",
			type: '{ id: string; file: File; progress: number; status: "queued" | "uploading" | "done" | "error"; error?: string }[]',
			description:
				"FileUpload: files you are tracking. You upload them and update progress and status; render each with FileUploadItem.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "onFilesAdded",
			type: "(files: File[]) => void",
			description:
				"FileUpload: accepted files from a drop or the picker, already checked against the limits.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "inline"',
			description:
				"FileUpload: `default` is a roomy drop zone over the list; `inline` is a slim bar from the start, for forms.",
			default: "default",
			control: { kind: "select", options: ["default", "inline"] },
		},
		{
			name: "size",
			type: '"sm" | "default"',
			description: "FileUpload: drop zone padding and thumbnail size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "FileUpload: disable dropping and browsing.",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "accept",
			type: "string",
			description: "FileUpload: same syntax as the input attribute, e.g. `image/*,.pdf`.",
			control: { kind: "none" },
		},
		{
			name: "maxSize",
			type: "number",
			description:
				"FileUpload: largest file in bytes. Larger files are turned away and listed by FileUploadError.",
			control: { kind: "none" },
		},
		{
			name: "maxFiles",
			type: "number",
			description: "FileUpload: most files the list may hold.",
			control: { kind: "none" },
		},
		{
			name: "compactAt",
			type: "number",
			description:
				"FileUpload: once the list holds this many files, the drop zone folds to a slim bar; a drag brings it back.",
			control: { kind: "none" },
		},
		{
			name: "onRemove",
			type: "() => void",
			description:
				"FileUploadItem: shows a remove button; the row folds shut before it runs.",
			control: { kind: "none" },
		},
		{
			name: "onRetry",
			type: "() => void",
			description: "FileUploadItem: shows a retry button on a failed file.",
			control: { kind: "none" },
		},
	],
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "On the drop zone, opens the file picker" },
			{ keys: ["Tab"], action: "Reaches each row's retry and remove" },
		],
		notes: [
			"The drop zone is a real button, so it takes focus and opens the picker from the keyboard.",
			"Turned-away files are listed in a FieldError alert, one reason per file.",
			"Each row has a labelled progressbar; a polite summary announces how many have uploaded.",
			"A failed row says so in text and swaps its icon for a warning, never by border colour alone.",
			"Retry and remove name their file, so a long list is not identical buttons; the hidden bar row is inert.",
		],
	},
	motion: {
		springs: [],
		reducedMotion:
			"Rows appear and leave without folding, bars jump to each value, and a refused drop does not shake.",
		behaviour: [
			"Drag-over tints the zone in the primary colour and lifts its icon 2px over 150ms.",
			"A refused drop shakes the zone for 240ms beside its error.",
			"New rows open from 0fr over 200ms; a removed row folds shut over 150ms before onRemove runs.",
			"The bar fills by scale over 250ms; its row opens when uploading starts and folds once done or failed.",
			"With compactAt or the inline variant, the zone folds to a slim bar; a drag opens it again.",
		],
	},
	guidance: {
		when: [
			"Any form or panel that takes files, from one avatar to a batch of documents.",
		],
		whenNot: [
			{
				text: "A file chip inside a chat composer or a sent message.",
				use: "attachment",
			},
		],
		ai: [
			"Compose FileUpload > FileUploadDropzone, FileUploadError, FileUploadList > FileUploadItem per file.",
			"Keep upload state in your files array; flip status queued > uploading > done or error as your request runs.",
		],
	},
	impl: {
		react: {
			entry: "FileUpload",
			files: [
				{ path: "file-upload/file-upload.tsx", type: "registry:ui" },
				{ path: "file-upload/core.ts", type: "registry:ui" },
				{ path: "file-upload/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/motion.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "field"],
		},
		svelte: {
			entry: "FileUpload",
			files: [
				{ path: "file-upload/file-upload.svelte", type: "registry:ui" },
				...SVELTE_PARTS.map((part) => ({
					path: `file-upload/file-upload-${part}.svelte`,
					type: "registry:ui" as const,
				})),
				{ path: "file-upload/context.ts", type: "registry:ui" },
				{ path: "file-upload/core.ts", type: "registry:ui" },
				{ path: "file-upload/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/motion.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "field"],
		},
	},
	keywords: ["file upload", "dropzone", "drag and drop", "upload", "progress"],
});
