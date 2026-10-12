"use client";

import { ConfirmMorph } from "@baby-ui/react";

export function Example({
	remove,
	restore,
}: {
	remove: () => Promise<void>;
	restore: () => Promise<void>;
}) {
	return <ConfirmMorph label="Delete project" onConfirm={remove} onUndo={restore} />;
}
