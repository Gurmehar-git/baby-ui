import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { countdown as countdownVariants } from "./variants";

const VARIANTS = ["default", "compact", "inline"];

export const countdown = defineComponent({
	slug: "countdown",
	name: "Countdown",
	description:
		"Counts down to a launch, live event or deadline; digits roll each second and give way to a live label at zero.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(countdownVariants, ["variant"]),
	props: [
		{
			name: "target",
			type: "Date | number | string",
			description:
				"Epoch ms, a Date, or an ISO string; a string without an offset is wall time in `timeZone`, or UTC.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "timeZone",
			type: "string",
			description:
				'IANA zone for a target without an offset, such as "America/Los_Angeles".',
			control: { kind: "none" },
		},
		{
			name: "units",
			type: "CountdownUnit[]",
			description: "Any of days, hours, minutes, seconds; the largest absorbs the rest.",
			control: { kind: "none" },
		},
		{
			name: "completeLabel",
			type: "string",
			description: "Shown and announced once the target passes.",
			default: "Live now",
			control: { kind: "none" },
		},
		{
			name: "onComplete",
			type: "() => void",
			description: "Fires once when it reaches zero while mounted, even in a hidden tab.",
			control: { kind: "none" },
		},
		{
			name: "clock",
			type: "() => number",
			description: "Clock source in epoch ms, for a server-synced clock.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: VARIANTS.map((v) => `"${v}"`).join(" | "),
			description:
				"Large display digits, a compact pill for table cells, or `inline` inside a sentence.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Digits change in place; the live dot stops pulsing.",
		behaviour: [
			"Each digit rolls down as it changes; at zero the digits cross-fade into the live label.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"role=timer with an accessible name; the remaining time is spoken in words, minutes only above a minute.",
		],
	},
	guidance: {
		when: ["A fixed moment people wait for: a launch, a live event, a deadline."],
		whenNot: [
			{ text: "Progress through work in flight.", use: "progress" },
			{ text: "A number that changes with data.", use: "rolling-digits" },
		],
		responsive: ["Default digits scale with the container, so four groups fit at 320px."],
		performance: [
			"Ticks only while on screen and the tab is visible; completion is armed separately.",
		],
		ai: [
			"Pass a target with an offset or a `timeZone`, never local wall time without one.",
			"Leave out `seconds` for countdowns days away.",
		],
	},
	licenseOrigin: {
		source: "arc",
		url: "https://uiarc.dev",
		license: "MIT",
		copyright: "Copyright (c) 2026 Elia Kuratli",
	},
	impl: {
		react: {
			entry: "Countdown",
		},
		svelte: {
			entry: "Countdown",
		},
	},
	keywords: ["countdown", "timer", "launch", "event", "deadline", "clock"],
});
