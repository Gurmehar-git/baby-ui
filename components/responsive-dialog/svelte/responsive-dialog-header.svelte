<script lang="ts">
import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
import DialogHeader from "../../dialog/svelte/dialog-header.svelte";
import DrawerHeader from "../../drawer/svelte/drawer-header.svelte";
import { getResponsiveDialog } from "./context";

let {
	children,
	class: classProp,
	...rest
}: { children?: Snippet; class?: string } & HTMLAttributes<HTMLDivElement> = $props();

const dialog = getResponsiveDialog();
</script>

{#if dialog.isMobile}
	<DrawerHeader class={classProp} {...rest}>
		{@render children?.()}
	</DrawerHeader>
{:else}
	<DialogHeader class={classProp} {...rest}>
		{@render children?.()}
	</DialogHeader>
{/if}
