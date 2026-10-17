<script lang="ts">
import type { ComponentProps } from "svelte";
import CardHeader from "../../card/svelte/card-header.svelte";

let { ...rest }: ComponentProps<typeof CardHeader> = $props();
</script>

<CardHeader {...rest} />
