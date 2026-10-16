export type NotificationTone = "info" | "success" | "warning";

export type NotificationItem = {
	id: string;
	title: string;
	description?: string;
	/** Display label such as "5m" or "Yesterday". */
	time: string;
	read?: boolean;
	tone?: NotificationTone;
	/** Person behind the update; their avatar replaces the tone icon. */
	actor?: { name: string; avatar?: string };
};

export type NotificationView = "all" | "unread";
export type InboxRow = { item: NotificationItem; on: boolean; delay: number };

const CASCADE = 0.035;
const LEAVE_MS = 450;

export const unreadSummary = (unread: number) =>
	unread
		? `${unread} update${unread === 1 ? "" : "s"} waiting for you`
		: "You're all caught up";

export const markRead = (items: NotificationItem[], id: string, read: boolean) =>
	items.map((item) => (item.id === id ? { ...item, read } : item));

export const markAllRead = (items: NotificationItem[]) =>
	items.map((item) => ({ ...item, read: true }));

/**
 * Keeps removed items on screen while their rows fold away, so a controlled list can drop them at
 * once; `rows` merges them back at their old index with `on: false` and a cascade delay.
 */
export function createInbox(onSettle: () => void) {
	let previous: NotificationItem[] = [];
	const leaving = new Map<
		string,
		{ item: NotificationItem; index: number; delay: number }
	>();
	return {
		rows(items: NotificationItem[], view: NotificationView): InboxRow[] {
			const ids = new Set(items.map((item) => item.id));
			const removed = previous.filter(
				(item) => !ids.has(item.id) && !leaving.has(item.id),
			);
			removed.forEach((item, order) => {
				const delay = removed.length > 1 ? Math.min(order * CASCADE, 0.2) : 0;
				leaving.set(item.id, { item, index: previous.indexOf(item), delay });
				setTimeout(
					() => {
						leaving.delete(item.id);
						onSettle();
					},
					LEAVE_MS + delay * 1000,
				);
			});
			previous = items;
			const rows: InboxRow[] = items.map((item, index) => ({
				item,
				on: view === "all" || !item.read,
				delay: view === "unread" && item.read ? Math.min(index * CASCADE, 0.2) : 0,
			}));
			for (const { item, index, delay } of [...leaving.values()].sort(
				(a, b) => a.index - b.index,
			))
				rows.splice(Math.min(index, rows.length), 0, { item, on: false, delay });
			return rows;
		},
	};
}
