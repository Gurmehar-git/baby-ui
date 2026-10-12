<script lang="ts">
import { UserMenu, type UserStatus } from "@baby-ui/svelte";

let status = $state<UserStatus>("available");
</script>

<UserMenu
	user={{ name: "Sam Rivera", email: "sam@acme.dev" }}
	bind:status
	items={[{ label: "Settings", shortcut: "⌘," }]}
	onSignOut={() => fetch("/logout", { method: "POST" })}
/>
