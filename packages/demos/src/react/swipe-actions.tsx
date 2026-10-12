"use client";

import { Button, SwipeActions, SwipeActionsRow } from "@baby-ui/react";
import { type ComponentProps, type ReactNode, useState } from "react";
import { controlProps } from "../data/preview-props";
import { INBOX } from "../data/swipe-actions";

type Props = Record<string, unknown>;

const icon = (d: string): ReactNode => (
	<svg
		aria-hidden
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d={d} />
	</svg>
);
const ARCHIVE = icon("M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4");
const TRASH = icon("M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14");
const MAIL = icon("M4 6h16v12H4zM4 7l8 6 8-6");

export function SwipeActionsDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof SwipeActions>>(props);
	const [messages, setMessages] = useState(INBOX);
	const [unread, setUnread] = useState<Record<string, boolean>>({ m1: true, m3: true });
	const remove = (id: string) =>
		setMessages((list) => list.filter((message) => message.id !== id));
	return (
		<div className="flex w-full max-w-md flex-col gap-3">
			<SwipeActions label="Inbox" variant={p.variant} size={p.size}>
				{messages.map((message) => (
					<SwipeActionsRow
						key={message.id}
						label={message.subject}
						leading={[
							{
								label: unread[message.id] ? "Read" : "Unread",
								icon: MAIL,
								tone: "primary",
								keepRow: true,
								onSelect: () =>
									setUnread((map) => ({ ...map, [message.id]: !map[message.id] })),
							},
						]}
						trailing={[
							{ label: "Archive", icon: ARCHIVE, onSelect: () => remove(message.id) },
							{
								label: "Delete",
								icon: TRASH,
								tone: "destructive",
								onSelect: () => remove(message.id),
							},
						]}
					>
						<div className="flex items-baseline justify-between gap-3">
							<span className={unread[message.id] ? "font-semibold text-sm" : "text-sm"}>
								{message.from}
							</span>
							<span className="text-muted-foreground text-xs tabular-nums">
								{message.time}
							</span>
						</div>
						<p className="truncate text-muted-foreground text-sm">{message.subject}</p>
					</SwipeActionsRow>
				))}
			</SwipeActions>
			{messages.length < INBOX.length && (
				<Button
					variant="ghost"
					size="sm"
					className="self-center"
					onClick={() => setMessages(INBOX)}
				>
					Restore inbox
				</Button>
			)}
		</div>
	);
}
