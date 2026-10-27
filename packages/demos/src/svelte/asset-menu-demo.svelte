<script lang="ts">
import {
	AssetMenu,
	AssetMenuContent,
	AssetMenuCopyItem,
	AssetMenuLabel,
	AssetMenuLinkItem,
	AssetMenuPreview,
	AssetMenuSeparator,
	AssetMenuTrigger,
	Button,
} from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof AssetMenu>>(props));
const MARK =
	'<svg viewBox="0 0 32 32"><path fill="currentColor" d="M5 5h9v9H5zm13 0h9v22h-9zM5 18h9v9H5z"/></svg>';
const WORDMARK = `<svg viewBox="0 0 150 32">${MARK}<text x="40" y="22">Northstar</text></svg>`;
let open = $state(false);
let status = $state("Right-click or long press the mark");

function copied(name: string, success: boolean) {
	status = success ? `${name} copied` : `Could not copy ${name.toLowerCase()}`;
}
</script>

{#snippet mark()}
	<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" class="size-6">
		<path d="M5 5h9v9H5zm13 0h9v22h-9zM5 18h9v9H5z" />
	</svg>
{/snippet}

<div class="grid place-items-center gap-3">
	<AssetMenu variant={p.variant ?? "default"} bind:open>
		<AssetMenuTrigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="xl" aria-label="Open Northstar asset actions">
					{@render mark()}
					Northstar assets
				</Button>
			{/snippet}
		</AssetMenuTrigger>
		<AssetMenuContent>
			<AssetMenuLabel>Copy</AssetMenuLabel>
			<AssetMenuCopyItem value={MARK} onCopy={(success) => copied("Mark SVG", success)}>
				<AssetMenuPreview>{@render mark()}</AssetMenuPreview>
				Mark as SVG
			</AssetMenuCopyItem>
			<AssetMenuCopyItem value={WORDMARK} onCopy={(success) => copied("Wordmark SVG", success)}>
				<AssetMenuPreview aria-hidden="true">W</AssetMenuPreview>
				Wordmark as SVG
			</AssetMenuCopyItem>
			<AssetMenuSeparator />
			<AssetMenuLinkItem href="/" onclick={() => (status = "Guidelines opened")}>
				<AssetMenuPreview aria-hidden="true">↗</AssetMenuPreview>
				Usage guidelines
			</AssetMenuLinkItem>
			<AssetMenuLinkItem href={`data:image/svg+xml,${encodeURIComponent(MARK)}`} download="northstar-mark.svg">
				<AssetMenuPreview aria-hidden="true">↓</AssetMenuPreview>
				Download mark
			</AssetMenuLinkItem>
		</AssetMenuContent>
	</AssetMenu>
	<p aria-live="polite" class="text-muted-foreground text-xs">{status}</p>
</div>
