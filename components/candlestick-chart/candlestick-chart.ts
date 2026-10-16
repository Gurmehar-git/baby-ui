import { defineComponent } from "@baby-ui/registry-schema";

export const candlestickChart = defineComponent({
	slug: "candlestick-chart",
	name: "Candlestick Chart",
	description:
		"OHLC candles that spring up in sequence, hollow when rising and filled when falling.",
	category: "charts",
	status: "stable",
	props: [
		{
			name: "data",
			type: "Record<string, unknown>[]",
			description: "Rows with a date under xKey and numeric open, high, low and close.",
			required: true,
			control: { kind: "none" },
		},
		{
			name: "size",
			type: '"narrow" | "regular" | "wide"',
			description:
				"Candlestick: body width, 40, 60 or 80% of each slot, and stroke weight.",
			default: "regular",
			control: { kind: "select", options: ["narrow", "regular", "wide"] },
		},
		{
			name: "dimOpacity",
			type: "number",
			description: "Candlestick: opacity of the other candles while one is active.",
			default: 0.4,
			control: { kind: "number", min: 0.1, max: 1, step: 0.1 },
		},
		{
			name: "status",
			type: '"loading" | "ready"',
			description:
				"Loading fades the candles and retweens the grid; ready replays the entrance.",
			default: "ready",
			control: { kind: "select", options: ["ready", "loading"] },
		},
		{
			name: "labels",
			type: "{ open?: string; high?: string; low?: string; close?: string }",
			description: "Row names in the tooltip and data table.",
			control: { kind: "none" },
		},
		{
			name: "upKey",
			type: "string",
			description:
				"Config key for rising candles: its colour and legend toggle. Falls back to --chart-positive.",
			default: "up",
			control: { kind: "none" },
		},
		{
			name: "downKey",
			type: "string",
			description: "Config key for falling candles. Falls back to --chart-negative.",
			default: "down",
			control: { kind: "none" },
		},
		{
			name: "activeIndex",
			type: "number | null",
			description:
				"Candle under the pointer or keyboard. Controlled with onActiveIndexChange; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "Candles appear at full height with no stagger.",
		behaviour: [
			"Wick and body grow from their own centres on a spring of stiffness 118 and damping 18.5 (solved from a 0.8s duration with 0.15 bounce), so they overshoot slightly.",
			"Candles start 0.6 x 1100ms / n apart and fade in over 150ms; the chart turns interactive when the last spring settles.",
			"While a candle is active the rest dim over 150ms.",
		],
	},
	a11y: {
		keyboard: [],
		notes: [
			"Rising candles are hollow and falling ones filled, so direction never rests on colour alone.",
			"The data table lists open, high, low and close for every row.",
			"Keyboard follows the Chart plot: arrow keys move between points.",
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
			entry: "CandlestickChart",
		},
		svelte: {
			entry: "CandlestickChart",
		},
	},
	keywords: ["candlestick", "ohlc", "chart", "finance", "stock"],
});
