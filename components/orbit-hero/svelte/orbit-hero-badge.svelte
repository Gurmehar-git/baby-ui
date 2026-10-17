<script lang="ts">
import type { ComponentProps } from "svelte";
import Badge from "../../badge/svelte/badge.svelte";
import { cn } from "../../lib/cn";
import { orbitHeroState } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof Badge> = $props();
const hero = orbitHeroState();
</script>

<!-- The pill above the headline. -->
<Badge variant="outline" {...rest} class={cn(hero.styles.badge(), classProp)} />
