<script lang="ts">
import { TypingText } from "@baby-ui/svelte";
import type { ComponentProps } from "svelte";
import { controlProps } from "../data/preview-props";

let { props = {} }: { props?: Record<string, unknown> } = $props();
const p = $derived(controlProps<ComponentProps<typeof TypingText>>(props));
</script>

{#key String(props.smooth ?? "") + String(props.stumbles ?? "")}
	<TypingText
		text={p.text || "Creates a typing effect for given text"}
		delay={Number(props.delay ?? 32)}
		repeat={props.repeat !== false}
		waitMs={Number(props.waitMs ?? 1000)}
		smooth={props.smooth === true}
		fadeDurationMs={Number(props.fadeDurationMs ?? 300)}
		grow={props.grow === true}
		hideCursorOnComplete={props.hideCursorOnComplete === true}
		stumbles={props.stumbles === true}
		size={p.size ?? "default"}
		class="text-foreground"
	/>
{/key}
