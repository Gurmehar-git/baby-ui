<script lang="ts">
import type { ComponentProps } from "svelte";
import CardFooter from "../../card/svelte/card-footer.svelte";

let { ...rest }: ComponentProps<typeof CardFooter> = $props();
</script>

<CardFooter {...rest} />
