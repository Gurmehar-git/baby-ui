import { cardItems, freshness, liveSpecs } from "#lib/server/registry.js";
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

/** Picks for the "Just landed" row; any that lose their new flag drop out. */
const NEW_PICKS = [
	"swappable",
	"color-picker",
	"aurora-flow",
	"empty",
	"wheel-picker",
	"flowchart",
];

export const load: PageServerLoad = () => ({
	grid: cardItems(GRID),
	fresh: cardItems(NEW_PICKS).filter((item) => item.isNew),
	freshCount: liveSpecs.filter((s) => freshness(s) === "new").length,
});
