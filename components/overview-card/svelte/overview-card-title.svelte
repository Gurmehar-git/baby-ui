<script lang="ts">
import type { ComponentProps } from "svelte";
import CardTitle from "../../card/svelte/card-title.svelte";
import { cn } from "../../lib/cn";
import { overviewCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardTitle> = $props();
const card = overviewCardState();
</script>

<CardTitle {...rest} class={cn(card.styles.title(), classProp)} />
