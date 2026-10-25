import { getContext, hasContext, setContext } from "svelte";
import type { StackPlace } from "../patterns";
import type { notificationStack } from "../variants";

export type StackLayout = { places: Record<string, StackPlace>; height: number };

export interface NotificationStackState {
	readonly dismissed: string[];
	readonly layout: StackLayout | null;
	readonly styles: ReturnType<typeof notificationStack>;
	dismiss(item: string, from: HTMLElement): void;
}

export interface NotificationStackItemState {
	readonly value: string;
	readonly titleId: string;
}

const KEY = Symbol("notification-stack");
const ITEM = Symbol("notification-stack-item");

/** The root's state behind getters, so every part reads the latest value. */
export const setNotificationStack = (state: NotificationStackState) =>
	setContext(KEY, state);
export function notificationStackState(part: string): NotificationStackState {
	if (!hasContext(KEY))
		throw new Error(`${part} must be used inside <NotificationStack>`);
	return getContext<NotificationStackState>(KEY);
}

export const setNotificationStackItem = (state: NotificationStackItemState) =>
	setContext(ITEM, state);
export function notificationStackItemState(part: string): NotificationStackItemState {
	if (!hasContext(ITEM))
		throw new Error(`${part} must be used inside <NotificationStackItem>`);
	return getContext<NotificationStackItemState>(ITEM);
}
