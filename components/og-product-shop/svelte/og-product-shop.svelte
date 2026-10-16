<script lang="ts">
import { cn } from "../../lib/svelte/cn";
import { ogProductStars } from "./stars";
import {
	type OgProductShopMode,
	type OgProductShopTone,
	ogProductShop,
} from "./variants";

let {
	name,
	image,
	price,
	comparePrice,
	discount,
	store,
	logo,
	rating,
	reviews,
	stock,
	badge,
	mode = "light",
	tone = "neutral",
	class: className,
}: {
	name: string;
	/** Product image URL; transparent PNGs sit best on the tinted panel. */
	image: string;
	/** Pre-formatted, e.g. "$129". */
	price: string;
	/** Pre-formatted original price, struck through beside `price`. */
	comparePrice?: string;
	/** Sticker on the panel, e.g. "-20%". */
	discount?: string;
	store?: string;
	logo?: string;
	/** 0 to 5, drawn to the nearest half star. */
	rating?: number;
	/** Pre-formatted, e.g. "1,204 reviews". */
	reviews?: string;
	/** Availability line, e.g. "In stock". */
	stock?: string;
	/** Pill on the panel, e.g. "New arrival". */
	badge?: string;
	mode?: OgProductShopMode;
	tone?: OgProductShopTone;
	class?: string;
} = $props();

const STAR =
	"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z";
const HALF = "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253z";

const s = $derived(ogProductShop({ mode, tone }));
</script>

<div data-slot="og-product-shop" class={cn(s.root(), className)}>
	<div class={s.content()}>
		{#if store || logo}
			<div class={s.store()}>
				{#if logo}<img src={logo} alt="" class={s.logo()} />{/if}
				{#if store}<span class={s.storeName()}>{store}</span>{/if}
			</div>
		{/if}
		<div class={s.body()}>
			<h1 class={s.name()}>{name}</h1>
			{#if rating !== undefined || reviews}
				<div class={s.rating()}>
					{#if rating !== undefined}
						<div class={s.stars()}>
							{#each ogProductStars(rating) as state, i (i)}
								<svg
									aria-hidden="true"
									width="30"
									height="30"
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
						<span class={s.score()}>{rating.toFixed(1)}</span>
					{/if}
					{#if reviews}<span class={s.reviews()}>{reviews}</span>{/if}
				</div>
			{/if}
			<div class={s.priceRow()}>
				<span class={s.price()}>{price}</span>
				{#if comparePrice}<span class={s.compare()}>{comparePrice}</span>{/if}
			</div>
		</div>
		{#if stock}
			<div class={s.stock()}>
				<span class={s.stockDot()}></span>
				<span class={s.stockText()}>{stock}</span>
			</div>
		{/if}
	</div>
	<div class={s.panel()}>
		<div class={s.ring()}></div>
		<div class={s.disc()}></div>
		<img src={image} alt="" class={s.image()} />
		{#if badge}<span class={s.badge()}>{badge}</span>{/if}
		{#if discount}<span class={s.sticker()}>{discount}</span>{/if}
	</div>
</div>
