<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "../../lib/cn";
import { notificationStackState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackEmpty");
const shown = $derived(
	ctx.layout ? Object.values(ctx.layout.places).every((p) => p.depth < 0) : false,
);
</script>

<!-- Shown once every notice is dismissed. -->
<p data-slot="notification-stack-empty" data-shown={shown || undefined} aria-hidden={!shown} class={cn(ctx.styles.empty(), classProp)}>
	<span class={ctx.styles.emptyClip()}><span class={ctx.styles.emptyText()}>{@render children?.()}</span></span>
</p>
