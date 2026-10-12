import { defineComponent } from "../index.ts";

export const fileUpload = defineComponent({
	slug: "file-upload",
	name: "File Upload",
	description:
		"A dropzone with type, size and count checks, and a file list with per-file progress, retry and remove. You own the upload.",
	category: "base",
	status: "beta",
	variants: { size: ["sm", "default"] },
	props: [
		{
			name: "files",
			type: '{ id: string; file: File; progress: number; status: "queued" | "uploading" | "done" | "error"; error?: string }[]',
			description:
				"Files you are tracking. You upload them and update progress and status.",
			control: { kind: "none" },
		},
		{
			name: "onFilesAdded",
			type: "(files: File[]) => void",
			description:
				"Accepted files from a drop or the picker, already checked against the limits.",
			control: { kind: "none" },
		},
		{
			name: "onRetry",
			type: "(id: string) => void",
			description: "Shows a retry button on failed files.",
			control: { kind: "none" },
		},
		{
			name: "onRemove",
			type: "(id: string) => void",
			description: "Shows a remove button on every file.",
			control: { kind: "none" },
		},
		{
			name: "accept",
			type: "string",
			description: "Same syntax as the input attribute, e.g. `image/*,.pdf`.",
			control: { kind: "none" },
		},
		{
			name: "maxSize",
			type: "number",
			description: "Largest file in bytes. Larger files are listed as rejected.",
			control: { kind: "none" },
		},
		{
			name: "maxFiles",
			type: "number",
			description: "Most files the list may hold.",
			control: { kind: "none" },
		},
		{
			name: "compactAt",
			type: "number",
			description:
				"Once the list holds this many files, the prompt folds to a slim bar; a drag brings it back.",
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"sm" | "default"',
			description: "Dropzone padding and thumbnail size.",
			default: "default",
			control: { kind: "select", options: ["sm", "default"] },
		},
		{
			name: "disabled",
			type: "boolean",
			description: "Disable dropping and browsing.",
			default: false,
			control: { kind: "boolean" },
		},
	],
	a11y: {
		keyboard: [
			{ keys: ["Enter", "Space"], action: "On the dropzone, opens the file picker" },
		],
		notes: [
			"The dropzone is a real button, so it takes focus and opens the picker from the keyboard.",
			"Rejected files are listed in a FieldError alert, one reason per file.",
			"Each file has a labelled progressbar, and a polite summary announces how many have uploaded.",
		],
	},
	motion: {
		springs: [],
		reducedMotion: "Progress bars jump to each new value instead of easing.",
	},
	impl: {
		react: {
			entry: "FileUpload",
			files: [
				{ path: "file-upload/file-upload.tsx", type: "registry:ui" },
				{ path: "file-upload/core.ts", type: "registry:ui" },
				{ path: "file-upload/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "field"],
		},
		svelte: {
			entry: "FileUpload",
			files: [
				{ path: "file-upload/file-upload.svelte", type: "registry:ui" },
				{ path: "file-upload/core.ts", type: "registry:ui" },
				{ path: "file-upload/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: ["button", "field"],
		},
	},
	keywords: [
		"file upload",
		"dropzone",
		"drag and drop",
		"upload",
		"attachment",
		"progress",
	],
});
