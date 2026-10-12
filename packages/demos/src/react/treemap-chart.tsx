"use client";

import { ChartContainer, TreemapChart } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { REVENUE_TREE } from "../data/revenue-regions";

type Props = Record<string, unknown>;

export function TreemapChartDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TreemapChart>>(props);
	return (
		<div className="w-full max-w-3xl">
			<ChartContainer config={{}} title="Revenue by region" aspect="video">
				<TreemapChart
					data={REVENUE_TREE}
					colorLabel="Growth"
					formatColor={(value) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`}
					variant={p.variant}
				/>
			</ChartContainer>
		</div>
	);
}
