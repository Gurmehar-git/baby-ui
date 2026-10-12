import { defineComponent } from "../index.ts";

export const contextMenu = defineComponent({
	slug: "context-menu",
	name: "Context Menu",
	description: "Right-click menu positioned at the pointer, clamped to the viewport.",
	category: "base",
	status: "stable",
	variants: { variant: ["default", "destructive"] },
	props: [
		{
			name: "open",
			type: "boolean",
			description:
				"On ContextMenu: controlled open state with onOpenChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "variant",
			type: '"default" | "destructive"',
			description:
				"On ContextMenuItem: destructive tints the item for irreversible actions.",
			default: "default",
			control: { kind: "none" },
		},
		{
			name: "inset",
			type: "boolean",
			description:
				"On items, labels and sub triggers: indents to line up with checkbox and radio items.",
			default: false,
			control: { kind: "none" },
		},
		{
			name: "checked",
			type: "boolean",
			description:
				"On ContextMenuCheckboxItem: controlled with onCheckedChange; bindable in Svelte.",
			control: { kind: "none" },
		},
		{
			name: "value",
			type: "string",
			description:
				"On ContextMenuRadioGroup: the selected radio item; controlled with onValueChange.",
			control: { kind: "none" },
		},
	],
	motion: {
		springs: [],
		reducedMotion: "The menu appears without the scale.",
		behaviour: [
			"Opens at the pointer and is clamped so it never renders partly off screen (Base UI/bits-ui popper collision detection).",
			"A submenu opens to the right of its trigger on hover or click/arrow-right/enter.",
			"Checkbox and radio items keep the menu open, so several options can be set in one visit.",
		],
	},
	a11y: {
		role: "menu",
		keyboard: [
			{ keys: ["Escape"], action: "Closes an open submenu first, then the menu" },
			{
				keys: ["Arrow Right", "Enter"],
				action: "On a submenu trigger, opens it and focuses its first item",
			},
			{
				keys: ["Arrow Left"],
				action: "Inside a submenu, closes it and returns focus to its trigger",
			},
		],
		notes: [
			"Right-click has no keyboard equivalent on every platform, so anything here must also be reachable another way.",
			"Positioning, focus trapping, roving tabindex, outside-dismiss and portaling are all delegated to Base UI (React) and bits-ui (Svelte); this component only owns the classes and data-slots.",
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
			entry: "ContextMenu",
			files: [
				{ path: "context-menu/context-menu.tsx", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/menu.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "@base-ui/react"],
		},
		svelte: {
			entry: "ContextMenu",
			files: [
				{ path: "context-menu/context-menu.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-trigger.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-content.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-item.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-label.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-separator.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-shortcut.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-sub.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-sub-content.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-sub-trigger.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-group.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-checkbox-item.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-radio-group.svelte", type: "registry:ui" },
				{ path: "context-menu/context-menu-radio-item.svelte", type: "registry:ui" },
				{ path: "lib/anchor.ts", type: "registry:lib" },
				{ path: "lib/menu.ts", type: "registry:lib" },
				{ path: "lib/cn.ts", type: "registry:lib" },
			],
			dependencies: ["clsx", "tailwind-merge", "tailwind-variants", "bits-ui"],
		},
	},
	keywords: ["context", "menu", "overlay"],
});
