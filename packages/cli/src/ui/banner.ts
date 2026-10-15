import { c } from "../logger.ts";
import { isInteractive } from "./core.ts";

const WORDMARK = [
	" _           _                       _ ",
	"| |__   __ _| |__  _   _       _   _(_)",
	"| '_ \\ / _` | '_ \\| | | |_____| | | | |",
	"| |_) | (_| | |_) | |_| |_____| |_| | |",
	"|_.__/ \\__,_|_.__/ \\__, |      \\__,_|_|",
	"                   |___/               ",
];

/** The `init` banner; skipped on non-interactive streams so piped output stays clean. */
export function printBanner(version: string): void {
	if (!isInteractive()) return;
	const out = process.stdout;
	out.write("\n");
	for (const line of WORDMARK) out.write(`   ${c.brand(line)}\n`);
	out.write(`\n   ${c.dim("Components for React and Svelte, shadcn compatible")}\n`);
	out.write(`   ${c.gray(`v${version} · Apache-2.0 · baby-ui.nexonauts.com`)}\n`);
}
