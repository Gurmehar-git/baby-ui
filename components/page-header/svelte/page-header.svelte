<script lang="ts">
import type { Snippet } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarGroup from "../../avatar/svelte/avatar-group.svelte";
import AvatarGroupCount from "../../avatar/svelte/avatar-group-count.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Badge from "../../badge/svelte/badge.svelte";
import type { BadgeVariant } from "../../badge/variants";
import Breadcrumb from "../../breadcrumb/svelte/breadcrumb.svelte";
import BreadcrumbItem from "../../breadcrumb/svelte/breadcrumb-item.svelte";
import BreadcrumbLink from "../../breadcrumb/svelte/breadcrumb-link.svelte";
import BreadcrumbList from "../../breadcrumb/svelte/breadcrumb-list.svelte";
import BreadcrumbPage from "../../breadcrumb/svelte/breadcrumb-page.svelte";
import BreadcrumbSeparator from "../../breadcrumb/svelte/breadcrumb-separator.svelte";
import { cn } from "../../lib/cn";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import Tabs from "../../tabs/svelte/tabs.svelte";
import TabsList from "../../tabs/svelte/tabs-list.svelte";
import TabsTrigger from "../../tabs/svelte/tabs-trigger.svelte";
import { type PageHeaderTab, watchCondensed } from "../header";
import { type PageHeaderVariant, pageHeader } from "../variants";

let {
	title,
	variant = "static",
	description,
	breadcrumbs = [],
	status,
	avatars = [],
	actions,
	tabs = [],
	tab = $bindable(),
	onTabChange,
	children,
	class: className,
}: {
	title: string;
	/** `sticky` pins the header and condenses it once the page scrolls; `static` scrolls away. */
	variant?: PageHeaderVariant;
	description?: string;
	/** Trail to this page; the last crumb is the current page. */
	breadcrumbs?: { label: string; href?: string }[];
	status?: { label: string; variant?: BadgeVariant };
	/** Faces of the people on this page; four show, the rest count. */
	avatars?: { src: string; alt?: string }[];
	/** Buttons on the right, e.g. a primary action and an overflow menu. */
	actions?: Snippet;
	tabs?: PageHeaderTab[];
	/** Bindable. */
	tab?: string;
	onTabChange?: (tab: string) => void;
	/** Panels under the header, usually one TabsContent per tab. */
	children?: Snippet;
	class?: string;
} = $props();

const uid = $props.id();
const s = $derived(pageHeader({ variant }));
let sentinel = $state<HTMLDivElement | null>(null);
let condensed = $state(false);
$effect(() => {
	if (!sentinel || variant !== "sticky") return;
	return watchCondensed(sentinel, (next) => {
		condensed = next;
	});
});
// svelte-ignore state_referenced_locally
let ownTab = $state(tabs[0]?.value ?? "");
const current = $derived(tab ?? ownTab);
function setTab(next: string) {
	if (tab === undefined) ownTab = next;
	else tab = next;
	onTabChange?.(next);
}
</script>

{#snippet bar()}
	<header data-condensed={condensed} class={s.bar()}>
		{#if breadcrumbs.length}
			<div class={s.fold()}>
				<div class={s.foldInner()}>
					<Breadcrumb class={s.crumbs()}>
						<BreadcrumbList>
							{#each breadcrumbs as crumb, index (crumb.label)}
								{#if index > 0}<BreadcrumbSeparator />{/if}
								<BreadcrumbItem>
									{#if index === breadcrumbs.length - 1 || !crumb.href}
										<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
									{:else}
										<BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
									{/if}
								</BreadcrumbItem>
							{/each}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</div>
		{/if}
		<div class={s.row()}>
			<div class={s.heading()}>
				<h1 id="{uid}-title" class={s.title()}>{title}</h1>
				{#if status}<Badge variant={status.variant ?? "secondary"} size="sm">{status.label}</Badge>{/if}
			</div>
			<div class={s.side()}>
				{#if avatars.length}
					<AvatarGroup>
						{#each avatars.slice(0, 4) as face (face.src)}
							<Avatar size="sm" class="size-7">
								<AvatarImage src={face.src} alt={face.alt ?? ""} />
								<AvatarFallback>{(face.alt ?? "").charAt(0)}</AvatarFallback>
							</Avatar>
						{/each}
						{#if avatars.length > 4}
							<AvatarGroupCount size="sm" class="size-7">+{avatars.length - 4}</AvatarGroupCount>
						{/if}
					</AvatarGroup>
				{/if}
				{@render actions?.()}
			</div>
		</div>
		{#if description}
			<div class={s.fold()}>
				<div class={s.foldInner()}>
					<p class={s.description()}>{description}</p>
				</div>
			</div>
		{/if}
		{#if tabs.length}
			<TabsList class={cn(s.tabs(), s.tabList())}>
				{#each tabs as item (item.value)}
					<TabsTrigger value={item.value}>
						{item.label}
						{#if item.count !== undefined}
							<RollingDigits value={item.count} startOnView={false} class={s.tabCount()} />
						{/if}
					</TabsTrigger>
				{/each}
			</TabsList>
		{:else}
			<div class={s.spacer()}></div>
		{/if}
	</header>
{/snippet}

<div data-slot="page-header" data-variant={variant} class={cn(s.root(), className)}>
	<div bind:this={sentinel} aria-hidden="true" class={s.sentinel()}></div>
	{#if tabs.length}
		<Tabs variant="underline" bind:value={() => current, setTab}>
			{@render bar()}
			{#if children}<div class={s.panels()}>{@render children()}</div>{/if}
		</Tabs>
	{:else}
		{@render bar()}
		{#if children}<div class={s.panels()}>{@render children()}</div>{/if}
	{/if}
</div>
