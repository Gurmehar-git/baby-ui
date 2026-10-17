<script lang="ts">
import type { ComponentProps } from "svelte";
import CardHeader from "../../card/svelte/card-header.svelte";
import { cn } from "../../lib/cn";
import { scoreCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardHeader> = $props();
const card = scoreCardState();
</script>

<CardHeader {...rest} class={cn(card.styles.header(), classProp)} />
