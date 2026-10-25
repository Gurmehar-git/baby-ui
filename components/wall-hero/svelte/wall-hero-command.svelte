<script lang="ts">
import CopyButton from "../../copy-button/svelte/copy-button.svelte";
import { cn } from "../../lib/cn";
import { wallHeroState } from "./context";

let {
	command,
	prompt = "$",
	copyLabel = "Copy command",
	class: classProp,
}: { command: string; prompt?: string; copyLabel?: string; class?: string } = $props();
const ctx = wallHeroState("WallHeroCommand");
</script>

<!-- An install command in a pill, with a copy button. -->
<div data-slot="wall-hero-command" class={cn(ctx.styles.command(), classProp)}>
	<span aria-hidden="true" class={ctx.styles.prompt()}>{prompt}</span>
	<code class={ctx.styles.commandText()}>{command}</code>
	<CopyButton text={command} iconOnly label={copyLabel} class={ctx.styles.copy()} />
</div>
