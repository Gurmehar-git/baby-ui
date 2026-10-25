<script lang="ts">
import { outlineSidebar, playgroundOutlineDrawer } from "#lib/docs-sidebar.svelte.js";
import { prefs } from "#lib/preferences.svelte.js";
import SidebarToggleIcon from "./sidebar-toggle-icon.svelte";

const open = $derived(
	prefs.layout === "library" ? outlineSidebar.current : playgroundOutlineDrawer.current,
);

function toggle() {
	if (prefs.layout === "library") outlineSidebar.current = !outlineSidebar.current;
	else playgroundOutlineDrawer.current = !playgroundOutlineDrawer.current;
}
</script>

<!-- xl only: below that the rail is the "On this page" drawer, which has its own trigger. -->
<button
	type="button"
	onclick={toggle}
	aria-expanded={open}
	aria-controls="outline-sidebar"
	aria-label={open ? "Hide page outline" : "Show page outline"}
	title={open ? "Hide page outline" : "Show page outline"}
	class="hidden size-8 shrink-0 place-items-center self-start rounded-xl border border-border bg-card/20 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring xl:grid"
>
	<SidebarToggleIcon {open} class="size-4 -scale-x-100" />
</button>
