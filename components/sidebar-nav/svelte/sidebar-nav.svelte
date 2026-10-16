<script lang="ts">
import type { Snippet } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import DropdownMenu from "../../dropdown-menu/svelte/dropdown-menu.svelte";
import DropdownMenuContent from "../../dropdown-menu/svelte/dropdown-menu-content.svelte";
import DropdownMenuItem from "../../dropdown-menu/svelte/dropdown-menu-item.svelte";
import DropdownMenuSeparator from "../../dropdown-menu/svelte/dropdown-menu-separator.svelte";
import DropdownMenuTrigger from "../../dropdown-menu/svelte/dropdown-menu-trigger.svelte";
import { cn } from "../../lib/svelte/cn";
import { SIDEBAR_NAV_LABELS, type SidebarNavLabels } from "./labels";
import type {
	SidebarNavItem,
	SidebarRecent,
	SidebarWorkspace,
	SidebarWorkspaceAction,
} from "./types";
import { type SidebarNavSize, sidebarNav } from "./variants";

let {
	workspace,
	logo,
	navItems,
	recents,
	workspaceActions = [],
	onSignOut,
	size = "default",
	collapsed = $bindable(false),
	onCollapsedChange,
	activeNav = $bindable(),
	onNavigate,
	activeTitle = $bindable(null),
	onPick,
	chatNavKey,
	newChatLabel = "New chat",
	newChatIcon,
	onNewChat,
	footerLabel,
	footerIcon,
	onFooterClick,
	fill = false,
	labels: labelsProp,
	class: classProp,
}: {
	workspace: SidebarWorkspace;
	logo?: Snippet;
	navItems: SidebarNavItem[];
	recents: SidebarRecent[];
	workspaceActions?: SidebarWorkspaceAction[];
	onSignOut?: () => void;
	size?: SidebarNavSize;
	collapsed?: boolean;
	onCollapsedChange?: (collapsed: boolean) => void;
	/** Bindable; defaults to the first nav item. */
	activeNav?: string;
	onNavigate?: (key: string) => void;
	activeTitle?: string | null;
	onPick?: (id: string, label: string, prompt?: string) => void;
	/** Nav key that picking a recent or starting a new chat activates; defaults to the first nav item. */
	chatNavKey?: string;
	newChatLabel?: string;
	newChatIcon?: Snippet;
	onNewChat?: () => void;
	/** The footer button renders only when `onFooterClick` is passed. */
	footerLabel?: string;
	footerIcon?: Snippet;
	onFooterClick?: () => void;
	fill?: boolean;
	/** Every built-in string, for localisation. */
	labels?: Partial<SidebarNavLabels>;
	class?: string;
} = $props();

const labels = $derived({ ...SIDEBAR_NAV_LABELS, ...labelsProp });

let searchOpen = $state(false);
let recentsOpen = $state(true);
let query = $state("");
let searchEl = $state<HTMLInputElement>();
let glideBox = $state<Record<string, { top: number; height: number } | null>>({});
let glideVisible = $state<Record<string, boolean>>({});

const classes = $derived(sidebarNav({ size }));
const currentNav = $derived(activeNav ?? navItems[0]?.key);
const chatKey = $derived(chatNavKey ?? navItems[0]?.key);
const trimmed = $derived(query.trim().toLowerCase());
const matches = (item: SidebarRecent) => item.label.toLowerCase().includes(trimmed);
const matchCount = $derived(recents.filter(matches).length);

function setCollapsed(next: boolean) {
	collapsed = next;
	onCollapsedChange?.(next);
	if (next) {
		searchOpen = false;
		query = "";
	}
}

function selectNav(key: string | undefined) {
	if (key === undefined) return;
	activeNav = key;
	onNavigate?.(key);
}

function pick(item: SidebarRecent) {
	selectNav(chatKey);
	activeTitle = item.label;
	onPick?.(item.id, item.label, item.prompt);
}

function onGlideOver(group: string, event: MouseEvent) {
	const row = (event.target as Element).closest<HTMLElement>("[data-row]");
	if (!row) return;
	glideBox[group] = { top: row.offsetTop, height: row.offsetHeight };
	glideVisible[group] = true;
}
</script>

{#snippet chevronDownIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet collapseIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4.5">
		<rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.4" />
		<path d="M6 3v10" stroke="currentColor" stroke-width="1.4" />
		<path d="M4.5 8h-1M4 6.5 3 8l1 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet searchIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
		<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4" />
		<path d="m13 13-2.5-2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet crossIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
		<path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet checkIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
		<path d="M3.5 8.4 6.2 11 12.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet glideList(group: string, klass: string, children: Snippet)}
	<!-- svelte-ignore a11y_no_static_element_interactions -- hover-glide highlight; row buttons carry real interaction -->
	<!-- svelte-ignore a11y_mouse_events_have_key_events -- decorative pointer-only highlight, not a control -->
	<div
		class={cn("relative flex flex-col gap-px", klass)}
		onmouseover={(event) => onGlideOver(group, event)}
		onmouseleave={() => (glideVisible[group] = false)}
	>
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-x-0 rounded-lg bg-foreground/[0.06] top-0 transition-[transform,height,opacity] duration-(--duration-fast) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
			style:transform="translateY({glideBox[group]?.top ?? 0}px)"
			style:height="{glideBox[group]?.height ?? 0}px"
			style:opacity={glideVisible[group] ? 1 : 0}
		></span>
		{@render children()}
	</div>
{/snippet}

{#snippet railButton(icon: Snippet | undefined, label: string, active: boolean, count: string | undefined, onclick: () => void)}
	<button
		data-row
		type="button"
		{onclick}
		aria-current={active ? "page" : undefined}
		title={collapsed ? label : undefined}
		class={cn(
			"relative z-10 mx-2 flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-fast) active:scale-[0.98]",
			active && "bg-foreground/[0.06]",
		)}
	>
		<span class={cn("flex size-5 shrink-0 items-center justify-center", active ? "text-foreground" : "text-muted-foreground")}>
			{#if icon}{@render icon()}{/if}
		</span>
		<span
			class={cn(
				"ml-1.5 min-w-0 flex-1 truncate text-sm font-medium transition-[opacity,transform] duration-(--duration-fast) motion-reduce:transition-none",
				active ? "text-foreground" : "text-muted-foreground",
				collapsed && "translate-x-2 opacity-0",
			)}
		>
			{label}
		</span>
		{#if count}
			<span
				class={cn(
					"mr-2 shrink-0 text-xs font-medium text-muted-foreground tabular-nums transition-opacity duration-(--duration-fast) motion-reduce:transition-none",
					collapsed && "opacity-0",
				)}
			>
				{count}
			</span>
		{/if}
	</button>
{/snippet}

<aside
	data-slot="sidebar-nav"
	aria-label={labels.navigation}
	class={cn(
		"relative flex shrink-0 overflow-hidden transition-[width] duration-[var(--duration-overlay)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		fill ? "h-full" : "h-[600px]",
		collapsed ? "w-13" : classes,
		classProp,
	)}
>
	<div class={cn("flex min-h-0 shrink-0 flex-col", classes)}>
		<div class="relative mb-2.5 h-10 shrink-0">
			<DropdownMenu>
				<DropdownMenuTrigger
					aria-hidden={collapsed}
					tabindex={collapsed ? -1 : 0}
					class="absolute top-1 right-12 left-2 flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-instant) hover:bg-accent active:scale-[0.99]"
				>
					<span
						class={cn(
							"flex size-5 shrink-0 items-center justify-center text-foreground transition-opacity duration-(--duration-fast)",
							collapsed && "opacity-0",
						)}
					>
						{#if logo}
							{@render logo()}
						{:else}
							<Avatar aria-hidden="true" shape="square" class="size-5 rounded-[5px] bg-foreground font-semibold text-xs">
								<AvatarImage src={workspace.image} alt="" />
								<AvatarFallback class="text-background">{workspace.monogram}</AvatarFallback>
							</Avatar>
						{/if}
					</span>
					<span
						class={cn(
							"ml-1.5 min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground transition-[opacity,transform] duration-(--duration-fast) motion-reduce:transition-none",
							collapsed && "translate-x-2 opacity-0",
						)}
					>
						{workspace.name}
					</span>
					<span
						class={cn(
							"ml-1 flex shrink-0 text-muted-foreground transition-opacity duration-(--duration-fast)",
							collapsed && "opacity-0",
						)}
					>
						{@render chevronDownIcon()}
					</span>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" class="w-64">
					<DropdownMenuItem class="h-10 gap-1.5">
						<Avatar aria-hidden="true" shape="square" class="size-6 rounded-md bg-foreground font-semibold text-xs">
							<AvatarImage src={workspace.image} alt="" />
							<AvatarFallback class="text-background">{workspace.monogram}</AvatarFallback>
						</Avatar>
						<span class="min-w-0 flex-1 truncate font-medium text-sm text-foreground">
							{workspace.name}
						</span>
						<span class="shrink-0 text-foreground">{@render checkIcon()}</span>
					</DropdownMenuItem>
					{#if workspaceActions.length > 0}
						<DropdownMenuSeparator />
						{#each workspaceActions as action (action.label)}
							<DropdownMenuItem onclick={action.onSelect} disabled={!action.onSelect} class="h-9 gap-1.5">
								{#if action.icon}
									<span class="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
										{@render action.icon()}
									</span>
								{/if}
								<span class="min-w-0 flex-1 truncate text-sm">{action.label}</span>
							</DropdownMenuItem>
						{/each}
					{/if}
					{#if onSignOut}
						<DropdownMenuSeparator />
						<DropdownMenuItem onclick={onSignOut} class="h-9 gap-1.5">
							<span class="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
								<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4">
									<path
										d="M6 3H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2M11 11l3-3-3-3M14 8H6"
										stroke="currentColor"
										stroke-width="1.4"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span class="min-w-0 flex-1 truncate text-sm">{labels.signOut}</span>
						</DropdownMenuItem>
					{/if}
				</DropdownMenuContent>
			</DropdownMenu>

			<button
				type="button"
				aria-label={labels.collapse}
				aria-hidden={collapsed}
				tabindex={collapsed ? -1 : 0}
				onclick={() => setCollapsed(true)}
				class={cn(
					"absolute top-1 right-2 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground",
					collapsed && "pointer-events-none opacity-0",
				)}
			>
				{@render collapseIcon()}
			</button>
			<button
				type="button"
				aria-label={labels.expand}
				aria-hidden={!collapsed}
				tabindex={collapsed ? 0 : -1}
				onclick={() => setCollapsed(false)}
				class={cn(
					"absolute top-0.5 left-2 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground",
					!collapsed && "pointer-events-none opacity-0",
				)}
			>
				{@render collapseIcon()}
			</button>
		</div>

		{#snippet navRows()}
			{@render railButton(newChatIcon, newChatLabel, false, undefined, () => {
				activeTitle = null;
				selectNav(chatKey);
				onNewChat?.();
			})}
			{#each navItems as item (item.key)}
				{@render railButton(item.icon, item.label, currentNav === item.key, item.count, () =>
					selectNav(item.key),
				)}
			{/each}
		{/snippet}
		{@render glideList("rail", "", navRows as unknown as Snippet)}

		<div class="mt-3 min-h-0 flex-1 overflow-y-auto">
			<div class={cn("relative mx-2 mb-1 h-8 transition-opacity duration-(--duration-fast)", collapsed && "opacity-0")} inert={collapsed}>
				<button
					type="button"
					aria-expanded={recentsOpen}
					aria-hidden={searchOpen}
					tabindex={searchOpen ? -1 : 0}
					onclick={() => (recentsOpen = !recentsOpen)}
					class={cn(
						"absolute inset-0 flex items-center gap-1.5 rounded-lg px-2 font-medium text-xs text-muted-foreground transition-[opacity,transform,background-color] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] hover:bg-accent",
						searchOpen ? "pointer-events-none -translate-x-1 opacity-0" : "translate-x-0 opacity-100",
					)}
				>
					<span class="shrink-0 transition-transform duration-(--duration-fast) motion-reduce:transition-none" style:transform={recentsOpen ? "" : "rotate(-90deg)"}>
						{@render chevronDownIcon()}
					</span>
					<span>{labels.recents}</span>
				</button>

				<button
					type="button"
					aria-label={labels.search}
					aria-expanded={searchOpen}
					onclick={() => {
						searchOpen = true;
						searchEl?.focus();
					}}
					class={cn(
						"absolute top-0 right-0 z-10 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-[opacity,background-color,color,transform] duration-[var(--duration-dropdown)] hover:bg-accent hover:text-accent-foreground active:scale-[0.96]",
						searchOpen ? "pointer-events-none opacity-0" : "opacity-100",
					)}
				>
					{@render searchIcon()}
				</button>

				<div
					class={cn(
						"absolute top-0 right-0 z-20 flex h-8 items-center overflow-hidden rounded-lg bg-muted text-muted-foreground shadow-xs transition-[width,opacity] duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] focus-within:text-foreground",
						searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
					)}
					style:width={searchOpen ? "100%" : "28px"}
				>
					<span class="ml-2 flex shrink-0 items-center justify-center">{@render searchIcon()}</span>
					<input
						bind:this={searchEl}
						bind:value={query}
						onkeydown={(event) => {
							if (event.key === "Escape") {
								searchOpen = false;
								query = "";
							}
						}}
						placeholder={labels.search}
						aria-label={labels.searchInput}
						class="ml-1.5 min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
					/>
					<button
						type="button"
						aria-label={labels.closeSearch}
						onclick={() => {
							searchOpen = false;
							query = "";
						}}
						class="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-(--duration-fast) hover:bg-accent hover:text-accent-foreground active:scale-[0.96]"
					>
						{@render crossIcon()}
					</button>
				</div>
			</div>

			{#snippet recentRows()}
				{#each recents as item (item.id)}
					{@const active = item.label === activeTitle}
					{@const shown = matches(item)}
					<div
						class="grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-[var(--ease-ui-out)] motion-reduce:transition-none"
						style:grid-template-rows={shown ? "1fr" : "0fr"}
						style:opacity={shown ? 1 : 0}
						inert={!shown}
					>
						<div class="overflow-hidden">
							<button
								data-row
								type="button"
								title={item.label}
								onclick={() => pick(item)}
								class={cn(
									"relative z-10 mx-2 mb-px flex h-8 items-center rounded-lg px-2 text-left transition-[background-color,transform] duration-(--duration-fast) active:scale-[0.98]",
									active && "bg-foreground/[0.06]",
								)}
							>
								<span class={cn("min-w-0 flex-1 truncate text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>
									{item.label}
								</span>
							</button>
						</div>
					</div>
				{/each}
				{#if query && matchCount === 0}
					<div class="mx-2 px-2 py-2 text-xs text-muted-foreground">{labels.noResults}</div>
				{/if}
			{/snippet}
			<div
				class={cn(
					"grid transition-[grid-template-rows,opacity] duration-(--duration-base) ease-[var(--ease-ui-out)] motion-reduce:transition-none",
					collapsed && "opacity-0",
				)}
				style:grid-template-rows={recentsOpen ? "1fr" : "0fr"}
			inert={collapsed || !recentsOpen}
			>
				<div class="overflow-hidden">
					{@render glideList("recents", "gap-0", recentRows as unknown as Snippet)}
				</div>
			</div>
		</div>

		{#if onFooterClick}
			<div class={cn("mx-2 mt-3 border-border border-t pt-3 transition-opacity duration-(--duration-fast) motion-reduce:transition-none", collapsed && "opacity-0")} inert={collapsed}>
				<button
					type="button"
					onclick={onFooterClick}
					class="flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-foreground/[0.06] font-medium text-xs text-foreground transition-[background-color,transform] duration-(--duration-fast) hover:bg-foreground/[0.1] active:scale-[0.98]"
				>
					{#if footerIcon}{@render footerIcon()}{/if}
					{footerLabel}
				</button>
			</div>
		{/if}
	</div>
</aside>
