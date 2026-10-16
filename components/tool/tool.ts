import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { tool as toolVariants } from "./react/variants";

const STATUSES = ["pending", "running", "done", "error"];

export const tool = defineComponent({
	slug: "tool",
	name: "Tool Call",
	description: "Collapsible tool invocation showing state, input and output.",
	category: "agents",
	status: "stable",
	variants: variantsOf(toolVariants, ["status"]),
	props: [
		{
			name: "name",
			type: "string",
			description: "Tool name, shown in monospace.",
			default: "search_docs",
			control: { kind: "text" },
		},
		{
			name: "status",
			type: STATUSES.map((v) => `"${v}"`).join(" | "),
			description: "Current state.",
			default: "running",
			control: { kind: "select", options: STATUSES },
		},
		{
			name: "input",
			type: "string",
			description: "Serialised arguments.",
			control: { kind: "none" },
		},
		{
			name: "output",
			type: "string",
			description: "Serialised result.",
			control: { kind: "none" },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Whether the input/output panel is expanded. Controlled with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "defaultOpen",
			type: "boolean",
			description: "Uncontrolled starting state.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Fires when the header toggles the panel.",
			control: { kind: "none" },
		},
		{
			name: "labels",
			type: 'Partial<Record<Status | "input" | "output", string>>',
			description:
				"Overrides for the status words and section headings (Queued, Running, Completed, Failed, Input, Output).",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The spinner stops and the panel opens instantly.",
		behaviour: [
			"Only the running state animates. Everything else is a static icon, so a finished list is still.",
			"The panel opens over 200ms with grid-template-rows and closes over 120ms; the chevron turns on the same timing.",
		],
	},
	a11y: {
		keyboard: [{ keys: ["Enter", "Space"], action: "Toggles the panel" }],
		notes: [
			"State is written out as a word beside the icon, so it does not depend on colour.",
			"The collapsed panel is inert, so its payload leaves the tab order and the accessibility tree.",
			"Collapsed by default: a transcript full of expanded tool payloads buries the answer.",
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
			entry: "Tool",
		},
		svelte: {
			entry: "Tool",
		},
	},
	keywords: ["tool"],
});
