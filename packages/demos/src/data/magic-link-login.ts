/** Demo OAuth providers; each port pairs them with its own icon. */
export const MAGIC_LINK_PROVIDERS = [
	{ id: "github", label: "GitHub" },
	{ id: "google", label: "Google" },
] as const;

export const MAGIC_LINK_EMAIL = "maya@gmail.com";

/** Resend cooldown the demo backend enforces after each send. */
export const RESEND_COOLDOWN_MS = 30_000;

/** How long the demo pretends the email takes to send. */
export const SEND_DELAY_MS = 1200;
