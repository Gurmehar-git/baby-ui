import { defineComponent, variantsOf } from "@baby-ui/registry-schema";
import { assetMenu as assetMenuVariants } from "./variants";

const VARIANTS = ["default", "compact"];

export const assetMenu = defineComponent({
	slug: "asset-menu",
	name: "Asset Menu",
	description:
		"Composable context actions for copying, opening, and downloading reusable product assets.",
	category: "advanced",
	status: "stable",
	variants: variantsOf(assetMenuVariants, ["variant"]),
	props: [
		{
			name: "variant",
			type: VARIANTS.map((value) => `"${value}"`).join(" | "),
			description: "Density shared by the menu surface, items, and asset previews.",
			default: "default",
			control: { kind: "select", options: VARIANTS },
		},
		{
			name: "open",
			type: "boolean",
			description:
				"Controlled menu state, paired with `onOpenChange`; bindable in Svelte.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The anchored menu keeps its opacity transition and removes travel.",
		behaviour: [
			"The menu opens from the pointer origin and returns there when dismissed.",
			"Items use the shared menu highlight and press feedback.",
		],
	},
	a11y: {
		keyboard: [
			{ keys: ["Shift", "F10"], action: "Open the asset menu" },
			{ keys: ["Arrow Up", "Arrow Down"], action: "Move between actions" },
			{ keys: ["Enter", "Space"], action: "Run the focused action" },
			{ keys: ["Escape"], action: "Close and restore focus" },
		],
		notes: [
			"The trigger retains its own accessible name.",
			"Copy outcomes are reported by the caller through `onCopy`.",
		],
	},
	guidance: {
		when: [
			"A logo, illustration, file, or template needs a compact set of copy and download actions.",
		],
		whenNot: [
			{ text: "People need to browse and filter a collection.", use: "command" },
			{ text: "The action must remain visible without discovery.", use: "button-group" },
		],
		responsive: ["Long press opens the same actions on touch devices."],
		performance: ["The menu mounts on demand through the shared Context Menu primitive."],
		ai: [
			"Compose only the actions the supplied asset supports.",
			"Use AssetMenuCopyItem for text payloads and AssetMenuLinkItem for real destinations.",
		],
	},
	licenseOrigin: {
		source: "sv-chanhdai",
		url: "https://github.com/sv-chanhdai/sv-chanhdai",
		license: "MIT",
		copyright: "Copyright (c) 2026 Sikandar Bhide",
	},
	impl: {
		react: { entry: "AssetMenu" },
		svelte: { entry: "AssetMenu" },
	},
	keywords: ["asset", "menu", "copy", "download", "context", "brand"],
});
