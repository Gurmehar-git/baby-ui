<script lang="ts">
import type { InfiniteImageItem } from "./variants";

let { items }: { items: InfiniteImageItem[] } = $props();
</script>

<ul class="sr-only">
	{#each items as item, index (index)}
		<li>
			{item.title ? `${item.title}: ` : ""}{item.alt}{item.caption ? `, ${item.caption}` : ""}
		</li>
	{/each}
</ul>
