import type { OgProductShopStar } from "./variants";

/** Five star states for a 0 to 5 rating, rounded to the nearest half. */
export function ogProductStars(rating: number): OgProductShopStar[] {
	const r = Math.round(Math.min(5, Math.max(0, rating)) * 2) / 2;
	return [0, 1, 2, 3, 4].map((i) =>
		r >= i + 1 ? "full" : r >= i + 0.5 ? "half" : "empty",
	);
}
