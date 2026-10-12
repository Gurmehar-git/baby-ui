<script lang="ts">
import type { Snippet } from "svelte";
import type { DialogSize } from "../dialog/context";
import Dialog from "../dialog/dialog.svelte";
import type { DrawerDirection } from "../drawer/context";
import Drawer from "../drawer/drawer.svelte";
import { useIsMobile } from "../lib/use-is-mobile.svelte";
import { type ResponsiveDialogVariant, setResponsiveDialog } from "./context";

let {
	children,
	open = $bindable(false),
	variant = "default",
	size = "default",
	dismissOnBackdrop = true,
	direction = "bottom",
	dismissible = true,
}: {
	children?: Snippet;
	open?: boolean;
	/** Shared frame treatment, forwarded to whichever surface renders. */
	variant?: ResponsiveDialogVariant;
	/** Desktop (Dialog) only. */
	size?: DialogSize;
	dismissOnBackdrop?: boolean;
	/** Mobile (Drawer) only. */
	direction?: DrawerDirection;
	dismissible?: boolean;
} = $props();

const mobile = useIsMobile();

setResponsiveDialog({
	get isMobile() {
		return mobile.current;
	},
	get variant() {
		return variant;
	},
});
</script>

{#if mobile.current}
	<Drawer bind:open {direction} {dismissible}>
		{@render children?.()}
	</Drawer>
{:else}
	<Dialog bind:open {size} {variant} {dismissOnBackdrop}>
		{@render children?.()}
	</Dialog>
{/if}
