"use client";

import { ExpandingButtonGroup } from "@baby-ui/react";
import type { ReactNode } from "react";

export function Example({
	reply,
	archive,
	onArchive,
}: {
	reply: ReactNode;
	archive: ReactNode;
	onArchive: () => Promise<void>;
}) {
	return (
		<ExpandingButtonGroup
			label="Message actions"
			items={[
				{ id: "reply", label: "Reply", icon: reply },
				{
					id: "archive",
					label: "Archive",
					doneLabel: "Archived",
					onSelect: onArchive,
					icon: archive,
				},
			]}
		/>
	);
}
