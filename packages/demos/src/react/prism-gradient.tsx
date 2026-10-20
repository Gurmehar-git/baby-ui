"use client";

import {
	PrismGradient,
	type PrismGradientSpeed,
	type PrismGradientTone,
} from "@baby-ui/react";

type Props = Record<string, unknown>;

export function PrismGradientDemo({ props }: { props: Props }) {
	return (
		<div className="relative h-80 w-full max-w-2xl overflow-hidden rounded-xl border border-border">
			<PrismGradient
				position="absolute"
				tone={(props.tone as PrismGradientTone) ?? "chart"}
				speed={(props.speed as PrismGradientSpeed) ?? "normal"}
				grain={Number(props.grain ?? 0)}
			>
				<div className="grid size-full place-items-center">
					<p className="font-semibold text-2xl text-foreground">Built on baby ui</p>
				</div>
			</PrismGradient>
		</div>
	);
}
