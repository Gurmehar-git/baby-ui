<script lang="ts">
import type { Snippet } from "svelte";
import DialogContent from "../../dialog/svelte/dialog-content.svelte";
import DrawerContent from "../../drawer/svelte/drawer-content.svelte";
import { getResponsiveDialog } from "./context";

let { children, class: classProp }: { children?: Snippet; class?: string } = $props();

const dialog = getResponsiveDialog();
</script>

{#if dialog.isMobile}
	<DrawerContent variant={dialog.variant} class={classProp}>
		{@render children?.()}
	</DrawerContent>
{:else}
	<DialogContent class={classProp}>
		{@render children?.()}
	</DialogContent>
{/if}
