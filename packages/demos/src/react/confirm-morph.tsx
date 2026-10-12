"use client";

import { ConfirmMorph } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const request = () => new Promise<void>((resolve) => setTimeout(resolve, 900));

export function ConfirmMorphDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ConfirmMorph>>(props);
	return (
		<ConfirmMorph
			label={p.label || "Delete project"}
			prompt={p.prompt || undefined}
			variant={p.variant}
			size={p.size}
			mode={p.mode}
			onConfirm={request}
			onUndo={request}
		/>
	);
}
