<script lang="ts">
import { SidebarNav, type SidebarNavItem, type SidebarRecent } from "@baby-ui/svelte";
import type { ComponentProps, Snippet } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof SidebarNav>>(props));

const NAV_ITEMS: SidebarNavItem[] = [
	{ key: "home", label: "Home" },
	{ key: "invite", label: "Invite users", count: "3/10" },
];

const RECENTS: SidebarRecent[] = [
	{ id: "onboarding", label: "Onboarding checklist" },
	{ id: "roadmap", label: "Q3 roadmap review" },
	{ id: "bug", label: "Fix the export bug" },
	{ id: "standup", label: "Standup notes" },
];

// svelte-ignore state_referenced_locally -- intentional one-time seed, matching React's useState(initialValue)
let collapsed = $state(false);
let nav = $state("home");

$effect.pre(() => {
	collapsed = props.collapsed === true;
});
</script>

{#snippet homeIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4.5">
		<path
			d="M2.5 7.5 8 3l5.5 4.5V13a1 1 0 0 1-1 1h-3v-4H6.5v4h-3a1 1 0 0 1-1-1z"
			stroke="currentColor"
			stroke-width="1.4"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

{#snippet userAddIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4.5">
		<circle cx="6.5" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.4" />
		<path d="M1.5 14v-.5a5 5 0 0 1 5-5h0M12 5v4M10 7h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet editIcon()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" class="size-4.5">
		<path d="M11 2 14 5 6 13H3v-3z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
{/snippet}

{#snippet logoIcon()}
	<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="size-4">
		<path d="M12 22a10 10 0 0 1 10-10A10 10 0 0 1 12 2 10 10 0 0 1 2 12a10 10 0 0 1 10 10z" />
	</svg>
{/snippet}

<SidebarNav
	workspace={{
				name: "Acme Studio",
				monogram: "A",
				image: "https://avatar.vercel.sh/acme-studio?size=48",
			}}
	logo={logoIcon as unknown as Snippet}
	navItems={NAV_ITEMS.map((item, i) => ({
		...item,
		icon: (i === 0 ? homeIcon : userAddIcon) as unknown as Snippet,
	}))}
	recents={RECENTS}
	newChatIcon={editIcon as unknown as Snippet}
	workspaceActions={[{ label: "Invite team members", onSelect: () => (nav = "invite") }]}
	bind:activeNav={nav}
	chatNavKey="home"
	footerLabel="Invite users"
	onFooterClick={() => (nav = "invite")}
	onSignOut={() => {}}
	size={p.size ?? "default"}
	bind:collapsed
	fill
	class="max-h-[420px]"
/>
