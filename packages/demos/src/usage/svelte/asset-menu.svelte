<script lang="ts">
import {
	AssetMenu,
	AssetMenuContent,
	AssetMenuCopyItem,
	AssetMenuLinkItem,
	AssetMenuTrigger,
	Button,
} from "@baby-ui/svelte";

let { svg }: { svg: string } = $props();
let open = $state(false);
</script>

<AssetMenu bind:open>
	<AssetMenuTrigger>
		{#snippet child({ props })}<Button {...props} variant="outline">Asset actions</Button>{/snippet}
	</AssetMenuTrigger>
	<AssetMenuContent>
		<AssetMenuCopyItem value={svg}>Copy SVG</AssetMenuCopyItem>
		<AssetMenuLinkItem href="/assets.zip" download>Download assets</AssetMenuLinkItem>
	</AssetMenuContent>
</AssetMenu>
