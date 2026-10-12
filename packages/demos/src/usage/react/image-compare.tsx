"use client";

import { ImageCompare } from "@baby-ui/react";

export function Example({
	beforeSrc,
	afterSrc,
}: {
	beforeSrc: string;
	afterSrc: string;
}) {
	return (
		<ImageCompare
			before={<img src={beforeSrc} alt="Before retouching" />}
			after={<img src={afterSrc} alt="After retouching" />}
		/>
	);
}
