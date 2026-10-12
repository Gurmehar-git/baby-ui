import { THEMES, type ThemeId } from "#lib/preferences.svelte.js";

export const RADII = [0, 0.375, 0.5, 0.625, 0.75, 1] as const;
export type Radius = (typeof RADII)[number];

export const FONTS = {
	inter: {
		label: "Inter",
		stack: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
	},
	satoshi: {
		label: "Satoshi",
		stack: '"Satoshi", "Inter Variable", ui-sans-serif, system-ui, sans-serif',
	},
	system: { label: "System", stack: "ui-sans-serif, system-ui, sans-serif" },
} as const;
export type FontId = keyof typeof FONTS;

export type ThemeChoice = { accent: ThemeId; radius: Radius; font: FontId };

type Ramp = { primary: string; fg: string; ink?: string };

// The default theme carries no ramp of its own: these are tokens.css's Blue values.
const BLUE = {
	light: { primary: "oklch(55% 0.18 255)", fg: "oklch(99% 0 0)" },
	dark: { primary: "oklch(70% 0.15 255)", fg: "#151515" },
};

function ramp(accent: ThemeId, dark: boolean): Ramp {
	const entry = THEMES.find((t) => t.id === accent);
	const pair = entry && "light" in entry ? entry : BLUE;
	return dark ? pair.dark : pair.light;
}

/** CSS variables for a scoped preview. Radius steps are restated, since they resolve where declared. */
export function previewVars(choice: ThemeChoice, dark: boolean): Record<string, string> {
	const r = ramp(choice.accent, dark);
	const radius = `${choice.radius}rem`;
	return {
		"--primary": r.primary,
		"--primary-foreground": r.fg,
		"--ring": r.ink ?? r.primary,
		"--radius": radius,
		"--radius-sm": `max(0px, calc(${radius} - 4px))`,
		"--radius-md": `max(0px, calc(${radius} - 2px))`,
		"--radius-lg": radius,
		"--radius-xl": `calc(${radius} + 4px)`,
		"--radius-2xl": `calc(${radius} + 6px)`,
		"--radius-3xl": `calc(${radius} + 10px)`,
		"--font-body": FONTS[choice.font].stack,
	};
}

/** The theme as CSS to paste over the tokens: radius, font, and the brand ramp per mode. */
export function themeCss(choice: ThemeChoice): string {
	const block = (dark: boolean) => {
		const r = ramp(choice.accent, dark);
		return [
			`  --primary: ${r.primary};`,
			`  --primary-foreground: ${r.fg};`,
			`  --ring: ${r.ink ?? r.primary};`,
		];
	};
	return [
		":root {",
		`  --radius: ${choice.radius}rem;`,
		`  --font-body: ${FONTS[choice.font].stack};`,
		...block(false),
		"}",
		"",
		".dark {",
		...block(true),
		"}",
	].join("\n");
}
