<script lang="ts">
import {
	IconAdjustmentsHorizontal,
	IconBackground,
	IconBook,
	IconBrandGithub,
	IconChartBar,
	IconCode,
	IconComponents,
	IconFileText,
	IconForms,
	IconLayers,
	IconLayoutGrid,
	IconMail,
	IconMenu2,
	IconPalette,
	IconPhoto,
	IconPlayerPlay,
	IconRobot,
	IconSettings,
	IconStack2,
	IconTable,
	IconTerminal2,
	IconTypography,
} from "@baby-ui/icons";
import {
	Button,
	button,
	MegaMenu,
	type MegaMenuGroup,
	type MegaMenuItem,
	ThemeToggle,
	type ThemeToggleValue,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@baby-ui/svelte";
import { mode, setMode } from "mode-watcher";
import Logo from "#lib/components/logo.svelte";
import SidebarToggleIcon from "#lib/components/sidebar-toggle-icon.svelte";
import SiteSearch from "#lib/components/site-search.svelte";
import { docsSidebar, playgroundDocsDrawer } from "#lib/docs-sidebar.svelte.js";
import { GITHUB_URL, githubStars } from "#lib/github-stars.js";
import { mobileNav } from "#lib/mobile-nav.svelte.js";
import { prefs } from "#lib/preferences.svelte.js";
import {
	COLLECTIONS,
	categoryHref,
	type NavIcon,
	siteNav,
	TOP_LEVEL,
} from "#lib/registry.js";
import { page } from "$app/state";

const NAV = $derived(siteNav(page.data.categories ?? []));

const ICONS: Record<NavIcon, typeof IconBook> = {
	agents: IconRobot,
	data: IconTable,
	forms: IconForms,
	charts: IconChartBar,
	base: IconComponents,
	text: IconTypography,
	animated: IconPlayerPlay,
	backgrounds: IconBackground,
	blocks: IconLayoutGrid,
	advanced: IconStack2,
	"og-images": IconPhoto,
	emails: IconMail,
	intro: IconBook,
	install: IconTerminal2,
	cli: IconCode,
	theming: IconPalette,
	design: IconLayers,
	create: IconAdjustmentsHorizontal,
	llms: IconFileText,
};

// Menu items become MegaMenu groups; plain links (Pricing) sit beside them. Featured items keep
// their descriptions; the rest collapse to one-line links so a long menu stays short.
const GROUPS = $derived<MegaMenuGroup[]>(
	NAV.filter((item) => item.menu).map((item) => {
		const menu = item.menu ?? [];
		const featured = menu.some((link) => link.featured)
			? menu.filter((link) => link.featured)
			: menu;
		const rest = menu.filter((link) => !featured.includes(link));
		return {
			label: item.label,
			href: item.href,
			footer: item.footer,
			items: featured.map((link) => ({
				href: link.href,
				label: link.label,
				description: link.description,
			})),
			more: rest.length
				? { heading: "More", links: rest.map(({ href, label }) => ({ href, label })) }
				: undefined,
		};
	}),
);
const LINKS = $derived(NAV.filter((item) => !item.menu));
const iconFor = $derived(
	new Map(
		NAV.flatMap((item) => item.menu ?? []).map((link) => [link.href, ICONS[link.icon]]),
	),
);

// The header's own hamburger only opens something on routes that render a SiteSidebar.
const SIDEBAR_ROUTES = [
	"/components",
	...TOP_LEVEL.map(categoryHref),
	...Object.keys(COLLECTIONS).map((id) => `/${id}`),
	"/docs",
	"/studio",
	"/pricing",
];
const hasSidebar = $derived(
	SIDEBAR_ROUTES.some((route) => page.url.pathname.startsWith(route)),
);
const workspaceShell = $derived(hasSidebar);
const libraryShell = $derived(hasSidebar && prefs.layout === "library");
const desktopNavigationOpen = $derived(
	libraryShell ? docsSidebar.current : playgroundDocsDrawer.current,
);

// Set the class in the same tick as mode-watcher: the reveal snapshots the DOM when this returns.
function pickMode(next: ThemeToggleValue) {
	document.documentElement.classList.toggle("dark", next === "dark");
	setMode(next);
}

let stars = $state<number | null>(null);
const compact = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1,
});

$effect(() => {
	void githubStars().then((count) => (stars = count));
});

let scrolled = $state(false);

$effect(() => {
	const onScroll = () => (scrolled = window.scrollY > 8);
	onScroll();
	window.addEventListener("scroll", onScroll, { passive: true });
	return () => window.removeEventListener("scroll", onScroll);
});

function active(match: string[]) {
	const path = page.url.pathname;
	return match.some((m) => path === m || path.startsWith(`${m}/`));
}
</script>

{#snippet desktopSidebarToggle()}
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={() => {
			if (libraryShell) docsSidebar.current = !docsSidebar.current;
			else playgroundDocsDrawer.current = !playgroundDocsDrawer.current;
		}}
		aria-expanded={desktopNavigationOpen}
		aria-controls="docs-sidebar"
		aria-label={desktopNavigationOpen ? "Close navigation" : "Open navigation"}
		class="hidden size-8 rounded-md text-foreground/75 hover:bg-transparent hover:text-foreground md:inline-flex"
	>
		<SidebarToggleIcon open={desktopNavigationOpen} class="size-5!" />
	</Button>
{/snippet}

{#snippet brand()}
	<a
		href="/"
			aria-label="Baby UI home"
		class="group flex items-center gap-2.5 font-semibold text-foreground text-sm tracking-tight"
	>
		<Logo class="size-6 text-foreground" />
		<span class="font-semibold font-display whitespace-nowrap">Baby UI</span>
	</a>
{/snippet}

<header
	class={[
		"fixed inset-x-0 top-0 z-40",
		// The blur layer is always composited; scrolling only fades its opacity.
		"before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:border-border before:border-b before:bg-background/70 before:backdrop-blur-xl before:backdrop-saturate-150",
		"before:transition-opacity before:duration-[var(--duration-dropdown)] before:ease-[var(--ease-ui-out)] motion-reduce:before:transition-none",
		scrolled && !workspaceShell ? "before:opacity-100" : "before:opacity-0",
		workspaceShell && [
			"bg-card transition-colors duration-[var(--duration-dropdown)] ease-[var(--ease-ui-out)] motion-reduce:transition-none",
		],
	]}
>
	<div
		class={[
			"min-w-0",
			libraryShell
				? [
						docsSidebar.current
							? "md:grid-cols-[16rem_minmax(0,1fr)]"
							: "md:grid-cols-[0rem_minmax(0,1fr)]",
						"grid grid-cols-[minmax(0,1fr)] transition-[grid-template-columns] ease-[var(--ease-drawer)] md:pr-2 motion-reduce:transition-none",
						docsSidebar.current
							? "duration-[var(--duration-drawer)]"
							: "duration-[var(--duration-overlay)]",
					]
				: workspaceShell
					? "md:pr-2"
					: "",
		]}
	>
		{#if libraryShell}
		<div
			inert={!docsSidebar.current}
			aria-hidden={!docsSidebar.current || undefined}
			class="hidden min-w-0 overflow-clip md:block"
		>
			<div class="flex h-14 w-64 items-center justify-between gap-3 px-4">
				{@render brand()}
				{@render desktopSidebarToggle()}
			</div>
		</div>
		{/if}

		<div
			class={[
				"flex h-14 min-w-0 items-center justify-between gap-2 px-4 sm:gap-4 md:px-6",
				workspaceShell
					? "md:border md:border-b-0 md:border-border md:bg-background"
					: "xl:px-8",
			]}
		>
			<div class="flex min-w-0 items-center gap-2">
			{#if hasSidebar}
				<Button
					variant="ghost"
					size="icon-sm"
					onclick={() => (mobileNav.open = true)}
					aria-label="Open navigation"
					class="size-9 rounded-full bg-foreground/[0.04] text-foreground/75 ring-1 ring-border/70 hover:bg-foreground/[0.07] hover:text-foreground md:hidden"
				>
					<IconMenu2 class="size-[1.125rem]" />
				</Button>
			{/if}
			{#if workspaceShell}
				<div class="shrink-0 md:hidden">
					{@render brand()}
				</div>
				{#if libraryShell}
					{#if !docsSidebar.current}{@render desktopSidebarToggle()}{/if}
				{:else}
					<div class="hidden items-center gap-2 md:flex">
						{@render desktopSidebarToggle()}
						{@render brand()}
					</div>
				{/if}
			{:else}
				{@render brand()}
			{/if}

			{#if !workspaceShell}<nav aria-label="Main" class="hidden items-center gap-1 md:flex">
				<MegaMenu groups={GROUPS} active={page.url.pathname}>
					{#snippet itemIcon(item: MegaMenuItem)}
						{@const Icon = iconFor.get(item.href)}
						{#if Icon}<Icon aria-hidden="true" />{/if}
					{/snippet}
				</MegaMenu>
				{#each LINKS as link (link.href)}
					{@const current = active(link.match)}
					<Button
						href={link.href}
						variant="ghost"
						aria-current={current ? "page" : undefined}
						class="h-8 rounded-full px-3 hover:bg-foreground/[0.06] {current
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{link.label}
					</Button>
				{/each}
			</nav>{/if}
			</div>

		<nav aria-label="Site tools" class="flex items-center gap-1 sm:gap-2">
			<SiteSearch />

			<ThemeToggle
				theme={mode.current === "dark" ? "dark" : "light"}
				onThemeChange={pickMode}
				variant="rectangle"
				start="bottom-up"
				class={button({
					variant: "ghost",
					size: "icon",
					class: "rounded-xl text-foreground/75 hover:text-foreground",
				})}
				iconClass="size-4"
			/>

			<Button
				variant="ghost"
				size="icon"
				onclick={() => (prefs.open = true)}
				aria-label="Settings"
				class="gear rounded-xl text-foreground/75 hover:text-foreground"
			>
				<IconSettings size={17} />
			</Button>

			<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button
							{...props}
							href={GITHUB_URL}
							rel="noreferrer noopener"
							target="_blank"
							variant="ghost"
							size="sm"
							loadingLabel=""
							aria-label={stars === null ? "Star on GitHub" : `Star on GitHub, ${stars} stars`}
							class="h-8 gap-1 rounded-full px-2 text-foreground/75 tabular-nums hover:bg-foreground/[0.06] hover:text-foreground"
						>
							<IconBrandGithub size={16} />
							{#if stars !== null}<span class="hidden text-xs sm:inline">{compact.format(stars)}</span>{/if}
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent side="bottom">Star on GitHub</TooltipContent>
			</Tooltip>
			</TooltipProvider>

		</nav>
		</div>
	</div>
</header>

<style>
	/* Global: `.gear` lands on Button's own element, outside this component's scope. */
	:global(.gear svg) {
		transition: transform var(--duration-dropdown) var(--ease-ui-out);
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.gear:hover svg) {
			transform: rotate(90deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.gear svg) {
			transition: none;
		}
	}
</style>
