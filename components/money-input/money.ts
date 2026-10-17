export type CurrencyInfo = {
	code: string;
	symbol: string;
	/** Minor-unit digits: 2 for USD, 0 for JPY. */
	digits: number;
	decimal: string;
	group: string;
};

/** Symbol, minor-unit digits and separators for `code` in `locale`, from Intl. */
export function currencyInfo(code: string, locale: string): CurrencyInfo {
	const format = new Intl.NumberFormat(locale, { style: "currency", currency: code });
	const parts = format.formatToParts(12345.6);
	return {
		code,
		symbol: parts.find((part) => part.type === "currency")?.value ?? code,
		digits: format.resolvedOptions().maximumFractionDigits ?? 2,
		decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
		group: parts.find((part) => part.type === "group")?.value ?? ",",
	};
}

/** The typed text kept to digits and one decimal point, with at most `digits` decimals. */
export function cleanAmount(text: string, info: CurrencyInfo): string {
	const normalised = text.split(info.group).join("").replace(info.decimal, ".");
	let out = "";
	let seenPoint = false;
	let decimals = 0;
	for (const char of normalised) {
		if (char >= "0" && char <= "9") {
			if (seenPoint) {
				if (decimals >= info.digits) continue;
				decimals++;
			}
			out += char;
		} else if (char === "." && !seenPoint && info.digits > 0) {
			seenPoint = true;
			out += ".";
		}
	}
	return out.replace(/^0+(?=\d)/, "");
}

/** Grouped display of a clean amount, keeping a trailing point or partial decimals as typed. */
export function groupAmount(clean: string, info: CurrencyInfo): string {
	if (!clean) return "";
	const [whole = "", fraction] = clean.split(".");
	const grouped = (whole || "0").replace(/\B(?=(\d{3})+(?!\d))/g, info.group);
	return fraction === undefined ? grouped : `${grouped}${info.decimal}${fraction}`;
}

export const toMinor = (clean: string, info: CurrencyInfo): number | null => {
	if (!clean || clean === ".") return null;
	return Math.round(Number(clean) * 10 ** info.digits);
};

/** A minor-unit amount as clean text with all its decimals, e.g. 125000 to "1250.00". */
export const fromMinor = (minor: number | null, info: CurrencyInfo): string =>
	minor === null ? "" : (minor / 10 ** info.digits).toFixed(info.digits);

/** Position in `text` just after its `count`th digit or point, for keeping the caret through grouping. */
export function caretAfter(text: string, count: number, info: CurrencyInfo) {
	let seen = 0;
	if (count <= 0) return 0;
	for (let index = 0; index < text.length; index++) {
		const char = text[index] ?? "";
		if ((char >= "0" && char <= "9") || char === info.decimal) seen++;
		if (seen === count) return index + 1;
	}
	return text.length;
}

/** How many digits and points precede `at` in `text`. */
export function significantBefore(text: string, at: number, info: CurrencyInfo) {
	let count = 0;
	for (const char of text.slice(0, at))
		if ((char >= "0" && char <= "9") || char === info.decimal) count++;
	return count;
}

/** A money amount for display, e.g. 125000 USD to "$1,250.00". */
export const formatMoney = (minor: number, code: string, locale = "en-US") =>
	new Intl.NumberFormat(locale, { style: "currency", currency: code }).format(
		minor / 10 ** currencyInfo(code, locale).digits,
	);
