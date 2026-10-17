<script lang="ts">
import type { ComponentProps } from "svelte";
import CardDescription from "../../card/svelte/card-description.svelte";
import { cn } from "../../lib/cn";
import { overviewCardState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardDescription> = $props();
const card = overviewCardState();
</script>

<CardDescription {...rest} class={cn(card.styles.description(), classProp)} />
