"use client";

import {
	Button,
	TopographicLines,
	type TopographicLinesTone,
	type TopographicLinesVariant,
} from "@baby-ui/react";

type Props = Record<string, unknown>;

export function TopographicLinesDemo({ props }: { props: Props }) {
	return (
		<div className="relative h-96 w-full max-w-3xl overflow-hidden rounded-xl border border-border">
			<TopographicLines
				position="absolute"
				variant={(props.variant as TopographicLinesVariant) ?? "lines"}
				tone={(props.tone as TopographicLinesTone) ?? "mono"}
				levels={Number(props.levels ?? 14)}
				indexEvery={Number(props.indexEvery ?? 5)}
				scale={Number(props.scale ?? 280)}
				speed={Number(props.speed ?? 1)}
				seed={Number(props.seed ?? 7)}
				lineWidth={Number(props.lineWidth ?? 1)}
			>
				<div className="flex size-full flex-col items-start justify-end gap-4 p-8">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
						Field survey, season 04
					</p>
					<h2 className="max-w-sm text-balance font-semibold text-3xl text-foreground tracking-tight">
						Map every trail before you ship it
					</h2>
					<Button>Explore the atlas</Button>
				</div>
			</TopographicLines>
		</div>
	);
}
