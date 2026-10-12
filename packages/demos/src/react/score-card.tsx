"use client";

import { ScoreCard } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function ScoreCardDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ScoreCard>>(props);
	return (
		<div className="w-full max-w-xs">
			<ScoreCard
				title="Performance"
				description="Lighthouse, last deploy"
				value={87}
				min={Number(p.min ?? 0)}
				max={Number(p.max ?? 100)}
				trend={4}
				tone={p.tone ?? "primary"}
				layout={p.layout ?? "arc"}
				size={p.size ?? "default"}
			/>
		</div>
	);
}
