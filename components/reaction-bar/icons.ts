import type { ReactionIcon } from "./variants";

/** Stroke paths on a 24px grid; `fill` paths fill with the tone while pressed. */
export const REACTION_PATHS: Record<ReactionIcon, { d: string; fill?: boolean }[]> = {
	like: [
		{
			d: "M19.46 4c-2.68-1.65-5.02-.99-6.43.07-.57.43-.86.65-1.03.65s-.46-.22-1.03-.65C9.56 3.01 7.22 2.35 4.54 4 1.02 6.15.22 13.27 8.34 19.28 9.89 20.43 10.66 21 12 21s2.11-.57 3.66-1.72C23.78 13.27 22.98 6.15 19.46 4Z",
			fill: true,
		},
	],
	comment: [
		{
			d: "M12 21.5c5.52 0 10-4.25 10-9.5S17.52 2.5 12 2.5 2 6.75 2 12c0 1.36.3 2.65.84 3.82.15.31.2.66.1 1l-.6 2.23a1.08 1.08 0 0 0 1.6 1.59l2.22-.6c.34-.09.69-.04 1 .1 1.17.55 2.46.86 4.84.86Z",
			fill: true,
		},
	],
	repost: [
		{ d: "M16.5 3.5 19 6l-2.5 2.5" },
		{ d: "M19 6H8a4 4 0 0 0-4 4v1" },
		{ d: "M7.5 20.5 5 18l2.5-2.5" },
		{ d: "M5 18h11a4 4 0 0 0 4-4v-1" },
	],
	share: [
		{ d: "M21 3 10.5 13.5" },
		{ d: "M21 3 14.6 20.6a.5.5 0 0 1-.93.05L10.5 13.5 3.35 10.33a.5.5 0 0 1 .05-.93Z" },
	],
};

/** Social-style short counts: 1.2K, 34K, 2.1M. */
export const compactCount = (value: number, locale?: string) =>
	new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
		value,
	);
