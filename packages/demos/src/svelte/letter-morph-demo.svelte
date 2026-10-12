<script lang="ts">
import { Button, LetterMorph } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof LetterMorph>>(props));
const STEPS = ["Publish", "Publishing", "Published"];
let step = $state(0);
</script>

<Button variant="default" onclick={() => (step = (step + 1) % STEPS.length)}>
	<LetterMorph text={STEPS[step] ?? ""} variant={p.variant} size={p.size} />
</Button>
