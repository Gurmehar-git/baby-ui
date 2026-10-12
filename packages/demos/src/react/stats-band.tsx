"use client";

import { StatsBand } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { STATS } from "../data/stats-band";

export function StatsBandDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof StatsBand>>(props);
	return (
		<StatsBand
			key={p.variant}
			stats={STATS}
			variant={p.variant}
			title="Fast, steady and close to everyone"
			description="Measured across every region from October 2025 to September 2026."
			locale="en-US"
		/>
	);
}
