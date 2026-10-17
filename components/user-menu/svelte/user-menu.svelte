<script lang="ts" module>
import type { Snippet } from "svelte";

export type UserMenuItem = {
	label: string;
	icon?: Snippet;
	/** Shortcut hint such as "⌘,"; the key is not bound. */
	shortcut?: string;
	onSelect?: () => void;
};
</script>

<script lang="ts">
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuCheckboxItem from "../../dropdown-menu/svelte/dropdown-menu-checkbox-item.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuLabel from "../../dropdown-menu/svelte/dropdown-menu-label.svelte";
import DropdownMenuSeparator from "../../dropdown-menu/svelte/dropdown-menu-separator.svelte";
import DropdownMenuShortcut from "../../dropdown-menu/svelte/dropdown-menu-shortcut.svelte";
import DropdownMenuSub from "../../dropdown-menu/svelte/dropdown-menu-sub.svelte";
import DropdownMenuSubContent from "../../dropdown-menu/svelte/dropdown-menu-sub-content.svelte";
import DropdownMenuSubTrigger from "../../dropdown-menu/svelte/dropdown-menu-sub-trigger.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/cn";
import { initials } from "../../mention-input/mention";
import Spinner from "../../spinner/svelte/spinner.svelte";
import {
	runSignOut,
	statusLabel,
	THEME_OPTIONS,
	type ThemePreference,
	USER_STATUSES,
	type UserMenuUser,
	type UserStatus,
} from "../account";
import { type UserMenuSize, userMenu } from "../variants";

let {
	user,
	status = $bindable(),
	onStatusChange,
	theme = $bindable(),
	onThemeChange,
	items = [],
	onSignOut,
	signOutShortcut,
	showName = false,
	open = $bindable(false),
	onOpenChange,
	align = "end",
	size = "default",
	class: classProp,
}: {
	user: UserMenuUser;
	/** Bindable; passing it or `onStatusChange` shows the presence dot and a status submenu. */
	status?: UserStatus;
	onStatusChange?: (status: UserStatus) => void;
	/** Bindable; passing it or `onThemeChange` shows a theme submenu; applying it is up to the app. */
	theme?: ThemePreference;
	onThemeChange?: (theme: ThemePreference) => void;
	/** Account destinations; keep it to three or four. */
	items?: UserMenuItem[];
	/** A returned promise keeps the menu open with progress until it settles. */
	onSignOut?: () => unknown;
	signOutShortcut?: string;
	/** Shows the name and a chevron beside the avatar from 640px up. */
	showName?: boolean;
	/** Bindable. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	align?: "start" | "center" | "end";
	size?: UserMenuSize;
	class?: string;
} = $props();

let pending = $state(false);
const s = $derived(userMenu({ size }));
const showStatus = $derived(status !== undefined || onStatusChange !== undefined);
const showTheme = $derived(theme !== undefined || onThemeChange !== undefined);

function setOpen(next: boolean) {
	if (pending) return;
	open = next;
	onOpenChange?.(next);
}
function pickStatus(next: UserStatus) {
	status = next;
	onStatusChange?.(next);
}
function pickTheme(next: ThemePreference) {
	theme = next;
	onThemeChange?.(next);
}
</script>

{#snippet face()}
	<span class={s.face()}>
		<Avatar>
			{#if user.avatar}<AvatarImage src={user.avatar} alt="" />{/if}
			<AvatarFallback>{initials(user.name)}</AvatarFallback>
		</Avatar>
		{#if showStatus && status}<span aria-hidden="true" data-presence={status} class={s.dot()}></span>{/if}
	</span>
{/snippet}

{#snippet glyph(d: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class="size-4 text-muted-foreground"><path {d} /></svg
	>
{/snippet}

<DropdownMenu bind:open={() => open, setOpen}>
	<DropdownMenuTrigger
		aria-label="Account menu for {user.name}{showStatus && status ? `, ${statusLabel(status)}` : ''}"
		class={cn(s.trigger(), classProp)}
	>
		{@render face()}
		{#if showName}
			<span class={s.name()}>{user.name}</span>
			<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class={s.chevron()}
				><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg
			>
		{/if}
	</DropdownMenuTrigger>
	<DropdownMenuContent {align} class={s.content()}>
		<DropdownMenuLabel class={s.header()}>
			{@render face()}
			<span class={s.identity()}>
				<span class={s.headerName()}>
					<span class="truncate">{user.name}</span>
					{#if user.plan}<Badge size="sm" variant="secondary">{user.plan}</Badge>{/if}
				</span>
				<span class={s.email()}>{user.email}</span>
			</span>
		</DropdownMenuLabel>
		{#if showStatus || showTheme || items.length > 0}<DropdownMenuSeparator />{/if}
		{#if showStatus}
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<span class="flex items-center gap-2">
						Status
						{#if status}<span class={s.value()}>{statusLabel(status)}</span>{/if}
					</span>
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					{#each USER_STATUSES as option (option.value)}
						<DropdownMenuCheckboxItem
							bind:checked={() => status === option.value, () => pickStatus(option.value)}
						>
							<span aria-hidden="true" data-presence={option.value} class={cn(s.dot(), "relative inset-auto mr-1 ring-0")}
							></span>
							{option.label}
						</DropdownMenuCheckboxItem>
					{/each}
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		{/if}
		{#if showTheme}
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<span class="flex items-center gap-2">
						Theme
						{#if theme}<span class={s.value()}>{THEME_OPTIONS.find((option) => option.value === theme)?.label}</span>{/if}
					</span>
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent>
					{#each THEME_OPTIONS as option (option.value)}
						<DropdownMenuCheckboxItem bind:checked={() => theme === option.value, () => pickTheme(option.value)}>
							{@render glyph(option.icon)}
							{option.label}
						</DropdownMenuCheckboxItem>
					{/each}
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		{/if}
		{#each items as item (item.label)}
			<DropdownMenuItem onSelect={item.onSelect}>
				{@render item.icon?.()}
				{item.label}
				{#if item.shortcut}<DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>{/if}
			</DropdownMenuItem>
		{/each}
		{#if onSignOut}
			<DropdownMenuSeparator />
			<DropdownMenuItem
				closeOnSelect={false}
				aria-disabled={pending || undefined}
				onSelect={() => {
					if (pending) return;
					runSignOut(onSignOut, (next) => (pending = next)).then(() => setOpen(false));
				}}
			>
				{#if pending}<Spinner size="sm" />{:else}{@render glyph("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9")}{/if}
				{pending ? "Signing out…" : "Sign out"}
				{#if signOutShortcut && !pending}<DropdownMenuShortcut>{signOutShortcut}</DropdownMenuShortcut>{/if}
			</DropdownMenuItem>
		{/if}
	</DropdownMenuContent>
</DropdownMenu>
