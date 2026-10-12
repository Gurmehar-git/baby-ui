"use client";

import {
	Button,
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	WaffleChart,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { ENERGY_MIX_2015, ENERGY_MIX_2024, ENERGY_MIX_CONFIG } from "../data/energy-mix";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const config = ENERGY_MIX_CONFIG satisfies ChartConfig;

export function WaffleChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof WaffleChart>>(props);
	const [recent, setRecent] = useState(true);
	return (
		<div className="grid w-full max-w-sm gap-3">
			<ChartContainer
				config={config}
				title={`Electricity generation, ${recent ? 2024 : 2015}`}
				aspect="square"
			>
				<WaffleChart
					data={recent ? ENERGY_MIX_2024 : ENERGY_MIX_2015}
					variant={p.variant ?? "mixed"}
				/>
				<ChartLegend />
			</ChartContainer>
			<Button
				variant="outline"
				size="sm"
				className="justify-self-center"
				onClick={() => setRecent(!recent)}
			>
				Show {recent ? 2015 : 2024}
			</Button>
		</div>
	);
}
