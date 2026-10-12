"use client";

import { Button, Sparkline } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { controlProps } from "../data/preview-props";
import {
	formatThousands,
	SPARK_DAYS,
	SPARK_REVENUE,
	SPARK_REVENUE_NEXT,
} from "../data/sparkline";

type Props = Record<string, unknown>;

export function SparklineDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Sparkline>>(props);
	const [next, setNext] = useState(false);
	const data = next ? SPARK_REVENUE_NEXT : SPARK_REVENUE;
	const latest = data[data.length - 1] ?? 0;
	return (
		<div className="grid w-full max-w-xs gap-4">
			<Sparkline
				label="Revenue"
				data={data}
				labels={SPARK_DAYS}
				value={formatThousands(latest)}
				change={next ? "+68.1%" : "+73.2%"}
				formatValue={formatThousands}
				area={p.area}
				interactive={p.interactive}
				variant={p.variant}
			/>
			<Button
				variant="outline"
				size="sm"
				className="justify-self-start"
				onClick={() => setNext(!next)}
			>
				Swap data
			</Button>
		</div>
	);
}
