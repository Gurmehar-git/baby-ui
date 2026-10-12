"use client";

import { GaugeChart } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

/** Demo bands: the state names itself as the value crosses each threshold. */
const BANDS = [
	{ from: 0, label: "Critical", tone: "negative" as const },
	{ from: 40, label: "Watch", tone: "highlight" as const },
	{ from: 70, label: "Healthy", tone: "primary" as const },
];

export function GaugeChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof GaugeChart>>(props);
	const layout = p.layout ?? "arc";
	return (
		<div className={layout === "linear" ? "w-full max-w-md" : "w-full max-w-sm"}>
			<GaugeChart
				value={Number(props.value ?? 72)}
				layout={layout}
				tone={p.tone ?? "primary"}
				notches={Number(props.notches ?? 40)}
				spacing={Number(props.spacing ?? 25)}
				label={p.label || undefined}
				bands={props.banded ? BANDS : undefined}
				showValue={props.showValue !== false}
			/>
		</div>
	);
}
