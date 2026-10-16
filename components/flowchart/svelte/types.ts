import type { Snippet } from "svelte";

export type FlowchartOption = { value: string; label: string; tag?: string };

export type FlowchartConditionRow = {
	id: string;
	connector: string;
	source: string;
	property: string;
	propertyOptions: FlowchartOption[];
	comparator?: string;
	value: string;
	valueOptions: FlowchartOption[];
	dot?: boolean;
};

export type StepNode = {
	id: string;
	row: number;
	x: number;
	w: number;
	hue: string;
	kindLabel?: string;
	icon?: Snippet;
	title?: string;
	caption?: string;
	conditions?: FlowchartConditionRow[];
};

export type FlowchartEdge = { from: string; to: string };
