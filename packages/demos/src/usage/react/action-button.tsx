"use client";

import { ActionButton } from "@baby-ui/react";

export function Example({ url }: { url: string }) {
	return (
		<ActionButton
			variant="outline"
			label="Copy link"
			successLabel="Copied"
			onAction={() => navigator.clipboard.writeText(url)}
		/>
	);
}
