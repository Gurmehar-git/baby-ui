<script lang="ts">
import type { ComponentProps } from "svelte";
import Empty from "../../empty/svelte/empty.svelte";
import { cn } from "../../lib/cn";

let { class: classProp, ...rest }: ComponentProps<typeof Empty> = $props();
</script>

<!-- Placeholder before the first turn: an Empty, so compose it from EmptyHeader, EmptyTitle and friends. -->
<Empty data-slot="conversation-empty" size="sm" {...rest} class={cn("min-h-48", classProp)} />
