"use client";

import { SwipeActions, SwipeActionsRow } from "@baby-ui/react";
import type { ReactNode } from "react";

type Message = { id: string; subject: string };

export function Example({
	messages,
	trash,
	remove,
}: {
	messages: Message[];
	trash: ReactNode;
	remove: (id: string) => void;
}) {
	return (
		<SwipeActions label="Inbox">
			{messages.map((message) => (
				<SwipeActionsRow
					key={message.id}
					label={message.subject}
					trailing={[
						{
							label: "Delete",
							icon: trash,
							tone: "destructive",
							onSelect: () => remove(message.id),
						},
					]}
				>
					{message.subject}
				</SwipeActionsRow>
			))}
		</SwipeActions>
	);
}
