"use client";

import {
	type CitationChip,
	CitationText,
	CitationTextBody,
	CitationTextSources,
} from "@baby-ui/react";
import { TLS_ANSWER, TLS_SOURCES } from "../data/citation-text";

export function CitationTextDemo({ props }: { props: Record<string, unknown> }) {
	return (
		<div className="w-full max-w-xl text-[15px]">
			<CitationText
				segments={TLS_ANSWER}
				sources={TLS_SOURCES}
				chip={(props.chip as CitationChip) ?? "number"}
			>
				<CitationTextBody />
				{props.showSources !== false ? (
					<CitationTextSources label={(props.sourcesLabel as string) || "Sources"} />
				) : null}
			</CitationText>
		</div>
	);
}
