<script lang="ts">
import { cn } from "../../lib/cn";
import { type OgPromptPhotoMode, ogPromptPhoto } from "../variants";

let {
	title,
	image,
	placeholder,
	chips = [],
	mode = "light",
	class: className,
}: {
	/** Headline over the photo, up to two lines. */
	title: string;
	/** Background photo URL; keep the middle calm so the title reads. */
	image: string;
	/** Example prompt shown in the box. */
	placeholder: string;
	/** Option chips along the bottom of the box. */
	chips?: string[];
	mode?: OgPromptPhotoMode;
	class?: string;
} = $props();

const s = $derived(ogPromptPhoto({ mode }));
</script>

<div data-slot="og-prompt-photo" class={cn(s.root(), className)}>
	<img src={image} alt="" class={s.image()} />
	<p class={s.title()}>{title}</p>
	<div class={s.card()}>
		<div class={s.field()}>
			<span class={s.caret()}></span>
			<span>{placeholder}</span>
		</div>
		<div class={s.row()}>
			<span class={s.iconChip()}>
				<svg
					viewBox="0 0 24 24"
					width="22"
					height="22"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<rect x="3" y="4" width="18" height="16" rx="3" />
					<path d="m4 17 5-5 4 4 3-3 4 4" />
					<circle cx="15.5" cy="9" r="1.5" />
				</svg>
			</span>
			{#each chips as chip (chip)}
				<span class={s.chip()}>{chip}</span>
			{/each}
			<span class={s.send()}>
				<svg
					viewBox="0 0 24 24"
					width="26"
					height="26"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
				</svg>
			</span>
		</div>
	</div>
</div>
