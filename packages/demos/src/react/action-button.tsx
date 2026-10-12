"use client";

import { ActionButton } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const request = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

export function ActionButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ActionButton>>(props);
	return (
		<ActionButton
			label={p.label || "Publish"}
			successLabel={p.successLabel || "Published"}
			pendingLabel="Publishing"
			variant={p.variant}
			size={p.size}
			onAction={request}
		/>
	);
}
