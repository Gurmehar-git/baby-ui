<script lang="ts">
import { type ThemePreference, UserMenu, type UserStatus } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";
import { fakeSignOut, MENU_ITEMS, MENU_USER } from "../data/user-menu";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof UserMenu>>(props));
let status = $state<UserStatus>("available");
let theme = $state<ThemePreference>("system");
</script>

<div class="grid min-h-24 place-items-center">
	<UserMenu
		user={MENU_USER}
		bind:status
		bind:theme
		items={MENU_ITEMS}
		onSignOut={fakeSignOut}
		signOutShortcut="⇧⌘Q"
		showName={p.showName}
		size={p.size}
		align="center"
	/>
</div>
