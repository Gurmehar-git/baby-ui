<script lang="ts">
import type { Snippet } from "svelte";
import DialogClose from "../../dialog/svelte/dialog-close.svelte";
import DrawerClose from "../../drawer/svelte/drawer-close.svelte";
import { getResponsiveDialog } from "./context";

let { children, class: classProp }: { children?: Snippet; class?: string } = $props();

const dialog = getResponsiveDialog();
</script>

{#if dialog.isMobile}
	<DrawerClose class={classProp}>
		{#if children}{@render children()}{/if}
	</DrawerClose>
{:else}
	<DialogClose class={classProp}>
		{#if children}{@render children()}{/if}
	</DialogClose>
{/if}
