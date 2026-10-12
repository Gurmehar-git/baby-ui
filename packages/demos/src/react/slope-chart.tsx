"use client";

import { Button, type ChartConfig, ChartContainer, SlopeChart } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import {
	CONVERSION_BY_CHANNEL,
	CONVERSION_CONFIG,
	CONVERSION_NEXT,
} from "../data/conversion";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const config = CONVERSION_CONFIG satisfies ChartConfig;

export function SlopeChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SlopeChart>>(props);
	const [later, setLater] = useState(false);
	return (
		<div className="grid w-full max-w-2xl gap-3">
			<ChartContainer config={config} title="Conversion rate by channel" aspect="video">
				<SlopeChart
					data={later ? CONVERSION_NEXT : CONVERSION_BY_CHANNEL}
					startLabel={later ? "Q2" : "Q1"}
					endLabel={later ? "Q3" : "Q2"}
					highlightKey="email"
					variant={p.variant}
				/>
			</ChartContainer>
			<Button
				variant="outline"
				size="sm"
				className="justify-self-start"
				onClick={() => setLater(!later)}
			>
				{later ? "Show Q1 to Q2" : "Show Q2 to Q3"}
			</Button>
		</div>
	);
}
