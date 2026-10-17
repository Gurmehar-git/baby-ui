import { defineComponent } from "@baby-ui/registry-schema";

export const gaugeChart = defineComponent({
	slug: "gauge-chart",
	name: "Gauge Chart",
	description:
		"A reading drawn as a notched arc or track whose notches spring in one by one, or a compact ring dial.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "value",
			type: "number",
			description: "Current reading between min and max.",
			required: true,
			default: 72,
			control: { kind: "number", min: 0, max: 100, step: 1 },
		},
		{
			name: "layout",
			type: '"arc" | "linear" | "ring"',
			description:
				"Notched three-quarter arc with the value centred, a flat notched track with a header, or `ring`: a compact continuous dial for cards and tight spots.",
			default: "arc",
			control: { kind: "select", options: ["arc", "linear", "ring"] },
		},
		{
			name: "tone",
			type: '"primary" | "highlight" | "negative" | "scale"',
			description: "Fill of the active notches; scale steps through the sequential ramp.",
			default: "primary",
			control: { kind: "select", options: ["primary", "highlight", "negative", "scale"] },
		},
		{
			name: "notches",
			type: "number",
			description: "How many notches make up the track.",
			default: 40,
			control: { kind: "number", min: 10, max: 60, step: 2 },
			showWhen: { layout: ["arc", "linear"] },
		},
		{
			name: "spacing",
			type: "number",
			description: "Share of the track left as gaps between notches, 0 to 100.",
			default: 25,
			control: { kind: "number", min: 0, max: 60, step: 5 },
			showWhen: { layout: ["arc", "linear"] },
		},
		{
			name: "label",
			type: "string",
			description: "Accessible name; also printed with the value.",
			default: "Score",
			control: { kind: "text" },
		},
		{
			name: "bands",
			type: '{ from: number; label: string; tone: "primary" | "highlight" | "negative" }[]',
			description:
				"The highest band the value reaches sets the tone and names the state beside the label.",
			control: { kind: "none" },
		},
		{
			name: "banded",
			type: "boolean",
			description: "Demo only: pass three sample bands (Critical, Watch, Healthy).",
			default: false,
			control: { kind: "boolean" },
		},
		{
			name: "showValue",
			type: "boolean",
			description: "Print the reading, counting up from the previous value.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "min",
			type: "number",
			description: "Value at the empty end.",
			default: 0,
			control: { kind: "none" },
		},
		{
			name: "max",
			type: "number",
			description: "Value at the full end.",
			default: 100,
			control: { kind: "none" },
		},
		{
			name: "format",
			type: "(value: number) => string",
			description:
				"Formats the printed value and aria-valuetext; defaults to the locale's grouping.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion:
			"Notches appear at their final state and the value prints without counting.",
		behaviour: [
			"With `bands`, crossing a threshold recolours the gauge and renames its state.",
			"Track notches grow from 0.9 scale on a 300/20 spring, 15ms apart, never from 0.",
			"Active notches follow after 300ms, 20ms apart, on the same spring.",
			"A new value ripples from the old edge: notches switching on and off both animate instead of snapping.",
		],
	},
	a11y: {
		role: "meter",
		keyboard: [],
		notes: [
			"role=meter with min, max, now and a formatted valuetext; a single reading needs no data table or keyboard walk.",
			"The value is printed as text, so the reading never rests on the notches alone.",
		],
	},

	licenseOrigin: {
		source: "bklit-ui",
		url: "https://github.com/bklit/bklit-ui",
		license: "MIT",
		copyright: "Copyright (c) 2026 uixmat",
	},
	impl: {
		react: {
			entry: "GaugeChart",
		},
		svelte: {
			entry: "GaugeChart",
		},
	},
	keywords: ["gauge", "meter", "score", "progress", "chart"],
});
