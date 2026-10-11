import { defineComponent } from "../index.ts";

export const attachment = defineComponent({
	slug: "attachment",
	name: "Attachment",
	description:
		"File row with a thumbnail, upload progress, and ready or failed states with remove and retry.",
	category: "agents",
	status: "stable",
	variants: { status: ["uploading", "ready", "error"] },
	props: [
		{
			name: "name",
			type: "string",
			description: "File name.",
			default: "spec-draft.md",
			control: { kind: "text" },
		},
		{
			name: "size",
			type: "string",
			description: "Human-readable size, shown when ready.",
			default: "18 KB",
			control: { kind: "text" },
		},
		{
			name: "status",
			type: '"uploading" | "ready" | "error"',
			description: "Current state.",
			default: "ready",
			control: { kind: "select", options: ["uploading", "ready", "error"] },
		},
		{
			name: "preview",
			type: "string",
			description: "Thumbnail URL, e.g. an object URL for an image being uploaded.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<AttachmentLabels>",
			description: "uploading, ready, error, remove and retry text.",
			control: { kind: "none" },
		},
		{
			name: "onRemove",
			type: "() => void",
			description: "Shows a remove action (`onremove` in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "onRetry",
			type: "() => void",
			description: "Shows a retry action on failed uploads (`onretry` in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "progress",
			type: "number",
			description: "Upload percentage, used while uploading.",
			default: 40,
			control: { kind: "number", min: 0, max: 100, step: 1 },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"The bar jumps to its value and the progress row shows or hides without easing.",
		behaviour: [
			"Enters with a short fade-up the first time it renders.",
			"The progress bar fills by transform over 280ms, matching the standalone progress component.",
			"The progress row opens over 200ms when uploading starts and collapses over 120ms when it ends, by grid rows, so the row height never pops.",
			"Remove and retry scale to 0.97 on press.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Reaches retry and remove" }],
		notes: [
			"The state is always written out as text, never carried by the border colour alone.",
			"Remove and retry name their file, so a list of them is not five identical buttons.",
			"The bar is a progressbar with the file name; a polite live region announces state changes, not every percent.",
			"The hidden progress row is inert.",
		],
	},
	licenseOrigin: {
		source: "sivir-ui",
		url: "https://github.com/aidan-neel/sivir-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 Aidan Neel",
	},
	impl: {
		react: {
			entry: "Attachment",
			files: [
				{ path: "attachment/variants.ts", type: "registry:ui" },
				{ path: "attachment/labels.ts", type: "registry:ui" },
				{ path: "attachment/attachment.tsx", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge"],
		},
		svelte: {
			entry: "Attachment",
			files: [
				{ path: "attachment/variants.ts", type: "registry:ui" },
				{ path: "attachment/labels.ts", type: "registry:ui" },
				{ path: "attachment/attachment.svelte", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge"],
		},
	},
	keywords: ["attachment"],
});
