"use client";

import { FillButton } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function FillButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof FillButton>>(props);
	return (
		<FillButton tone={p.tone ?? "soft"} size={p.size ?? "default"}>
			Get started
		</FillButton>
	);
}
