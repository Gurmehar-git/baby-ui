"use client";

import { SignaturePad } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";

export function SignaturePadDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof SignaturePad>>(props);
	return (
		<div className="w-full max-w-lg">
			<SignaturePad variant={p.variant} signer="Maya Chen" downloadable />
		</div>
	);
}
