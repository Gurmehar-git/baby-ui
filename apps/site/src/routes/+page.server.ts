import { cardItems, freshness, latestNew, liveSpecs } from "#lib/server/registry.js";
import type { PageServerLoad } from "./$types";

/** The showcase grid: one live panel per area, none repeating the hero. */
const GRID = [
	"area-chart",
	"text-loop",
	"task-steps",
	"webgl-liquid",
	"circuit-board",
	"week-calendar",
];

export const load: PageServerLoad = () => ({
	grid: cardItems(GRID),
	// Six fills the row at two and three columns.
	fresh: latestNew(6, GRID),
	freshCount: liveSpecs.filter((s) => freshness(s) === "new").length,
});
