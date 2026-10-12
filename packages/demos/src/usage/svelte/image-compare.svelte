<script lang="ts">
import { ImageCompare } from "@baby-ui/svelte";

let { beforeSrc, afterSrc }: { beforeSrc: string; afterSrc: string } = $props();
</script>

<ImageCompare>
	{#snippet before()}<img src={beforeSrc} alt="Before retouching" />{/snippet}
	{#snippet after()}<img src={afterSrc} alt="After retouching" />{/snippet}
</ImageCompare>
