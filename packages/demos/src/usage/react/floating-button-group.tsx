"use client";

import { FloatingButtonGroup } from "@baby-ui/react";

export function Example({
	onUndo,
	onShare,
}: {
	onUndo: () => void;
	onShare: () => void;
}) {
	return (
		<FloatingButtonGroup
			label="Board actions"
			items={[
				{ id: "undo", label: "Undo", shortcut: "⌘Z", onSelect: onUndo },
				{ type: "separator" },
				{ id: "share", label: "Share", onSelect: onShare },
			]}
		/>
	);
}
