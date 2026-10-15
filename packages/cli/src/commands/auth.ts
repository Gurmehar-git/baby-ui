import { clearToken, credential, maskToken, saveToken } from "../auth.ts";
import { CliError } from "../errors.ts";
import { c } from "../logger.ts";
import { intro, isInteractive, message, outro, text } from "../ui/index.ts";

const ACCOUNT_URL = "https://baby-ui.nexonauts.com/account";

/** Stores a licence key; device sign-in arrives with the Pro backend. */
export async function login(options: { token?: string }): Promise<void> {
	intro("baby-ui login");
	let token = options.token?.trim();
	if (!token) {
		if (!isInteractive()) {
			throw new CliError("No licence key given.", {
				hint: "Pass --token <key> or set BABY_UI_TOKEN.",
			});
		}
		message(`Copy your licence key from ${c.brand(ACCOUNT_URL)}`);
		token = (
			await text({
				message: "Licence key",
				placeholder: "bui_…",
				mask: true,
				validate: (v) => (v.trim().length < 8 ? "That key looks too short." : undefined),
			})
		).trim();
	}
	const file = await saveToken(token);
	message(`Saved ${maskToken(token)} to ${c.dim(file)}`);
	if (process.env.BABY_UI_TOKEN)
		message(c.yellow("BABY_UI_TOKEN is set and takes precedence."));
	outro(`Pro items install with ${c.brand("baby-ui add @baby-ui-pro/<name>")}`);
}

export async function logout(): Promise<void> {
	intro("baby-ui logout");
	message((await clearToken()) ? "Licence key removed." : c.dim("No saved licence key."));
	if (process.env.BABY_UI_TOKEN)
		message(c.yellow("BABY_UI_TOKEN is still set in this shell."));
	outro("Done");
}

export async function whoami(): Promise<void> {
	const cred = await credential();
	intro("baby-ui whoami");
	message(
		cred
			? `Licence key ${maskToken(cred.token)} ${c.dim(cred.source === "env" ? "(BABY_UI_TOKEN)" : "(saved)")}`
			: c.dim("Not logged in. Free components need no account."),
	);
	outro("Done");
}
