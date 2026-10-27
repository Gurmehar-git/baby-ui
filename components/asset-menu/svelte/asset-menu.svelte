<script lang="ts">
import type { Snippet } from "svelte";
import ContextMenu from "../../context-menu/svelte/context-menu.svelte";
import type { AssetMenuVariant } from "../variants";
import { setAssetMenu } from "./context";

let {
	children,
	variant = "default",
	defaultOpen = false,
	open = $bindable(defaultOpen),
	onOpenChange,
}: {
	children: Snippet;
	variant?: AssetMenuVariant;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
} = $props();

setAssetMenu({
	get variant() {
		return variant;
	},
});
</script>

<ContextMenu bind:open {onOpenChange}>
	{@render children()}
</ContextMenu>
