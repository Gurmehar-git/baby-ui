import { defineComponent } from "../index.ts";

const VARIANTS = ["default", "bordered"];

export const resizable = defineComponent({
	slug: "resizable",
	name: "Resizable",
	description:
		"A horizontal split view: dividers follow the pointer, resist past limits, and snap collapsible panes closed.",
	category: "advanced",
	status: "stable",
	variants: { variant: VARIANTS },
	props: [
		{
			name: "onLayoutChange",
			type: "(sizes: number[]) => void",
			description:
				"ResizablePanelGroup: each pane's share in percent after a resize settles.",
			control: { kind: "none" },
		},
		{
			name: "defaultSize",
			type: "number",
			description: "ResizablePanel: starting share; shares are relative.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "minSize",
			type: "number",
			description:
				"ResizablePanel: px where the pane resists; content clips and fades below it.",
			default: 80,
			control: { kind: "none" },
		},
		{
			name: "collapsible",
			type: "boolean",
			description:
				"ResizablePanel: dragging well past the minimum or flicking to the edge snaps it closed.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "label",
			type: "string",
			description: "ResizablePanel: names the pane for its divider.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description: "`bordered` frames the group.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Panes change size without the glide.",
		behaviour: [
			"Dividers follow the pointer 1:1 and resist like elastic past a pane's limits.",
			"Collapse snaps, releases, keyboard steps and resets glide on a flex-grow transition.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["ArrowLeft", "ArrowRight"], action: "Resize; Shift for bigger steps" },
			{ keys: ["Home", "End"], action: "Jump to the limits" },
			{ keys: ["Enter"], action: "Hide or restore a collapsible pane" },
			{ keys: ["Escape"], action: "Cancel a drag" },
		],
		notes: [
			"Each divider is a separator with its share as the value; a hidden pane is announced with how to restore it.",
		],
	},
	guidance: {
		when: [
			"Mail, code and file views where people trade space between side-by-side content.",
		],
		whenNot: [
			{ text: "A drawer that overlays the page.", use: "sheet" },
			{ text: "Show and hide one section.", use: "collapsible" },
		],
		responsive: ["Below the sum of the minimums each floor scales down in proportion."],
		performance: ["Pointer moves write flex-grow directly; no re-render while dragging."],
		ai: ["Give every panel a stable `id` and a `label`; keep the set of panels fixed."],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "ResizablePanelGroup",
			files: [
				{ path: "resizable/resizable.tsx", type: "registry:ui" },
				{ path: "resizable/split.ts", type: "registry:ui" },
				{ path: "resizable/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [],
		},
		svelte: {
			entry: "ResizablePanelGroup",
			files: [
				{ path: "resizable/resizable-panel-group.svelte", type: "registry:ui" },
				{ path: "resizable/resizable-panel.svelte", type: "registry:ui" },
				{ path: "resizable/resizable-handle.svelte", type: "registry:ui" },
				{ path: "resizable/split.ts", type: "registry:ui" },
				{ path: "resizable/variants.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants"],
			registryDependencies: [],
		},
	},
	keywords: ["resizable", "split", "panes", "splitter", "layout", "panels"],
});
