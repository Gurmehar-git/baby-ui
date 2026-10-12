"use client";

import { HoldToConfirm } from "@baby-ui/react";

export function Example({ onDelete }: { onDelete: () => void }) {
	return (
		<HoldToConfirm
			label="Hold to delete project"
			confirmedLabel="Deleted"
			variant="destructive"
			onConfirm={onDelete}
		/>
	);
}
