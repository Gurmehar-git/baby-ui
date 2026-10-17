<script lang="ts">
import { cn } from "../../lib/cn";
import {
	type OgNewsletterIssueMode,
	type OgNewsletterIssueTone,
	ogNewsletterIssue,
} from "../variants";

let {
	publication,
	headline,
	issue,
	date,
	logo,
	inside = [],
	insideLabel = "In this issue",
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	/** Newsletter name, set small in the masthead. */
	publication: string;
	/** Lead story headline, the focal point; clamps to three lines, two with a list. */
	headline: string;
	/** Pre-formatted issue label, e.g. "No. 42". */
	issue?: string;
	date?: string;
	logo?: string;
	/** Up to three other stories, numbered under the lead. */
	inside?: string[];
	insideLabel?: string;
	mode?: OgNewsletterIssueMode;
	tone?: OgNewsletterIssueTone;
	class?: string;
} = $props();

const items = $derived(inside.filter(Boolean).slice(0, 3));
const s = $derived(ogNewsletterIssue({ mode, tone, list: items.length > 0 }));
const issueLine = $derived([issue, date].filter(Boolean).join(" · "));
</script>

<div data-slot="og-newsletter-issue" class={cn(s.root(), className)}>
	<div class={s.masthead()}>
		<div class={s.brand()}>
			{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
			<span class={s.publication()}>{publication}</span>
		</div>
		{#if issueLine}<span class={s.issue()}>{issueLine}</span>{/if}
	</div>
	<h1 class={s.headline()}>{headline}</h1>
	{#if items.length}
		<div class={s.inside()}>
			<span class={s.insideLabel()}>{insideLabel}</span>
			<div class={s.list()}>
				{#each items as item, i (i)}
					<div class={s.item()}>
						<span class={s.number()}>{String(i + 1).padStart(2, "0")}</span>
						<span class={s.itemText()}>{item}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
