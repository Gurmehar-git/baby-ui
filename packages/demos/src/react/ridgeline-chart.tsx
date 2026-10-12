"use client";

import { Button, ChartContainer, RidgelineChart } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import { dailyHighs } from "../data/temperatures";

type Props = Record<string, unknown>;

const YEAR_A = dailyHighs(7);
const YEAR_B = dailyHighs(19, 1.8);

export function RidgelineChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof RidgelineChart>>(props);
	const [later, setLater] = useState(false);
	return (
		<div className="grid w-full max-w-2xl gap-3">
			<ChartContainer
				config={{}}
				title={`Daily highs, ${later ? 2025 : 2015}`}
				aspect="video"
			>
				<RidgelineChart series={later ? YEAR_B : YEAR_A} unit="°C" variant={p.variant} />
			</ChartContainer>
			<Button
				variant="outline"
				size="sm"
				className="justify-self-start"
				onClick={() => setLater(!later)}
			>
				Show {later ? 2015 : 2025}
			</Button>
		</div>
	);
}
