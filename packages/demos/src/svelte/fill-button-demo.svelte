<script lang="ts">
import { FillButton } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof FillButton>>(props));
</script>

<FillButton tone={p.tone ?? "soft"} size={p.size ?? "default"}>
	Get started
</FillButton>
