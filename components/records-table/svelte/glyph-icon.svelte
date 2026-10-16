<script lang="ts">
import type { Glyph } from "./types";

let { glyphs, size = 14 }: { glyphs: Glyph[]; size?: number } = $props();
</script>

<span class="shrink-0 text-muted-foreground">
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#each glyphs as shape, i (i)}
			{#if shape.kind === "circle"}
				<circle cx={shape.cx} cy={shape.cy} r={shape.r} />
			{:else if shape.kind === "ellipse"}
				<ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />
			{:else if shape.kind === "rect"}
				<rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />
			{:else}
				<path d={shape.d} />
			{/if}
		{/each}
	</svg>
</span>
