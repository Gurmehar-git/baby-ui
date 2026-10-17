<script lang="ts">
import type { ComponentProps } from "svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import { cn } from "../../lib/cn";
import { statCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardHeader> = $props();
const card = statCardState();
</script>

<CardHeader {...rest} class={cn(card.styles.header(), classProp)} />
