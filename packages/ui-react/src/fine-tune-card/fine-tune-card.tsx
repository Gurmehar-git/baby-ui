"use client";

import { useState } from "react";
import { cn } from "../lib/cn";
import { PropertyPanelControls } from "../property-panel/property-panel-controls";
import type { PropertySchema, PropertyValues } from "../property-panel/schema";
import { type FineTuneCardSize, fineTuneCard } from "./variants";

export type { FineTuneCardSize };

/** A tunable number; its `key` doubles as the row label ("cornerRadius" reads "Corner radius"). */
export type FineTuneField = {
	key: string;
	value: number;
	min: number;
	max: number;
	step?: number;
};

export type FineTuneCardLabels = {
	title?: string;
	adjust?: string;
	edited?: string;
};

export type FineTuneState = {
	layout: string;
	values: Record<string, number>;
	type: string;
};

const LAYOUTS = ["row", "column", "grid"] as const;

const DEFAULT_LABELS: Required<FineTuneCardLabels> = {
	title: "Untitled",
	adjust: "Adjust",
	edited: "Edited",
};

export interface FineTuneCardProps {
	/** The tunable numbers, one slider row each. */
	fields: FineTuneField[];
	/** Options offered in the Type select; the row is hidden when empty. */
	options?: string[];
	labels?: FineTuneCardLabels;
	size?: FineTuneCardSize;
	/** Identifies the subject `fields` describes; changing it resets uncontrolled edits. */
	id?: string;
	/** Controlled editable state. Omit to let the card own it. */
	state?: FineTuneState;
	defaultState?: FineTuneState;
	onChange?: (state: FineTuneState) => void;
	className?: string;
}

function initialState(fields: FineTuneField[]): FineTuneState {
	return {
		layout: LAYOUTS[0],
		values: Object.fromEntries(fields.map((f) => [f.key, f.value])),
		type: "",
	};
}

// `type` marks a control inside a schema, so the Type select lives under `variant`.
function schemaFor(fields: FineTuneField[], options: string[]): PropertySchema {
	return {
		layout: { type: "segmented" as const, options: LAYOUTS },
		...Object.fromEntries(
			fields.map((f) => [f.key, [f.value, f.min, f.max, f.step ?? 1] as const]),
		),
		...(options.length ? { variant: { type: "select" as const, options } } : {}),
	};
}

/** An element inspector: layout, tunable numbers and a type, with an Edited badge once changed. */
export function FineTuneCard({
	fields,
	options = [],
	labels,
	size = "default",
	id,
	state: stateProp,
	defaultState,
	onChange,
	className,
}: FineTuneCardProps) {
	const text = { ...DEFAULT_LABELS, ...labels };
	const [ownState, setOwnState] = useState<FineTuneState>(
		() => defaultState ?? initialState(fields),
	);
	const [seenId, setSeenId] = useState(id);
	if (stateProp === undefined && id !== seenId) {
		setSeenId(id);
		setOwnState(initialState(fields));
	}
	const state = stateProp ?? ownState;
	const s = fineTuneCard({ size });
	const values: PropertyValues = {
		layout: state.layout,
		...state.values,
		variant: state.type,
	};

	const update = (next: PropertyValues) => {
		const nextState: FineTuneState = {
			layout: typeof next.layout === "string" ? next.layout : state.layout,
			values: Object.fromEntries(
				fields.map((f) => {
					const v = next[f.key];
					return [f.key, typeof v === "number" ? v : f.value];
				}),
			),
			type: typeof next.variant === "string" ? next.variant : state.type,
		};
		if (stateProp === undefined) setOwnState(nextState);
		onChange?.(nextState);
	};

	const edited =
		state.layout !== LAYOUTS[0] ||
		state.type !== "" ||
		fields.some((f) => (state.values[f.key] ?? f.value) !== f.value);

	return (
		<div data-slot="fine-tune-card" className={cn(s.root(), className)}>
			<div className={s.header()}>
				<span className={s.title()}>{text.title}</span>
				{edited ? (
					<span className={s.edited()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
							className="size-2.5"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
						{text.edited}
					</span>
				) : (
					<span className={s.adjust()}>{text.adjust}</span>
				)}
			</div>
			<PropertyPanelControls
				schema={schemaFor(fields, options)}
				values={values}
				onValuesChange={update}
			/>
		</div>
	);
}
