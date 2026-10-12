<script lang="ts">
import { MorphSelect } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { TIME_ZONES } from "../data/morph-select";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof MorphSelect>>(props));
let zone = $state<string | null>("europe/zurich");
</script>

<MorphSelect label="Time zone" items={TIME_ZONES} bind:value={zone} variant={p.variant} size={p.size} />
