export type PhoneCountry = {
	/** ISO 3166-1 alpha-2 code, such as "US". */
	iso: string;
	name: string;
	/** Calling code without the plus, such as "44". */
	dial: string;
	/** National formats from shortest to longest; `#` is a digit, anything else a separator. */
	patterns: string[];
	/** A prefix people may type before the national number, such as "0" in the UK. */
	trunk: string;
	/** A realistic national number, used for the placeholder. */
	example: string;
	/** Area codes that pick this country when several share a calling code. */
	areaCodes?: string[];
};

export type PhoneStatus = "empty" | "incomplete" | "valid" | "too-long";

const country = (
	iso: string,
	name: string,
	dial: string,
	patterns: string | string[],
	example: string,
	trunk = "0",
	areaCodes?: string[],
): PhoneCountry => ({
	iso,
	name,
	dial,
	patterns: Array.isArray(patterns) ? patterns : [patterns],
	example,
	trunk,
	areaCodes,
});

const CA_AREA_CODES =
	"204 226 236 249 250 263 289 306 343 354 365 367 368 382 387 403 416 418 428 431 437 438 450 468 474 506 514 519 548 579 581 584 587 604 613 639 647 672 683 705 709 742 753 778 780 782 807 819 825 867 873 879 902 905".split(
		" ",
	);

/** The country used when nothing else matches. */
export const FALLBACK_COUNTRY = country(
	"US",
	"United States",
	"1",
	"(###) ###-####",
	"2015550123",
	"1",
);

/** A compact table: formats national significant numbers, no metadata download, no dependency. */
export const PHONE_COUNTRIES: PhoneCountry[] = [
	FALLBACK_COUNTRY,
	country("CA", "Canada", "1", "(###) ###-####", "5065550123", "1", CA_AREA_CODES),
	country("MX", "Mexico", "52", "## #### ####", "2221234567", ""),
	country("BR", "Brazil", "55", ["(##) ####-####", "(##) #####-####"], "11961234567"),
	country("AR", "Argentina", "54", "## ####-####", "1123456789"),
	country("CO", "Colombia", "57", "### ### ####", "3211234567", ""),
	country("CL", "Chile", "56", "# #### ####", "221234567", ""),
	country("PE", "Peru", "51", "### ### ###", "912345678"),
	country("GB", "United Kingdom", "44", "#### ######", "7400123456"),
	country("IE", "Ireland", "353", "## ### ####", "850123456"),
	country("FR", "France", "33", "# ## ## ## ##", "612345678"),
	country("DE", "Germany", "49", ["### #######", "### ########"], "15123456789"),
	country("ES", "Spain", "34", "### ## ## ##", "612345678", ""),
	country("IT", "Italy", "39", ["### ### ###", "### ### ####"], "3123456789", ""),
	country("PT", "Portugal", "351", "### ### ###", "912345678", ""),
	country("NL", "Netherlands", "31", "# ########", "612345678"),
	country("BE", "Belgium", "32", "### ## ## ##", "470123456"),
	country("CH", "Switzerland", "41", "## ### ## ##", "781234567"),
	country("AT", "Austria", "43", ["### #######", "### ########"], "6641234567"),
	country("SE", "Sweden", "46", "## ### ## ##", "701234567"),
	country("NO", "Norway", "47", "### ## ###", "40612345", ""),
	country("DK", "Denmark", "45", "## ## ## ##", "32123456", ""),
	country("FI", "Finland", "358", ["## ### ####", "## ### #####"], "412345678"),
	country("PL", "Poland", "48", "### ### ###", "512345678", ""),
	country("CZ", "Czechia", "420", "### ### ###", "601123456", ""),
	country("GR", "Greece", "30", "### ### ####", "6912345678", ""),
	country("UA", "Ukraine", "380", "## ### ## ##", "501234567"),
	country("TR", "Turkey", "90", "### ### ## ##", "5012345678"),
	country("IL", "Israel", "972", "##-###-####", "502345678"),
	country("AE", "United Arab Emirates", "971", "## ### ####", "501234567"),
	country("SA", "Saudi Arabia", "966", "## ### ####", "512345678"),
	country("EG", "Egypt", "20", "### ### ####", "1001234567"),
	country("NG", "Nigeria", "234", "### ### ####", "8021234567"),
	country("KE", "Kenya", "254", "### ######", "712123456"),
	country("ZA", "South Africa", "27", "## ### ####", "711234567"),
	country("IN", "India", "91", "#####-#####", "8123456789"),
	country("PK", "Pakistan", "92", "### #######", "3012345678"),
	country("CN", "China", "86", "### #### ####", "13123456789"),
	country("JP", "Japan", "81", "##-####-####", "9012345678"),
	country("KR", "South Korea", "82", ["##-###-####", "##-####-####"], "1020000000"),
	country("TW", "Taiwan", "886", "### ### ###", "912345678"),
	country("HK", "Hong Kong", "852", "#### ####", "51234567", ""),
	country("SG", "Singapore", "65", "#### ####", "81234567", ""),
	country("PH", "Philippines", "63", "### ### ####", "9051234567"),
	country(
		"ID",
		"Indonesia",
		"62",
		["###-###-####", "###-####-####", "###-####-#####"],
		"81234567890",
	),
	country("TH", "Thailand", "66", "## ### ####", "812345678"),
	country("VN", "Vietnam", "84", "## ### ## ##", "912345678"),
	country("AU", "Australia", "61", "### ### ###", "412345678"),
	country(
		"NZ",
		"New Zealand",
		"64",
		["# ### ####", "## ### ####", "## #### ####"],
		"211234567",
	),
];

const BY_ISO = new Map(PHONE_COUNTRIES.map((entry) => [entry.iso, entry]));
export const findCountry = (iso: string | undefined) =>
	iso ? BY_ISO.get(iso.toUpperCase()) : undefined;
const capacity = (pattern: string) => pattern.split("#").length - 1;
const lengthsOf = (entry: PhoneCountry) => entry.patterns.map(capacity);
export const onlyDigits = (text: string) => text.replace(/\D/g, "");

/** Regional indicator letters; platforms without flag glyphs show the two letters. */
export const flagOf = (iso: string) =>
	String.fromCodePoint(
		...[...iso.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65),
	);

function splitTrunk(entry: PhoneCountry, digits: string): [string, string] {
	return entry.trunk && digits.startsWith(entry.trunk)
		? [entry.trunk, digits.slice(entry.trunk.length)]
		: ["", digits];
}

/** A typed trunk prefix earns its own room; otherwise the longest valid length is the cap. */
export const capDigits = (entry: PhoneCountry, digits: string) =>
	digits.slice(0, splitTrunk(entry, digits)[0].length + Math.max(...lengthsOf(entry)));

/** Separators only print while digits follow, so a half-typed number never ends in ") ". */
function applyPattern(digits: string, pattern: string) {
	let out = "";
	let index = 0;
	for (const char of pattern) {
		if (index >= digits.length) break;
		out += char === "#" ? digits[index++] : char;
	}
	return out + digits.slice(index);
}

const patternFor = (entry: PhoneCountry, length: number) =>
	entry.patterns.find((pattern) => capacity(pattern) >= length) ??
	entry.patterns.at(-1) ??
	"";

/** Formats national digits as typed, keeping a typed trunk prefix. */
export function formatNational(entry: PhoneCountry, digits: string) {
	const [trunk, rest] = splitTrunk(entry, digits);
	const pattern = patternFor(entry, rest.length);
	const body = applyPattern(rest, pattern);
	if (!trunk) return body;
	if (!rest) return trunk;
	return trunk + (pattern.startsWith("#") ? "" : " ") + body;
}

export function phoneStatus(entry: PhoneCountry, digits: string): PhoneStatus {
	const length = splitTrunk(entry, digits)[1].length;
	const lengths = lengthsOf(entry);
	if (!length) return "empty";
	if (lengths.includes(length)) return "valid";
	return length > Math.max(...lengths) ? "too-long" : "incomplete";
}

export const toE164 = (entry: PhoneCountry, digits: string) => {
	const rest = splitTrunk(entry, digits)[1];
	return rest ? `+${entry.dial}${rest}` : "";
};

/** Reads "+44 (0)7911 123456", "0044 7911..." or "+14165550123"; the longest calling code wins. */
export function parsePhoneNumber(
	input: string,
	pool: PhoneCountry[] = PHONE_COUNTRIES,
): { country: PhoneCountry; national: string } | null {
	const trimmed = input.trim();
	let digits = onlyDigits(trimmed);
	if (!trimmed.startsWith("+")) {
		if (!trimmed.startsWith("00")) return null;
		digits = digits.slice(2);
	}
	for (const size of [3, 2, 1]) {
		const dial = digits.slice(0, size);
		const matches = pool.filter((entry) => entry.dial === dial);
		const fallback = matches[0];
		if (!fallback) continue;
		let rest = digits.slice(size);
		const entry =
			matches.find((item) => item.areaCodes?.some((code) => rest.startsWith(code))) ??
			matches.find((item) => !item.areaCodes) ??
			fallback;
		// A pasted "(0)" trunk is dropped when the rest is still a full number without it.
		if (
			entry.trunk &&
			rest.startsWith(entry.trunk) &&
			rest.length - entry.trunk.length >= Math.min(...lengthsOf(entry))
		)
			rest = rest.slice(entry.trunk.length);
		return { country: entry, national: capDigits(entry, rest) };
	}
	return null;
}

/** Formats an E.164 number for display, such as "+44 7400 123456". */
export function formatPhoneNumber(e164: string) {
	const parsed = parsePhoneNumber(e164);
	return parsed
		? `+${parsed.country.dial} ${formatNational(parsed.country, parsed.national)}`
		: e164;
}

/** Position in `text` just after its `count`th digit, for keeping the caret through reformatting. */
export function caretAfterDigits(text: string, count: number) {
	if (count <= 0) {
		const first = text.search(/\d/);
		return first < 0 ? text.length : first;
	}
	let seen = 0;
	for (let index = 0; index < text.length; index++)
		if (/\d/.test(text[index] ?? "") && ++seen === count) return index + 1;
	return text.length;
}
