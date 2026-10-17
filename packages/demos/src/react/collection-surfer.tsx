"use client";

import {
	CollectionSurfer,
	CollectionSurferHint,
	CollectionSurferTitle,
	CollectionSurferTrack,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { COLLECTION_SURFER } from "../data/demo-samples";
import { controlProps } from "../data/preview-props";

export function CollectionSurferDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof CollectionSurfer>>(props);
	return (
		<CollectionSurfer
			items={COLLECTION_SURFER.items}
			variant={p.variant}
			size={p.size}
			scrollPerItem={p.scrollPerItem}
		>
			<CollectionSurferTitle>{COLLECTION_SURFER.title}</CollectionSurferTitle>
			<CollectionSurferHint>Scroll to surf</CollectionSurferHint>
			<CollectionSurferTrack />
		</CollectionSurfer>
	);
}
