export type LicenseKeyStatus = "idle" | "confirming" | "rotating" | "error";

export type LicenseSeats = { used: number; total: number };

/** Registry item URL per framework, with `{name}` where the item name goes. */
export type LicenseRegistry = { react?: string; svelte?: string };

export type LicenseFramework = keyof LicenseRegistry;

export type LicenseKeyLabels = {
	title: string;
	description: string;
	reveal: string;
	hide: string;
	copy: string;
	copied: string;
	copySnippet: string;
	rotate: string;
	confirmTitle: string;
	/** `{env}` is replaced with the env variable name. */
	confirmBody: string;
	cancel: string;
	confirmRotate: string;
	rotating: string;
	rotated: string;
	plan: string;
	seats: string;
	seatsOf: string;
	created: string;
	lastUsed: string;
	neverUsed: string;
	setup: string;
	setupHint: string;
	envHint: string;
	installHint: string;
	react: string;
	svelte: string;
};

export const LICENSE_KEY_LABELS: LicenseKeyLabels = {
	title: "License key",
	description:
		"Authenticates the Pro registry for the shadcn CLI. Treat it like a password.",
	reveal: "Reveal key",
	hide: "Hide key",
	copy: "Copy key",
	copied: "Copied",
	copySnippet: "Copy snippet",
	rotate: "Regenerate",
	confirmTitle: "Regenerate this key?",
	confirmBody:
		"The current key stops working immediately. Update {env} wherever it's set.",
	cancel: "Cancel",
	confirmRotate: "Regenerate key",
	rotating: "Regenerating",
	rotated: "New key issued.",
	plan: "Plan",
	seats: "Seats",
	seatsOf: "of",
	created: "Created",
	lastUsed: "Last used",
	neverUsed: "Never used",
	setup: "Setup",
	setupHint: "Add the registry to components.json",
	envHint: "Put the key in .env, next to components.json",
	installHint: "Install your first component",
	react: "shadcn",
	svelte: "shadcn-svelte",
};

/** Keeps the prefix through its last "_" and the last 4 characters: bui_live_••••••••3f9a. */
export function maskKey(key: string): string {
	const cut = key.lastIndexOf("_") + 1;
	const head = key.slice(0, cut);
	const body = key.slice(cut);
	if (body.length <= 4) return head + "•".repeat(body.length);
	return `${head}${"•".repeat(Math.min(body.length - 4, 12))}${body.slice(-4)}`;
}

/** `bui_live_` and the rest in fours, so a long key reads in chunks. */
export function keyGroups(display: string): { prefix: string; groups: string[] } {
	const cut = display.lastIndexOf("_") + 1;
	const body = display.slice(cut);
	const groups: string[] = [];
	for (let i = 0; i < body.length; i += 4) groups.push(body.slice(i, i + 4));
	return { prefix: display.slice(0, cut), groups };
}

/** The `registries` entry for components.json. `${env}` stays literal: the CLI expands it. */
export function registrySnippet(
	registryName: string,
	url: string,
	envName: string,
): string {
	return JSON.stringify(
		{
			registries: {
				[registryName]: { url, headers: { Authorization: `Bearer \${${envName}}` } },
			},
		},
		null,
		2,
	);
}

export function envLine(envName: string, key: string): string {
	return `${envName}=${key}`;
}

export function installCommand(
	framework: LicenseFramework,
	registryName: string,
	item: string,
): string {
	const cli = framework === "react" ? "shadcn@latest" : "shadcn-svelte@latest";
	return `npx ${cli} add ${registryName}/${item}`;
}

/** Medium date in the viewer's locale; null reads as `fallback`. */
export function formatDate(
	value: string | number | Date | null | undefined,
	fallback = "",
): string {
	if (value === null || value === undefined) return fallback;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return fallback;
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function fillEnv(template: string, envName: string): string {
	return template.replaceAll("{env}", envName);
}
