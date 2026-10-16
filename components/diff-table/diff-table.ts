import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { diffRow as diffRowVariants } from "./react/variants";

export const diffTable = defineComponent({
	slug: "diff-table",
	name: "Diff Table",
	description:
		"A proposed edit as a table; each changed row is its own include/exclude toggle.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(diffRowVariants, ["change"]),
	props: [
		{
			name: "title",
			type: "string",
			description: "Header label above the table.",
			default: "Proposed changes",
			control: { kind: "text" },
		},
		{
			name: "rows",
			type: "DiffRow[]",
			description:
				'Every changed row, removed and added alike, each with its own `change` ("removed"/"added") and optional `included` starting state.',
			control: { kind: "none" },
		},
		{
			name: "included",
			type: "Record<string, boolean>",
			description:
				"Controlled include/exclude map, keyed by row key. Omit to let the table own it, seeded from each row's own `included`.",
			control: { kind: "none" },
		},
		{
			name: "onIncludedChange",
			type: "(included: Record<string, boolean>) => void",
			description: "Fired with the full map whenever a row is toggled.",
			control: { kind: "none" },
		},
		{
			name: "accepted",
			type: "boolean",
			description: "Controlled applied state. Omit to let the table own it.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "onAcceptedChange",
			type: "(accepted: boolean) => void",
			description: "Fired with `true` when Apply is pressed.",
			control: { kind: "none" },
		},
		{
			name: "onApply",
			type: "(includedKeys: string[]) => void",
			description:
				"Fired when Apply is pressed, with the keys of every currently-included row.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Rows lose their staggered fade-up entrance; the footer's applied state drops its pop-in.",
		behaviour: [
			'Rows fade up on mount with a staggered delay, no scripted "computing the diff" reveal.',
			'A row toggles include/exclude on click until Apply is pressed, after which the table locks and the footer shows an "N edits applied" confirmation.',
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches each toggleable row" },
			{ keys: ["Enter", "Space"], action: "Toggles a row" },
		],
		notes: [
			'Each row carries `role="checkbox"`/`aria-checked` since the whole row is the control, not a separate input.',
			"Removed rows use both colour and a strikethrough; added rows use colour and the same include/exclude mark, so neither depends on colour alone.",
		],
	},
	licenseOrigin: {
		source: "beUI",
		url: "https://beui.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 beUI",
	},
	impl: {
		react: {
			entry: "DiffTable",
		},
		svelte: {
			entry: "DiffTable",
		},
	},
	keywords: ["diff", "table", "review", "changes"],
});
