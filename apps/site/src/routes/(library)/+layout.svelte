<script lang="ts">
import SidebarPageLayout from "#lib/components/sidebar-page-layout.svelte";
import type { LayoutProps } from "./$types";

let { data, children }: LayoutProps = $props();
</script>

<SidebarPageLayout groups={data.groups}>
	{@render children()}
</SidebarPageLayout>
