<script lang="ts">
import type { Snippet } from "svelte";
import DialogDescription from "../../dialog/svelte/dialog-description.svelte";
import DrawerDescription from "../../drawer/svelte/drawer-description.svelte";
import { getResponsiveDialog } from "./context";

let { children, class: classProp }: { children?: Snippet; class?: string } = $props();

const dialog = getResponsiveDialog();
</script>

{#if dialog.isMobile}
	<DrawerDescription class={classProp}>
		{@render children?.()}
	</DrawerDescription>
{:else}
	<DialogDescription class={classProp}>
		{@render children?.()}
	</DialogDescription>
{/if}
