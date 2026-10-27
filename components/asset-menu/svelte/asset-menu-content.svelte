<script lang="ts">
import type { ComponentProps } from "svelte";
import ContextMenuContent from "../../context-menu/svelte/context-menu-content.svelte";
import { cn } from "../../lib/cn";
import { assetMenu } from "../variants";
import { getAssetMenu } from "./context";

let { class: classProp, ...rest }: ComponentProps<typeof ContextMenuContent> = $props();
const context = getAssetMenu();
const s = $derived(assetMenu({ variant: context.variant }));
</script>

<ContextMenuContent data-slot="asset-menu-content" class={cn(s.content(), classProp)} {...rest} />
