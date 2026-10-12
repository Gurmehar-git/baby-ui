import { defineComponent } from "../index.ts";

export const errorBoundary = defineComponent({
	slug: "error-boundary",
	name: "Error Boundary",
	description:
		"Catches errors while its children render and shows a retryable fallback built from Empty, instead of a blank page.",
	category: "base",
	status: "beta",
	props: [
		{
			name: "variant",
			type: '"default" | "outline" | "card"',
			description: "The default fallback's frame, passed to Empty.",
			default: "card",
			control: { kind: "select", options: ["default", "outline", "card"] },
		},
		{
			name: "layout",
			type: '"vertical" | "horizontal"',
			description: "The default fallback's layout, passed to Empty.",
			default: "vertical",
			control: { kind: "select", options: ["vertical", "horizontal"] },
		},
		{
			name: "size",
			type: '"sm" | "default" | "lg"',
			description: "The default fallback's size, passed to Empty.",
			default: "default",
			control: { kind: "select", options: ["sm", "default", "lg"] },
		},
		{
			name: "details",
			type: "boolean",
			description: "Show the thrown message in a collapsed details row.",
			default: true,
			control: { kind: "boolean" },
		},
		{
			name: "fallback",
			type: "ReactNode | (props) => ReactNode (React) · Snippet<[{ error, reset }]> (Svelte)",
			description: "Replaces the default fallback; receives the error and a reset.",
			control: { kind: "none" },
		},
		{
			name: "onError / onReset",
			type: "(error) => void · () => void",
			description:
				"Report the error (onerror in Svelte), and clear the state that threw before the children render again (onreset in Svelte).",
			control: { kind: "none" },
		},
		{
			name: "resetKeys",
			type: "unknown[]",
			description: "React: when any key changes, a caught error clears by itself.",
			control: { kind: "none" },
		},
	],
	a11y: {
		keyboard: [
			{ keys: ["Tab"], action: "Reaches the retry button and the details summary" },
		],
		notes: [
			"The fallback is role=alert, so the failure is announced where it happened.",
			"Errors in event handlers are not caught, in either framework; handle those where they run.",
			"React uses a class component, the only way React catches render errors; Svelte wraps its own svelte:boundary.",
		],
	},
	impl: {
		react: {
			entry: "ErrorBoundary",
			files: [
				{ path: "error-boundary/error-boundary.tsx", type: "registry:ui" },
				{ path: "error-boundary/core.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["empty", "button"],
		},
		svelte: {
			entry: "ErrorBoundary",
			files: [
				{ path: "error-boundary/error-boundary.svelte", type: "registry:ui" },
				{ path: "error-boundary/error-boundary-fallback.svelte", type: "registry:ui" },
				{ path: "error-boundary/core.ts", type: "registry:ui" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge"],
			registryDependencies: ["empty", "button"],
		},
	},
	keywords: ["error", "error boundary", "fallback", "crash", "retry"],
});
