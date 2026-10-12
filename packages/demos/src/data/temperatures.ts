const MONTHS = ["January", "March", "May", "July", "September", "November"];
const MEANS = [3, 10, 19, 26, 20, 8];

// A fixed seed keeps server and client renders identical.
function seeded(seed: number) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

/** Daily highs per month for the ridgeline demo, in °C, with a second year to morph to. */
export function dailyHighs(seed: number, warm = 0) {
	const random = seeded(seed);
	return MONTHS.map((label, index) => ({
		id: label.toLowerCase(),
		label,
		values: Array.from({ length: 30 }, () => {
			const spread = (random() + random() + random() - 1.5) * 7;
			return Math.round(((MEANS[index] ?? 15) + warm + spread) * 10) / 10;
		}),
	}));
}
