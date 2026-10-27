<script lang="ts">
import type { HTMLAttributes } from "svelte/elements";
import { cn } from "../../lib/cn";
import { assetMenu } from "../variants";
import { getAssetMenu } from "./context";

let { class: classProp, ...rest }: HTMLAttributes<HTMLSpanElement> = $props();
const context = getAssetMenu();
const s = $derived(assetMenu({ variant: context.variant }));
</script>

<span data-slot="asset-menu-preview" class={cn(s.preview(), classProp)} {...rest}></span>
