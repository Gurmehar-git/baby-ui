<script lang="ts">
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { inboxFor } from "../magic-link-core";
import { magicLinkLoginState } from "./context";

let { class: classProp }: { class?: string } = $props();

const ctx = magicLinkLoginState("MagicLinkLoginInbox");
const inbox = $derived(inboxFor(ctx.address));
</script>

<!-- "Open Gmail" and friends, when the address belongs to a known webmail. -->
{#if inbox}
	<div class={cn(ctx.styles.actions(), classProp)}>
		<Button href={inbox.href} target="_blank" rel="noopener noreferrer">
			{ctx.labels.openInbox}
			{inbox.name}
		</Button>
	</div>
{/if}
