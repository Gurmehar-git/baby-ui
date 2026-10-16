<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { type OgPromptMode, type OgPromptTone, ogPrompt } from "./variants";

let {
	name,
	placeholder,
	description,
	logo,
	mode = "dark",
	tone = "chart",
	class: className,
}: {
	/** Brand name set as the wordmark; one line. */
	name: string;
	/** Text already typed in the prompt box. */
	placeholder: string;
	/** One line under the wordmark. */
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgPromptMode;
	tone?: OgPromptTone;
	class?: string;
} = $props();

const s = $derived(ogPrompt({ mode, tone }));
</script>

<div data-slot="og-prompt" class={cn(s.root(), className)}>
	<span class={s.wash()}></span>
	<span class={s.aura()}></span>
	<div class={s.brand()}>
		{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
		<span class={s.name()}>{name}</span>
	</div>
	{#if description}<p class={s.description()}>{description}</p>{/if}
	<div class={s.box()}>
		<div class={s.field()}>
			<span>{placeholder}</span>
			<span class={s.caret()}></span>
		</div>
		<span class={s.send()}>
			<svg
				viewBox="0 0 24 24"
				width="36"
				height="36"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 19V5M5 12l7-7 7 7" />
			</svg>
		</span>
	</div>
</div>
