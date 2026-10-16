<script lang="ts">
import type { Snippet } from "svelte";
import DialogTrigger from "../../dialog/svelte/dialog-trigger.svelte";
import DrawerTrigger from "../../drawer/svelte/drawer-trigger.svelte";
import { getResponsiveDialog } from "./context";

let {
	children,
	class: classProp,
	...rest
}: { children?: Snippet; class?: string } = $props();

const dialog = getResponsiveDialog();
</script>

{#if dialog.isMobile}
	<DrawerTrigger class={classProp} {...rest}>
		{@render children?.()}
	</DrawerTrigger>
{:else}
	<DialogTrigger class={classProp} {...rest}>
		{@render children?.()}
	</DialogTrigger>
{/if}
