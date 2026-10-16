<script lang="ts">
import { untrack } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Button from "../../button/svelte/button.svelte";
import { button } from "../../button/svelte/variants";
import Collapsible from "../../collapsible/svelte/collapsible.svelte";
import CollapsibleContent from "../../collapsible/svelte/collapsible-content.svelte";
import { cn } from "../../lib/svelte/cn";
import { initials } from "../../mention-input/svelte/mention";
import Popover from "../../popover/svelte/popover.svelte";
import PopoverContent from "../../popover/svelte/popover-content.svelte";
import PopoverTrigger from "../../popover/svelte/popover-trigger.svelte";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import ToggleGroup from "../../toggle-group/svelte/toggle-group.svelte";
import ToggleGroupItem from "../../toggle-group/svelte/toggle-group-item.svelte";
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

let {
	notifications = $bindable(),
	onNotificationsChange,
	onReadChange,
	onDismiss,
	open = $bindable(false),
	onOpenChange,
	label = "Notifications",
	size = "default",
	class: classProp,
}: {
	/** Bindable. */
	notifications?: NotificationItem[];
	/** The full next list after a read change, dismissal or bulk action. */
	onNotificationsChange?: (notifications: NotificationItem[]) => void;
	onReadChange?: (notification: NotificationItem, read: boolean) => void;
	onDismiss?: (notification: NotificationItem) => void;
	/** Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	label?: string;
	size?: NotificationCenterSize;
	class?: string;
} = $props();

const PATHS: Record<NotificationTone, string> = {
	info: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z",
	success: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3",
	warning:
		"m21.7 18-8-14a2 2 0 0 0-3.5 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3M12 9v4m0 4h.01",
};
const CLOSE = "M18 6 6 18M6 6l12 12";

let own = $state(untrack(() => notifications ?? []));
const items = $derived(notifications ?? own);
let view = $state<NotificationView>("all");
let expanded = $state<string | null>(null);
let settled = $state(0);
const inbox = createInbox(() => settled++);
const rows = $derived.by(() => {
	void settled;
	return inbox.rows(items, view);
});
const unread = $derived(items.filter((item) => !item.read).length);
const read = $derived(items.length - unread);
const shown = $derived(rows.filter((row) => row.on).length);
const s = $derived(notificationCenter({ size }));

function commit(next: NotificationItem[]) {
	if (notifications === undefined) own = next;
	else notifications = next;
	onNotificationsChange?.(next);
}
function setOpen(next: boolean) {
	open = next;
	onOpenChange?.(next);
}
function toggleRead(item: NotificationItem) {
	onReadChange?.(item, !item.read);
	commit(markRead(items, item.id, !item.read));
	if (!item.read && view === "unread") expanded = null;
}
function dismiss(item: NotificationItem) {
	onDismiss?.(item);
	commit(items.filter((entry) => entry.id !== item.id));
}
</script>

{#snippet glyph(d: string, className?: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={cn("size-3.5", className)}><path {d} /></svg
	>
{/snippet}

<Popover bind:open={() => open, setOpen}>
	<PopoverTrigger
		aria-label="{label}{unread ? `, ${unread} unread` : ''}"
		class={cn(button({ variant: "outline", size: "icon" }), "group/nc", s.trigger(), classProp)}
	>
		{@render glyph(
			"M10.3 21a1.9 1.9 0 0 0 3.4 0M3.3 15.3A1 1 0 0 0 4 17h16a1 1 0 0 0 .7-1.7C19.4 14 18 12.6 18 8A6 6 0 0 0 6 8c0 4.6-1.4 6-2.7 7.3",
			cn("size-4.5", s.bell()),
		)}
		<span aria-hidden="true" data-on={unread > 0} class={s.badge()}>
			{#if unread > 9}9+{:else}<RollingDigits value={unread} startOnView={false} />{/if}
		</span>
	</PopoverTrigger>
	<PopoverContent sideOffset={12} aria-label={label} class={s.panel()}>
		<div class={s.header()}>
			<div>
				<div class={s.heading()}>
					<h2 class={s.title()}>{label}</h2>
					<span class={s.count()}><RollingDigits value={unread} startOnView={false} /></span>
				</div>
				<p aria-live="polite" class={s.summary()}>{unreadSummary(unread)}</p>
			</div>
			<Button size="icon-sm" variant="ghost" aria-label="Close {label.toLowerCase()}" onclick={() => setOpen(false)}>
				{@render glyph(CLOSE, "size-4")}
			</Button>
		</div>
		<div class={s.toolbar()}>
			<ToggleGroup
				type="single"
				size="sm"
				label="Show notifications"
				bind:value={
					() => view,
					(next) => {
						if (next === "all" || next === "unread") view = next;
						expanded = null;
					}
				}
			>
				<ToggleGroupItem value="all">All</ToggleGroupItem>
				<ToggleGroupItem value="unread">Unread</ToggleGroupItem>
			</ToggleGroup>
			<Button
				size="xs"
				variant="ghost"
				data-on={unread > 0}
				inert={unread === 0}
				class={s.markAll()}
				onclick={() => {
					for (const item of items) if (!item.read) onReadChange?.(item, true);
					commit(markAllRead(items));
					expanded = null;
				}}
			>
				{@render glyph("M18 6 7 17l-5-5m20-2-7.5 7.5L13 16")}
				Mark all read
			</Button>
		</div>
		<div class={s.list()}>
			<ul aria-label={view === "all" ? "All notifications" : "Unread notifications"}>
				{#each rows as { item, on, delay } (item.id)}
					<li data-on={on} inert={!on} class={s.row()} style:--nc-delay="{delay}s">
						<div class={s.clip()}>
							<div
								data-read={item.read || undefined}
								data-expanded={expanded === item.id || undefined}
								class={cn("group/item", s.item())}
							>
							<Collapsible bind:open={() => expanded === item.id, (next) => (expanded = next ? item.id : null)}>
								<div class={s.main()}>
									{#if item.actor}
										<Avatar class={s.avatar()} aria-hidden="true">
											{#if item.actor.avatar}<AvatarImage src={item.actor.avatar} alt="" />{/if}
											<AvatarFallback>{initials(item.actor.name)}</AvatarFallback>
										</Avatar>
									{:else}
										<span aria-hidden="true" data-tone={item.tone ?? "info"} class={s.icon()}
											>{@render glyph(PATHS[item.tone ?? "info"])}</span
										>
									{/if}
									<button
										type="button"
										aria-expanded={expanded === item.id}
										class={s.toggle()}
										onclick={() => (expanded = expanded === item.id ? null : item.id)}
									>
										<span class={s.itemTitle()}>
											<span class={s.titleText()}
												>{item.title}{#if !item.read}<span class="sr-only">, unread</span>{/if}</span
											>
											<span aria-hidden="true" class={s.dot()}></span>
										</span>
										<span class={s.preview()}
											>{item.description ?? (item.actor ? `From ${item.actor.name}` : "View update details")}</span
										>
									</button>
									<time class={s.time()}>{item.time}</time>
								</div>
								<CollapsibleContent class={cn("p-0", s.details())}>
									<p class={s.detailText()}>
										{item.description ??
											(item.actor ? `${item.actor.name} shared an update with you.` : "This update is ready to review.")}
									</p>
									<div class={s.actions()}>
										<Button size="sm" variant="outline" onclick={() => toggleRead(item)}>
											{@render glyph(
												item.read
													? "M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0"
													: "M20 6 9 17l-5-5",
											)}
											{item.read ? "Mark unread" : "Mark read"}
										</Button>
										<Button size="sm" variant="outline" onclick={() => dismiss(item)}>
											{@render glyph(CLOSE)}
											Dismiss
										</Button>
									</div>
								</CollapsibleContent>
							</Collapsible>
							</div>
						</div>
					</li>
				{/each}
			</ul>
			<div data-on={shown === 0} inert={shown > 0} class={s.row()}>
				<div class={s.clip()}>
					<div class={s.empty()}>
						{@render glyph(PATHS.success)}
						<strong class={s.emptyTitle()}>{view === "unread" ? "Nothing unread" : "All clear"}</strong>
						<p class={s.emptyText()}>
							{view === "unread" ? "You've seen every update." : "New updates will appear here."}
						</p>
						{#if view === "unread" && items.length > 0}
							<Button size="xs" variant="link" class="mt-3" onclick={() => (view = "all")}>View all updates</Button>
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div data-on={read > 0} inert={read === 0} class={s.row()}>
			<div class={s.clip()}>
				<div class={s.footer()}>
					<span><RollingDigits value={read} startOnView={false} /> read</span>
					<Button
						size="xs"
						variant="ghost"
						onclick={() => {
							for (const item of items) if (item.read) onDismiss?.(item);
							commit(items.filter((item) => !item.read));
						}}>Clear read</Button
					>
				</div>
			</div>
		</div>
	</PopoverContent>
</Popover>
