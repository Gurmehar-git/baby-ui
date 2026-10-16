import {
	type GeoPermissibleObjects,
	type GeoProjection,
	geoEqualEarth,
	geoGraticule10,
	geoMercator,
	geoNaturalEarth1,
	geoPath,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { ChoroplethProjection } from "./variants";

export type GeoFeature = Feature<Geometry, Record<string, unknown> | null>;
export type GeoCollection = FeatureCollection<Geometry, Record<string, unknown> | null>;

export interface ZoomState {
	k: number;
	x: number;
	y: number;
}

export const IDENTITY_ZOOM: ZoomState = { k: 1, x: 0, y: 0 };
export const SCALE_STEPS = 5;
/** Default wheel step: 5% per notch. */
export const WHEEL_STEP = 1.05;
export const KEY_ZOOM_STEP = 1.25;
export const KEY_PAN_STEP = 40;
/** Hover dim and undim share one ease-out transition instead of snapping back. */
export const DIM_TRANSITION = "opacity 180ms cubic-bezier(0, 0, 0.58, 1)";
export const ZOOM_TRANSITION = "transform 180ms cubic-bezier(0, 0, 0.58, 1)";

const PROJECTIONS: Record<ChoroplethProjection, () => GeoProjection> = {
	mercator: geoMercator,
	equalEarth: geoEqualEarth,
	naturalEarth: geoNaturalEarth1,
};

export interface MapFeature {
	index: number;
	key: string;
	label: string;
	value: number | undefined;
	path: string;
	centroid: [number, number];
	fill: string;
}

export interface MapLayout {
	features: MapFeature[];
	graticule: string;
	thresholds: number[];
	extent: [number, number] | null;
}

export function featureKey(feature: GeoFeature, keyProp: string): string {
	const fromProps = feature.properties?.[keyProp];
	if (typeof fromProps === "string" || typeof fromProps === "number")
		return String(fromProps);
	return feature.id === undefined ? "" : String(feature.id);
}

export function featureLabel(
	feature: GeoFeature,
	labelProp: string,
	key: string,
): string {
	const label = feature.properties?.[labelProp];
	return typeof label === "string" ? label : key;
}

/** Five equal steps over the value extent, as `--chart-scale-1..5` light to dark. */
export function quantize(value: number, extent: [number, number]): number {
	const [min, max] = extent;
	if (max <= min) return SCALE_STEPS - 1;
	const step = Math.floor(((value - min) / (max - min)) * SCALE_STEPS);
	return Math.min(SCALE_STEPS - 1, Math.max(0, step));
}

export const scaleFill = (step: number) => `var(--chart-scale-${step + 1})`;

export function layoutMap(options: {
	data: GeoCollection;
	values: Record<string, number>;
	keyProp: string;
	labelProp: string;
	projection: ChoroplethProjection;
	width: number;
	height: number;
	padding?: number;
}): MapLayout {
	const { data, values, keyProp, labelProp, width, height, padding = 8 } = options;
	const projection = PROJECTIONS[options.projection]().fitExtent(
		[
			[padding, padding],
			[Math.max(padding, width - padding), Math.max(padding, height - padding)],
		],
		data as GeoPermissibleObjects,
	);
	const path = geoPath(projection);
	const known = Object.values(values).filter((v) => Number.isFinite(v));
	const extent: [number, number] | null = known.length
		? [Math.min(...known), Math.max(...known)]
		: null;
	const features = data.features.map((feature, index) => {
		const key = featureKey(feature, keyProp);
		const value = values[key];
		const has = typeof value === "number" && Number.isFinite(value);
		return {
			index,
			key,
			label: featureLabel(feature, labelProp, key),
			value: has ? value : undefined,
			path: path(feature) ?? "",
			centroid: path.centroid(feature) as [number, number],
			fill: has && extent ? scaleFill(quantize(value, extent)) : "var(--muted)",
		};
	});
	const thresholds = extent
		? Array.from(
				{ length: SCALE_STEPS + 1 },
				(_, i) => extent[0] + ((extent[1] - extent[0]) * i) / SCALE_STEPS,
			)
		: [];
	return { features, graticule: path(geoGraticule10()) ?? "", thresholds, extent };
}

/** Features with a value, in reading order, for the keyboard walk and the data table. */
export function walkOrder(features: MapFeature[]): MapFeature[] {
	return features
		.filter((f) => f.value !== undefined && f.path)
		.sort((a, b) => a.label.localeCompare(b.label));
}

export function clampZoom(zoom: ZoomState, min: number, max: number): ZoomState {
	return { ...zoom, k: Math.min(max, Math.max(min, zoom.k)) };
}

/** Scales by `factor` while keeping the plot point `[px, py]` fixed under the pointer. */
export function zoomAt(
	zoom: ZoomState,
	factor: number,
	px: number,
	py: number,
	min: number,
	max: number,
): ZoomState {
	const k = Math.min(max, Math.max(min, zoom.k * factor));
	const ratio = k / zoom.k;
	return { k, x: px - (px - zoom.x) * ratio, y: py - (py - zoom.y) * ratio };
}

export const zoomTransform = (zoom: ZoomState) =>
	`translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.k})`;
