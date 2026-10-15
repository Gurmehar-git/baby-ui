import { defineComponent } from "../index.ts";

const VARIANTS = ["chip", "card", "tile"];
const STATUSES = ["uploading", "ready", "error"];
const SVELTE_PARTS = [
	"preview",
	"content",
	"name",
	"meta",
	"progress",
	"remove",
	"retry",
];

export const attachment = defineComponent({
	slug: "attachment",
	name: "Attachment",
	description:
		"Composable file attachments for chat: chips in a scrolling composer row, full rows or image tiles, with an upload ring, a file-type badge, retry and a remove that folds the chip away.",
	category: "agents",
	status: "stable",
	variants: { variant: VARIANTS, status: STATUSES },
	props: [
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Attachment: `chip` a compact pill for a composer; `card` a full-width row with a bar; `tile` an image square whose remove shows on hover or focus.",
			default: "chip",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "status",
			type: STATUSES.map((v) => `"${v}"`).join(" | "),
			description:
				"Attachment: uploading shows a progress ring (a bar on `card`), error tints the edge and offers AttachmentRetry.",
			default: "ready",
			control: { kind: "select", options: STATUSES },
		},
		{
			name: "progress",
			type: "number",
			description: "Attachment: upload percentage while uploading.",
			default: 40,
			control: { kind: "number", min: 0, max: 100, step: 1 },
		},
		{
			name: "name",
			type: "string",
			description:
				"Attachment: the file name; it labels remove and retry, and AttachmentName shows it by default.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "src",
			type: "string",
			description:
				"AttachmentPreview: image URL; without one it shows the file type, e.g. PDF.",
			control: { kind: "none" },
		},
		{
			name: "onClick",
			type: "(event) => void",
			description:
				"AttachmentRemove: runs after the attachment folds shut (`onclick` in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: "Partial<AttachmentLabels>",
			description: "Attachment: uploading, ready, error, remove and retry text.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Attachments appear and leave without folding; the ring and bar jump to each value.",
		behaviour: [
			"A new chip unfolds its width from 0 while scaling from 0.96, so the row makes room instead of jumping.",
			"Remove folds the chip's width shut over 150ms, then runs its handler; the next chip glides over.",
			"The upload ring fills by stroke offset over 250ms; card's bar fills by scale and folds away when done.",
			"A failed upload tints the edge and swaps the preview for a warning, with Retry beside Remove.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Tab"], action: "Reaches retry and remove on each attachment" }],
		notes: [
			"Attachments is a list and each Attachment a listitem; a lone Attachment drops the role.",
			"The state is written out as text, never carried by the edge colour alone.",
			"Remove and retry name their file, so a row of chips is not identical buttons.",
			"A polite live region announces state changes, not every percent; the hidden bar row is inert.",
			"Tile's remove stays visible on touch screens, where hover does not exist.",
		],
	},
	guidance: {
		when: ["Files attached to a chat message, before sending or in the sent bubble."],
		whenNot: [
			{
				text: "A form field that takes files, with a drop zone and validation.",
				use: "file-upload",
			},
		],
		ai: [
			"Compose Attachments > Attachment > AttachmentPreview, AttachmentContent (AttachmentName, AttachmentMeta), AttachmentRetry, AttachmentRemove.",
			'Use `variant="scroll"` on Attachments above a composer and `"wrap"` inside a sent message.',
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
				{ path: "attachment/attachment.tsx", type: "registry:ui" },
				{ path: "attachment/variants.ts", type: "registry:ui" },
				{ path: "attachment/labels.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/motion.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge"],
		},
		svelte: {
			entry: "Attachment",
			files: [
				{ path: "attachment/attachment.svelte", type: "registry:ui" },
				{ path: "attachment/attachments.svelte", type: "registry:ui" },
				...SVELTE_PARTS.map((part) => ({
					path: `attachment/attachment-${part}.svelte`,
					type: "registry:ui" as const,
				})),
				{ path: "attachment/context.ts", type: "registry:ui" },
				{ path: "attachment/variants.ts", type: "registry:ui" },
				{ path: "attachment/labels.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
				{ path: "lib/motion.ts", type: "registry:lib" },
			],
			dependencies: ["tailwind-variants", "clsx", "tailwind-merge"],
		},
	},
	keywords: ["attachment", "chat", "composer", "file chip", "upload progress"],
});
