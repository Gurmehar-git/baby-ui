<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgStatementMode, ogStatement } from "../variants";

let {
	title,
	logo,
	mode = "light",
	class: className,
}: {
	/** The statement, up to three lines, set bottom left. */
	title: string;
	/** Mark image URL, top left. */
	logo?: string;
	mode?: OgStatementMode;
	class?: string;
} = $props();

const s = $derived(ogStatement({ mode }));
</script>

<div data-slot="og-statement" class={cn(s.root(), className)}>
	{#if logo}<img src={logo} alt="" class={s.logo()} />{:else}<span></span>{/if}
	<p class={s.title()}>{title}</p>
</div>
