<script lang="ts">
import type { Snippet } from "svelte";
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { notificationStackState } from "./context";

let { class: classProp, children }: { class?: string; children?: Snippet } = $props();
const ctx = notificationStackState("NotificationStackBadge");
</script>

<!-- The small label in the corner, e.g. "Notice". -->
<Badge variant="outline" size="sm" class={cn(ctx.styles.badge(), classProp)}>
	{@render children?.()}
</Badge>
