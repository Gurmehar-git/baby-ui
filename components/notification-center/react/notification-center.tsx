"use client";

import { type CSSProperties, useReducer, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar/react/avatar";
import { Button } from "../../button/react/button";
import { button } from "../../button/react/variants";
import { Collapsible, CollapsibleContent } from "../../collapsible/react/collapsible";
import { cn } from "../../lib/react/cn";
import { initials } from "../../mention-input/react/mention";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover/react/popover";
import { RollingDigits } from "../../rolling-digits/react/rolling-digits";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	createInbox,
	markAllRead,
	markRead,
	type NotificationItem,
	type NotificationTone,
	type NotificationView,
	unreadSummary,
} from "./inbox";
import { type NotificationCenterSize, notificationCenter } from "./variants";

export type { NotificationCenterSize, NotificationItem, NotificationTone };

export interface NotificationCenterProps {
	notifications?: NotificationItem[];
	defaultNotifications?: NotificationItem[];
	/** The full next list after a read change, dismissal or bulk action. */
	onNotificationsChange?: (notifications: NotificationItem[]) => void;
	onReadChange?: (notification: NotificationItem, read: boolean) => void;
	onDismiss?: (notification: NotificationItem) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	label?: string;
	size?: NotificationCenterSize;
	className?: string;
}

const PATHS: Record<NotificationTone, string> = {
	info: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
	success: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3",
	warning:
		"m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3M12 9v4m0 4h.01",
};
const Glyph = ({ d, className }: { d: string; className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		className={cn("size-3.5", className)}
	>
		<path d={d} />
	</svg>
);
const BELL =
	"M10.3 21a1.9 1.9 0 0 0 3.4 0M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.6 18 8A6 6 0 0 0 6 8c0 4.6-1.4 6-2.7 7.3";
const CLOSE = "M18 6 6 18M6 6l12 12";
const DONE_ALL = "M18 6 7 17l-5-5m20-2-7.5 7.5L13 16";
const CHECK = "M20 6 9 17l-5-5";
const DOT =
	"M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0";

/** A bell with an unread badge that opens an inbox: filter, expand, mark read, dismiss and clear. */
export function NotificationCenter({
	notifications,
	defaultNotifications = [],
	onNotificationsChange,
	onReadChange,
	onDismiss,
	open,
	onOpenChange,
	label = "Notifications",
	size = "default",
	className,
}: NotificationCenterProps) {
	const [own, setOwn] = useState(defaultNotifications);
	const items = notifications ?? own;
	const [ownOpen, setOwnOpen] = useState(false);
	const isOpen = open ?? ownOpen;
	const [view, setView] = useState<NotificationView>("all");
	const [expanded, setExpanded] = useState<string | null>(null);
	const [, refresh] = useReducer((n: number) => n + 1, 0);
	const inbox = useRef<ReturnType<typeof createInbox> | null>(null);
	inbox.current ??= createInbox(refresh);
	const rows = inbox.current.rows(items, view);
	const unread = items.filter((item) => !item.read).length;
	const read = items.length - unread;
	const shown = rows.filter((row) => row.on).length;
	const s = notificationCenter({ size });

	const commit = (next: NotificationItem[]) => {
		if (notifications === undefined) setOwn(next);
		onNotificationsChange?.(next);
	};
	const setOpen = (next: boolean) => {
		if (open === undefined) setOwnOpen(next);
		onOpenChange?.(next);
	};
	const toggleRead = (item: NotificationItem) => {
		onReadChange?.(item, !item.read);
		commit(markRead(items, item.id, !item.read));
		if (!item.read && view === "unread") setExpanded(null);
	};
	const dismiss = (item: NotificationItem) => {
		onDismiss?.(item);
		commit(items.filter((entry) => entry.id !== item.id));
	};

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${label}${unread ? `, ${unread} unread` : ""}`}
				className={cn(
					button({ variant: "outline", size: "icon" }),
					"group/nc",
					s.trigger(),
					className,
				)}
			>
				<Glyph d={BELL} className={cn("size-4.5", s.bell())} />
				<span aria-hidden data-on={unread > 0} className={s.badge()}>
					{unread > 9 ? "9+" : <RollingDigits value={unread} startOnView={false} />}
				</span>
			</PopoverTrigger>
			<PopoverContent sideOffset={12} aria-label={label} className={s.panel()}>
				<div className={s.header()}>
					<div>
						<div className={s.heading()}>
							<h2 className={s.title()}>{label}</h2>
							<span className={s.count()}>
								<RollingDigits value={unread} startOnView={false} />
							</span>
						</div>
						<p aria-live="polite" className={s.summary()}>
							{unreadSummary(unread)}
						</p>
					</div>
					<Button
						size="icon-sm"
						variant="ghost"
						aria-label={`Close ${label.toLowerCase()}`}
						onClick={() => setOpen(false)}
					>
						<Glyph d={CLOSE} className="size-4" />
					</Button>
				</div>
				<div className={s.toolbar()}>
					<ToggleGroup
						type="single"
						size="sm"
						label="Show notifications"
						value={view}
						onValueChange={(next) => {
							if (next === "all" || next === "unread") setView(next);
							setExpanded(null);
						}}
					>
						<ToggleGroupItem value="all">All</ToggleGroupItem>
						<ToggleGroupItem value="unread">Unread</ToggleGroupItem>
					</ToggleGroup>
					<Button
						size="xs"
						variant="ghost"
						data-on={unread > 0}
						inert={unread === 0}
						className={s.markAll()}
						onClick={() => {
							for (const item of items) if (!item.read) onReadChange?.(item, true);
							commit(markAllRead(items));
							setExpanded(null);
						}}
					>
						<Glyph d={DONE_ALL} />
						Mark all read
					</Button>
				</div>
				<div className={s.list()}>
					<ul aria-label={view === "all" ? "All notifications" : "Unread notifications"}>
						{rows.map(({ item, on, delay }) => (
							<li
								key={item.id}
								data-on={on}
								inert={!on}
								className={s.row()}
								style={{ "--nc-delay": `${delay}s` } as CSSProperties}
							>
								<div className={s.clip()}>
									<Collapsible
										open={expanded === item.id}
										onOpenChange={(next) => setExpanded(next ? item.id : null)}
										data-read={item.read || undefined}
										data-expanded={expanded === item.id || undefined}
										className={cn("group/item", s.item())}
									>
										<div className={s.main()}>
											{item.actor ? (
												<Avatar className={s.avatar()} aria-hidden>
													{item.actor.avatar && (
														<AvatarImage src={item.actor.avatar} alt="" />
													)}
													<AvatarFallback>{initials(item.actor.name)}</AvatarFallback>
												</Avatar>
											) : (
												<span
													aria-hidden
													data-tone={item.tone ?? "info"}
													className={s.icon()}
												>
													<Glyph d={PATHS[item.tone ?? "info"]} />
												</span>
											)}
											<button
												type="button"
												aria-expanded={expanded === item.id}
												className={s.toggle()}
												onClick={() => setExpanded(expanded === item.id ? null : item.id)}
											>
												<span className={s.itemTitle()}>
													<span className={s.titleText()}>
														{item.title}
														{!item.read && <span className="sr-only">, unread</span>}
													</span>
													<span aria-hidden className={s.dot()} />
												</span>
												<span className={s.preview()}>
													{item.description ??
														(item.actor
															? `From ${item.actor.name}`
															: "View update details")}
												</span>
											</button>
											<time className={s.time()}>{item.time}</time>
										</div>
										<CollapsibleContent className={cn("p-0", s.details())}>
											<p className={s.detailText()}>
												{item.description ??
													(item.actor
														? `${item.actor.name} shared an update with you.`
														: "This update is ready to review.")}
											</p>
											<div className={s.actions()}>
												<Button
													size="sm"
													variant="outline"
													onClick={() => toggleRead(item)}
												>
													<Glyph d={item.read ? DOT : CHECK} />
													{item.read ? "Mark unread" : "Mark read"}
												</Button>
												<Button size="sm" variant="outline" onClick={() => dismiss(item)}>
													<Glyph d={CLOSE} />
													Dismiss
												</Button>
											</div>
										</CollapsibleContent>
									</Collapsible>
								</div>
							</li>
						))}
					</ul>
					<div data-on={shown === 0} inert={shown > 0} className={s.row()}>
						<div className={s.clip()}>
							<div className={s.empty()}>
								<Glyph d={PATHS.success} />
								<strong className={s.emptyTitle()}>
									{view === "unread" ? "Nothing unread" : "All clear"}
								</strong>
								<p className={s.emptyText()}>
									{view === "unread"
										? "You've seen every update."
										: "New updates will appear here."}
								</p>
								{view === "unread" && items.length > 0 && (
									<Button
										size="xs"
										variant="link"
										className="mt-3"
										onClick={() => setView("all")}
									>
										View all updates
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div data-on={read > 0} inert={read === 0} className={s.row()}>
					<div className={s.clip()}>
						<div className={s.footer()}>
							<span>
								<RollingDigits value={read} startOnView={false} /> read
							</span>
							<Button
								size="xs"
								variant="ghost"
								onClick={() => {
									for (const item of items) if (item.read) onDismiss?.(item);
									commit(items.filter((item) => !item.read));
								}}
							>
								Clear read
							</Button>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
