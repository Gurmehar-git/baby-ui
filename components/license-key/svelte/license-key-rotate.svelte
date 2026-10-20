<script lang="ts">
import type { Snippet } from "svelte";
import Button from "../../button/svelte/button.svelte";
import { cn } from "../../lib/cn";
import { LICENSE_KEY_LABELS } from "../license-core";
import { getLicenseKey } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = getLicenseKey();
const open = $derived(ctx.status !== "idle");
</script>

<!-- Opens and closes the confirm step; it never regenerates on its own. -->
<Button
	id={ctx.triggerId}
	variant="ghost"
	size="sm"
	aria-expanded={open}
	aria-controls={ctx.confirmId}
	disabled={ctx.status === "rotating"}
	onclick={() => ctx.setStatus(open ? "idle" : "confirming")}
	class={cn("group/rotate", classProp)}
>
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		data-spinning={ctx.status === "rotating" ? "" : undefined}
		class={ctx.styles.rotateIcon()}
	>
		<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />
	</svg>
	{#if children}{@render children()}{:else}{LICENSE_KEY_LABELS.rotate}{/if}
</Button>
