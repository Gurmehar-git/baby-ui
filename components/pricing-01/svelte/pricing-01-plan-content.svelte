<script lang="ts">
import type { ComponentProps } from "svelte";
import CardContent from "../../card/svelte/card-content.svelte";
import { cn } from "../../lib/cn";
import { pricing01State } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof CardContent> = $props();
const pricing = pricing01State();
</script>

<CardContent {...rest} class={cn(pricing.styles.body(), classProp)} />
