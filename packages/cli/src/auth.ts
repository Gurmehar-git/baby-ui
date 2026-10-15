import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { z } from "zod";

export function authFile(): string {
	if (process.env.BABY_UI_CONFIG_DIR)
		return join(process.env.BABY_UI_CONFIG_DIR, "auth.json");
	if (process.platform === "win32") {
		return join(
			process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"),
			"baby-ui",
			"auth.json",
		);
	}
	return join(
		process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"),
		"baby-ui",
		"auth.json",
	);
}

const AuthSchema = z.object({ token: z.string().min(1), savedAt: z.string() });

export interface Credential {
	readonly token: string;
	readonly source: "env" | "file";
}

/** `BABY_UI_TOKEN` wins (CI), then the saved licence key. */
export async function credential(): Promise<Credential | undefined> {
	const env = process.env.BABY_UI_TOKEN;
	if (env) return { token: env, source: "env" };
	try {
		const parsed = AuthSchema.safeParse(JSON.parse(await readFile(authFile(), "utf8")));
		if (parsed.success) return { token: parsed.data.token, source: "file" };
	} catch {}
	return undefined;
}

// 0600 on POSIX; on Windows the file lives in the per-user roaming profile.
export async function saveToken(token: string): Promise<string> {
	const file = authFile();
	await mkdir(dirname(file), { recursive: true });
	await writeFile(
		file,
		`${JSON.stringify({ token, savedAt: new Date().toISOString() })}\n`,
		{
			mode: 0o600,
		},
	);
	if (process.platform !== "win32") await chmod(file, 0o600);
	return file;
}

export async function clearToken(): Promise<boolean> {
	try {
		await rm(authFile());
		return true;
	} catch {
		return false;
	}
}

export const maskToken = (token: string) =>
	token.length <= 8 ? "****" : `${token.slice(0, 4)}…${token.slice(-4)}`;
