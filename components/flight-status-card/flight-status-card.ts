import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { flightStatusCard as flightStatusCardVariants } from "./react/variants";

const STATUSES = ["scheduled", "boarding", "departed", "delayed", "landed", "cancelled"];
const TONES = ["neutral", "info", "success", "warning", "destructive"];
const DISPLAYS = ["matrix", "text"];

export const flightStatusCard = defineComponent({
	slug: "flight-status-card",
	name: "Flight Status Card",
	description:
		"A flight's route in dot-matrix airport codes, its status badge and a progress track with a plane riding the fill.",
	category: "blocks",
	status: "stable",
	variants: variantsOf(flightStatusCardVariants, ["tone", "display"]),
	props: [
		{
			name: "departureCode",
			type: "string",
			description: "Departure airport code.",
			required: true,
			default: "YYZ",
			control: { kind: "text" },
		},
		{
			name: "arrivalCode",
			type: "string",
			description: "Arrival airport code.",
			required: true,
			default: "HND",
			control: { kind: "text" },
		},
		{
			name: "departureCity",
			type: "string",
			description: "City under the departure code.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "arrivalCity",
			type: "string",
			description: "City under the arrival code.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "departureTime",
			type: "string",
			description: "Preformatted departure time.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "arrivalTime",
			type: "string",
			description: "Preformatted arrival time.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "status",
			type: STATUSES.map((v) => `"${v}"`).join(" | "),
			description: "Current flight status; picks the badge label and the default tone.",
			required: true,
			default: "departed",
			control: { kind: "select", options: STATUSES },
		},
		{
			name: "progress",
			type: "number",
			description:
				"Share of the route flown, 0 to 100. The fill transitions to each new value.",
			required: true,
			default: 45,
			control: { kind: "number", min: 0, max: 100, step: 5 },
		},
		{
			name: "flight",
			type: "string",
			description: "Flight number shown as the card title.",
			control: { kind: "none" },
		},
		{
			name: "eta",
			type: "string",
			description: "Headline of the side panel.",
			control: { kind: "none" },
		},
		{
			name: "etaNote",
			type: "string",
			description: "Muted line under `eta`.",
			control: { kind: "none" },
		},
		{
			name: "nextEvent",
			type: "string",
			description: "Accent line at the bottom of the side panel.",
			control: { kind: "none" },
		},
		{
			name: "remaining",
			type: "string",
			description: "Text at the right end of the progress track.",
			control: { kind: "none" },
		},
		{
			name: "tone",
			type: TONES.map((v) => `"${v}"`).join(" | "),
			description: "Colour of the codes, arrow and fill. Defaults to the status's tone.",
			control: { kind: "select", options: TONES },
		},
		{
			name: "display",
			type: DISPLAYS.map((v) => `"${v}"`).join(" | "),
			description: "Airport codes as a 5x7 dot matrix or as monospace text.",
			default: "matrix",
			control: { kind: "select", options: DISPLAYS },
		},
		{
			name: "labels",
			type: "Partial<FlightStatusLabels>",
			description: "Status badge text plus the progress bar's accessible name.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Codes and fill appear in place; progress changes jump.",
		behaviour: [
			"Dot-matrix glyphs rise in one after another; the progress fill wipes in once on mount.",
			"Each new `progress` value transitions the fill width; nothing advances on its own.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"The route is read once from a visually hidden sentence; the drawn codes are aria-hidden.",
			"The track is a `progressbar` with `remaining` as its value text.",
		],
	},
	licenseOrigin: {
		source: "componentry",
		url: "https://componentry.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Harsh Jadhav",
	},
	impl: {
		react: {
			entry: "FlightStatusCard",
		},
		svelte: {
			entry: "FlightStatusCard",
		},
	},
	keywords: ["flight", "travel", "status", "progress", "dot matrix", "card"],
});
