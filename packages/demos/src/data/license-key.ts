import type { LicenseRegistry } from "../../../../components/license-key/license-core";

export const LICENSE_REGISTRY: LicenseRegistry = {
	react: "https://registry.acme.dev/r/react/{name}.json",
	svelte: "https://registry.acme.dev/r/svelte/{name}.json",
};

export const LICENSE_REGISTRY_NAME = "@acme";
export const LICENSE_ENV = "ACME_REGISTRY_TOKEN";

export const LICENSE_SAMPLE = {
	licenseKey: "acme_live_7Qm2xK9pVn4rT8wLc3Hf",
	plan: "Pro Lifetime",
	seats: { used: 3, total: 5 },
	createdAt: "2026-03-14T09:30:00Z",
	lastUsedAt: "2026-09-25T16:05:00Z",
	exampleItem: "magic-link-login",
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

/** A fresh-looking key for the demo's fake rotation. Real keys come from your backend. */
export function demoKey(): string {
	let body = "";
	for (let i = 0; i < 20; i++)
		body += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
	return `acme_live_${body}`;
}

export const ROTATE_DELAY_MS = 1400;
