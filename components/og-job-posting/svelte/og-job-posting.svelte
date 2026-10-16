<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import {
	OG_JOB_RINGS,
	type OgJobPostingMode,
	type OgJobPostingTone,
	ogJobPosting,
} from "./variants";

let {
	title,
	company,
	logo,
	badge,
	team,
	location,
	remote = false,
	salary,
	employment,
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	/** Role title, the headline. */
	title: string;
	company: string;
	logo?: string;
	/** Pill top right, e.g. "We're hiring". */
	badge?: string;
	/** Shown above the role, e.g. "Design team". */
	team?: string;
	location?: string;
	/** Swaps the location pin for a globe. */
	remote?: boolean;
	/** Pre-formatted range, e.g. "$160k to $200k". */
	salary?: string;
	/** e.g. "Full-time". */
	employment?: string;
	mode?: OgJobPostingMode;
	tone?: OgJobPostingTone;
	class?: string;
} = $props();

const s = $derived(ogJobPosting({ mode, tone }));
</script>

<div data-slot="og-job-posting" class={cn(s.root(), className)}>
	{#each OG_JOB_RINGS as ring (ring)}
		<div class={cn(s.ring(), ring)}></div>
	{/each}
	<div class={s.core()}></div>
	<div class={s.header()}>
		<div class={s.company()}>
			{#if logo}
				<span class={s.logoTile()}><img src={logo} alt="" class={s.logo()} /></span>
			{/if}
			<span class={s.companyName()}>{company}</span>
		</div>
		{#if badge}
			<span class={s.badge()}><svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					class={s.badgeIcon()}
				>
					<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0" />
					<path d="M16 19h6" />
					<path d="M19 16v6" />
					<path d="M6 21v-2a4 4 0 0 1 4-4h4" />
				</svg>{badge}</span>
		{/if}
	</div>
	<div class={s.body()}>
		{#if team}<span class={s.team()}>{team}</span>{/if}
		<h1 class={s.title()}>{title}</h1>
		{#if location || salary || employment}
			<div class={s.strip()}>
				{#if location}
					<span class={s.cell()}>
						{#if remote}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class={s.cellIcon()}
							>
								<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0" />
								<path d="M3.6 9h16.8" />
								<path d="M3.6 15h16.8" />
								<path d="M11.5 3a17 17 0 0 0 0 18" />
								<path d="M12.5 3a17 17 0 0 1 0 18" />
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
								class={s.cellIcon()}
							>
								<path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0" />
								<path
									d="M17.66 16.66l-4.24 4.24a2 2 0 0 1-2.83 0l-4.25-4.24a8 8 0 1 1 11.32 0z"
								/>
							</svg>
						{/if}
						<span class={s.cellText()}>{location}</span>
					</span>
				{/if}
				{#if salary}
					{#if location}<span class={s.separator()}></span>{/if}
					<span class={s.cell()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							class={s.cellIcon()}
						>
							<path
								d="M7 11a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"
							/>
							<path d="M12 14a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
							<path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
						</svg>
						<span class={s.cellText()}>{salary}</span>
					</span>
				{/if}
				{#if employment}
					{#if location || salary}<span class={s.separator()}></span>{/if}
					<span class={s.cell()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
							class={s.cellIcon()}
						>
							<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
							<path d="M12 12v.01" />
							<path d="M3 13a20 20 0 0 0 18 0" />
						</svg>
						<span class={s.cellText()}>{employment}</span>
					</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
