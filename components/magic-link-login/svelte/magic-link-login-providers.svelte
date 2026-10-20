<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import type { MagicLinkProvider } from "../magic-link-core";
import { magicLinkLoginState } from "./context";

let {
	providers,
	onProvider,
	pending,
	class: classProp,
}: {
	providers: MagicLinkProvider<Snippet>[];
	onProvider?: (id: string) => void;
	/** The provider whose redirect is in flight; its button shows a spinner. */
	pending?: string;
	class?: string;
} = $props();

const ctx = magicLinkLoginState("MagicLinkLoginProviders");
</script>

<!-- One button per OAuth provider, then an "or" rule. -->
{#if providers.length > 0}
	<div class={cn(ctx.styles.providers(), classProp)}>
		{#each providers as p (p.id)}
			<Button
				variant="outline"
				class={ctx.styles.provider()}
				disabled={ctx.status === "sending" || (pending !== undefined && pending !== p.id)}
				loading={pending === p.id}
				loadingLabel="{ctx.labels.continueWith} {p.label}"
				onclick={() => onProvider?.(p.id)}
			>
				{@render p.icon?.()}
				{ctx.labels.continueWith}
				{p.label}
			</Button>
		{/each}
	</div>
	<div class={ctx.styles.divider()}>{ctx.labels.or}</div>
{/if}
