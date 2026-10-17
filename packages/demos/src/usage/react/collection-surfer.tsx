"use client";

import {
	CollectionSurfer,
	CollectionSurferTitle,
	CollectionSurferTrack,
} from "@baby-ui/react";

const items = [1005, 1011, 1012, 1027, 1035, 1038].map((id, i) => ({
	src: `https://picsum.photos/id/${id}/440/588`,
	alt: `Look ${i + 1}`,
}));

export function Example() {
	return (
		<CollectionSurfer items={items}>
			<CollectionSurferTitle>Spring collection</CollectionSurferTitle>
			<CollectionSurferTrack />
		</CollectionSurfer>
	);
}
