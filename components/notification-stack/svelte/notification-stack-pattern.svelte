<script lang="ts">
import { cn } from "../../lib/cn";
import { NOTIFICATION_PATTERNS } from "../patterns";
import type { NotificationPatternName } from "../variants";
import { notificationStackState } from "./context";

let {
	pattern = "orbit",
	class: classProp,
}: { pattern?: NotificationPatternName; class?: string } = $props();
const ctx = notificationStackState("NotificationStackPattern");
const art = $derived(NOTIFICATION_PATTERNS[pattern]);
</script>

<!-- Quiet line art in the card's top-right corner, fading out towards the text. -->
<svg viewBox="0 0 220 160" aria-hidden="true" class={cn(ctx.styles.pattern(), classProp)}>
	{#each art.lines as d (d)}
		<path {d} />
	{/each}
	{#each art.rects as r (`${r.x}-${r.y}`)}
		<rect x={r.x} y={r.y} width={r.width} height={r.height} class={ctx.styles.patternFill()} />
	{/each}
	{#each art.circles as c (`${c.cx}-${c.cy}-${c.r}`)}
		<circle cx={c.cx} cy={c.cy} r={c.r} class={c.dot ? ctx.styles.patternDot() : undefined} />
	{/each}
</svg>
