<script lang="ts">
import type { ComponentProps } from "svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import { cn } from "../../lib/cn";
import { scoreCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardContent> = $props();
const card = scoreCardState();
</script>

<CardContent {...rest} class={cn(card.styles.body(), classProp)} />
