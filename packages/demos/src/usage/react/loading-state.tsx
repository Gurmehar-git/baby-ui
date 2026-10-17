"use client";

import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
} from "@baby-ui/react";

export function Example() {
	return (
		<LoadingState>
			<LoadingStateIndicator />
			<LoadingStateLabel>Churning</LoadingStateLabel>
			<LoadingStateElapsed />
		</LoadingState>
	);
}
