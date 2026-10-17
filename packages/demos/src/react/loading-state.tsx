"use client";

import {
	LoadingState,
	LoadingStateElapsed,
	LoadingStateIndicator,
	LoadingStateLabel,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function LoadingStateDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof LoadingState>>(props);
	return (
		<LoadingState variant={p.variant ?? "drive"}>
			<LoadingStateIndicator />
			<LoadingStateLabel>Churning</LoadingStateLabel>
			<LoadingStateElapsed />
		</LoadingState>
	);
}
