export const colorEnabled =
	process.env.FORCE_COLOR === "1" ||
	(process.stdout.isTTY === true && process.env.NO_COLOR === undefined);

const ansi = (code: string, s: string) => (colorEnabled ? `\x1b[${code}m${s}\x1b[0m` : s);

// Dark-theme --primary (oklch 70% 0.15 255) on truecolor terminals; plain blue otherwise.
const truecolor = /truecolor|24bit/i.test(process.env.COLORTERM ?? "");

export const c = {
	brand: (s: string) => ansi(truecolor ? "38;2;96;160;245" : "34", s),
	red: (s: string) => ansi("31", s),
	green: (s: string) => ansi("32", s),
	yellow: (s: string) => ansi("33", s),
	white: (s: string) => ansi("37", s),
	gray: (s: string) => ansi("90", s),
	bold: (s: string) => ansi("1", s),
	dim: (s: string) => ansi("2", s),
	inverse: (s: string) => ansi("7", s),
};

export const symbols = { tick: "✓", cross: "✗", diamond: "◆", arrow: "→", dot: "·" };

export const log = {
	info: (msg: string) => console.log(`${c.brand(symbols.diamond)} ${msg}`),
	success: (msg: string) => console.log(`${c.green(symbols.tick)} ${msg}`),
	warn: (msg: string) => console.warn(`${c.yellow("!")} ${msg}`),
	error: (msg: string) => console.error(`${c.red(symbols.cross)} ${msg}`),
	plain: (msg: string) => console.log(msg),
};
