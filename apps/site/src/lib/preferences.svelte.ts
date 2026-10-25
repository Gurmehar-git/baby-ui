import type { Framework } from "@baby-ui/registry-schema";
import { mode } from "mode-watcher";
import { track } from "./analytics";
import { persisted } from "./persisted-state.svelte";

export type Dialect = "ts" | "js";
export type PackageManager = "bun" | "npm" | "pnpm" | "yarn";
/** Page composition only; visual styling and content stay shared across every mode. */
export type PageLayout = "playground" | "library";

/** `ink` replaces the ring colour where the fill is too light to read as one. */
type Ramp = { primary: string; fg: string; ink?: string };

/** Each rewrites the brand ramp; neutrals never move. */
export const THEMES = [
	{ id: "default", name: "Blue", swatch: "oklch(55% 0.18 255)" },
	{
		id: "mono",
		name: "Mono",
		swatch: "oklch(40% 0 0)",
		light: { primary: "oklch(15% 0 0)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(96% 0 0)", fg: "#151515" },
	},
	{
		id: "violet",
		name: "Violet",
		swatch: "oklch(55% 0.2 290)",
		light: { primary: "oklch(55% 0.2 290)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(72% 0.16 290)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "green",
		name: "Green",
		swatch: "oklch(53% 0.14 150)",
		light: { primary: "oklch(53% 0.14 150)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(72% 0.15 150)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "amber",
		name: "Amber",
		swatch: "oklch(74% 0.15 70)",
		light: {
			primary: "oklch(74% 0.15 70)",
			fg: "oklch(20% 0.02 70)",
			ink: "oklch(55% 0.118 70)",
		},
		dark: { primary: "oklch(80% 0.15 75)", fg: "oklch(18% 0.02 75)" },
	},
	{
		id: "blood-orange",
		name: "Blood Orange",
		swatch: "oklch(56% 0.174 40)",
		light: { primary: "oklch(56% 0.174 40)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(72% 0.17 42)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "rose",
		name: "Rose",
		swatch: "oklch(57% 0.2 12)",
		light: { primary: "oklch(57% 0.2 12)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(70% 0.17 12)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "red",
		name: "Red",
		swatch: "oklch(55% 0.22 25)",
		light: { primary: "oklch(55% 0.22 25)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(68% 0.19 25)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "teal",
		name: "Teal",
		swatch: "oklch(53% 0.092 185)",
		light: { primary: "oklch(53% 0.092 185)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(72% 0.13 185)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "indigo",
		name: "Indigo",
		swatch: "oklch(50% 0.2 275)",
		light: { primary: "oklch(50% 0.2 275)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(70% 0.16 275)", fg: "oklch(15% 0 0)" },
	},
	{
		id: "cyan",
		name: "Cyan",
		swatch: "oklch(62% 0.13 215)",
		light: { primary: "oklch(52% 0.13 215)", fg: "oklch(99% 0 0)" },
		dark: { primary: "oklch(75% 0.12 215)", fg: "oklch(15% 0 0)" },
	},
] as const satisfies readonly {
	id: string;
	name: string;
	swatch: string;
	light?: Ramp;
	dark?: Ramp;
}[];

export type ThemeId = (typeof THEMES)[number]["id"];

const KEY = "baby-ui:preferences";
const THEME_KEY = "baby-ui:theme";

type Settable = {
	framework: Framework;
	dialect: Dialect;
	pm: PackageManager;
	layout: PageLayout;
};

type Stored = Omit<Settable, "layout"> & {
	layout: PageLayout | "standard" | "stacked" | "split";
};

const DEFAULT_STORED: Stored = {
	framework: "svelte",
	dialect: "ts",
	pm: "bun",
	layout: "library",
};

class Preferences {
	#stored = persisted<Stored>(KEY, DEFAULT_STORED);
	#theme = persisted<ThemeId>(THEME_KEY, "default");
	open = $state(false);

	constructor() {
		if (
			this.#stored.current.layout !== "playground" &&
			this.#stored.current.layout !== "library"
		) {
			this.#stored.current = { ...this.#stored.current, layout: "library" };
		}
		if (!THEMES.some((theme) => theme.id === this.#theme.current)) {
			this.#theme.current = "default";
		}
	}

	get framework() {
		return this.#stored.current.framework;
	}
	get dialect() {
		return this.#stored.current.dialect;
	}
	get pm() {
		return this.#stored.current.pm;
	}
	get layout(): PageLayout {
		return this.#stored.current.layout === "playground" ? "playground" : "library";
	}
	get theme() {
		return this.#theme.current;
	}

	/** Applies the brand ramp for the current mode-watcher mode and `theme`.
	 * Call from an `$effect` in the root layout so it reruns on any change. */
	apply() {
		const root = document.documentElement;
		const dark = mode.current !== "light";

		const entry = THEMES.find((t) => t.id === this.theme) ?? THEMES[0];
		const ramp = "light" in entry ? (dark ? entry.dark : entry.light) : undefined;
		// The ring follows the fill unless a light fill needs a darker ink to clear 3:1.
		// --accent stays shadcn's neutral hover surface, so a brand theme never touches it.
		const ink = (ramp as Ramp | undefined)?.ink ?? ramp?.primary;
		for (const [name, value] of [
			["--primary", ramp?.primary],
			["--primary-foreground", ramp?.fg],
			["--ring", ink],
		] as const) {
			if (value) root.style.setProperty(name, value);
			else root.style.removeProperty(name);
		}
	}

	set<K extends keyof Settable | "theme">(
		key: K,
		value: K extends keyof Settable ? Settable[K] : ThemeId,
	) {
		track("preference_changed", { key, value });
		if (key === "theme") {
			this.#theme.current = value as ThemeId;
		} else {
			this.#stored.current = { ...this.#stored.current, [key]: value } as Stored;
		}
	}
}

export const prefs = new Preferences();
