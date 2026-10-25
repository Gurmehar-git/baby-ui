import type { Icon } from "@baby-ui/icons";
import {
	IconBrandJavascript,
	IconBrandReact,
	IconBrandSvelte,
	IconBrandTypescript,
} from "@baby-ui/icons";
import type { Framework } from "@baby-ui/registry-schema";
import type { Dialect } from "#lib/preferences.svelte.js";

export type TechnologyOption<T extends string> = {
	id: T;
	label: string;
	icon: Icon;
	iconClass: string;
};

export const FRAMEWORK_OPTIONS: TechnologyOption<Framework>[] = [
	{ id: "react", label: "React", icon: IconBrandReact, iconClass: "text-[#61dafb]" },
	{ id: "svelte", label: "Svelte", icon: IconBrandSvelte, iconClass: "text-[#ff3e00]" },
];

export const DIALECT_OPTIONS: TechnologyOption<Dialect>[] = [
	{ id: "ts", label: "TS", icon: IconBrandTypescript, iconClass: "text-[#3178c6]" },
	{ id: "js", label: "JS", icon: IconBrandJavascript, iconClass: "text-[#f7df1e]" },
];
