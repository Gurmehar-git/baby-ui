"use client";

import { StatsBand } from "@baby-ui/react";

export function Example() {
	return (
		<StatsBand
			variant="divided"
			stats={[
				{ value: 12_400, notation: "compact", label: "Teams", suffix: "+" },
				{ value: 99.99, decimals: 2, suffix: "%", label: "Uptime" },
				{ value: 38, suffix: "ms", label: "Median latency", detail: "At the edge" },
			]}
		/>
	);
}
