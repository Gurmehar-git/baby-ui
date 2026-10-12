<script lang="ts">
import { GlitchText } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof GlitchText>>(props));
</script>

<GlitchText
	text={p.text || "Glitch"}
	size={p.size ?? "default"}
	intensity={Number(props.intensity ?? 5)}
	durationSeconds={Number(props.durationSeconds ?? 2.5)}
	baseColor={p.baseColor || undefined}
	colorA={p.colorA || undefined}
	colorB={p.colorB || undefined}
	blendMode={p.blendMode ?? "screen"}
	class="text-foreground"
/>
