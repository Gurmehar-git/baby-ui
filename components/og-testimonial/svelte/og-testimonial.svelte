<script lang="ts">
import { cn } from "../../lib/cn";
import { ogTestimonialStars } from "../stars";
import {
	type OgTestimonialAlign,
	type OgTestimonialMode,
	type OgTestimonialTone,
	ogTestimonial,
} from "../variants";

let {
	quote,
	author,
	company,
	companyLogo,
	rating,
	mode = "light",
	tone = "neutral",
	align = "left",
	class: className,
}: {
	/** The quote itself, the focal point; clamps to four lines. */
	quote: string;
	author: { name: string; role?: string; avatar?: string };
	company?: string;
	/** Company logo URL, end of the author row. */
	companyLogo?: string;
	/** 0 to 5, drawn to the nearest half star. */
	rating?: number;
	mode?: OgTestimonialMode;
	tone?: OgTestimonialTone;
	align?: OgTestimonialAlign;
	class?: string;
} = $props();

const STAR =
	"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z";
const HALF = "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253z";

const s = $derived(ogTestimonial({ mode, tone, align }));
const byline = $derived([author.role, company].filter(Boolean).join(" · "));
</script>

<div data-slot="og-testimonial" class={cn(s.root(), className)}>
	<div class={s.header()}>
		<span aria-hidden="true" class={s.mark()}>“</span>
		{#if rating !== undefined}
			<div class={s.stars()}>
			{#each ogTestimonialStars(rating) as state, i (i)}
				<svg
					aria-hidden="true"
					width="22"
					height="22"
					viewBox="0 0 24 24"
					fill={state === "half" ? "none" : "currentColor"}
					stroke="currentColor"
					stroke-width="2"
					stroke-linejoin="round"
					class={s.star({ star: state })}
				>
					<path d={STAR} />
					{#if state === "half"}<path d={HALF} fill="currentColor" />{/if}
				</svg>
			{/each}
			</div>
		{/if}
	</div>
	<p class={s.quote()}>{quote}</p>
	<div class={s.footer()}>
		{#if author.avatar}<img src={author.avatar} alt="" class={s.avatar()} />{/if}
		<div class={s.person()}>
			<span class={s.name()}>{author.name}</span>
			{#if byline}<span class={s.role()}>{byline}</span>{/if}
		</div>
		{#if companyLogo}<img src={companyLogo} alt="" class={s.logo()} />{/if}
	</div>
</div>
