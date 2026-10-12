"use client";

import { SplitFlapDisplay } from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { departuresBoard, departuresLine } from "../data/departures";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function SplitFlapDisplayDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SplitFlapDisplay>>(props);
	const [tick, setTick] = useState(0);
	const columns = Number(props.columns ?? 24);

	useEffect(() => {
		const id = setInterval(() => setTick((t) => t + 1), 6000);
		return () => clearInterval(id);
	}, []);

	return (
		<div className="w-full">
			<SplitFlapDisplay
				value={
					props.layout === "line" ? departuresLine(tick) : departuresBoard(tick, columns)
				}
				columns={columns}
				variant={p.variant ?? "solid"}
				size={p.size ?? "default"}
				indicator={p.indicator ?? "success"}
				stepMs={Number(props.stepMs ?? 60)}
				staggerMs={Number(props.staggerMs ?? 30)}
			/>
		</div>
	);
}
