import { cn } from "../../lib/cn";
import { ogProductStars } from "../stars";
import {
	type OgProductShopMode,
	type OgProductShopStar,
	type OgProductShopTone,
	ogProductShop,
} from "../variants";

export type { OgProductShopMode, OgProductShopStar, OgProductShopTone };

export interface OgProductShopProps {
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
	className?: string;
}

const STAR =
	"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z";
const HALF = "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253z";

/** A 1200x630 product card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgProductShop({
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
	className,
}: OgProductShopProps) {
	const s = ogProductShop({ mode, tone });
	return (
		<div data-slot="og-product-shop" className={cn(s.root(), className)}>
			<div className={s.content()}>
				{store || logo ? (
					<div className={s.store()}>
						{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
						{store ? <span className={s.storeName()}>{store}</span> : null}
					</div>
				) : null}
				<div className={s.body()}>
					<h1 className={s.name()}>{name}</h1>
					{rating !== undefined || reviews ? (
						<div className={s.rating()}>
							{rating !== undefined ? (
								<div className={s.stars()}>
									{ogProductStars(rating).map((state, i) => (
										<svg
											aria-hidden="true"
											// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
											key={i}
											width="30"
											height="30"
											viewBox="0 0 24 24"
											fill={state === "half" ? "none" : "currentColor"}
											stroke="currentColor"
											strokeWidth="2"
											strokeLinejoin="round"
											className={s.star({ star: state })}
										>
											<path d={STAR} />
											{state === "half" ? <path d={HALF} fill="currentColor" /> : null}
										</svg>
									))}
								</div>
							) : null}
							{rating !== undefined ? (
								<span className={s.score()}>{rating.toFixed(1)}</span>
							) : null}
							{reviews ? <span className={s.reviews()}>{reviews}</span> : null}
						</div>
					) : null}
					<div className={s.priceRow()}>
						<span className={s.price()}>{price}</span>
						{comparePrice ? <span className={s.compare()}>{comparePrice}</span> : null}
					</div>
				</div>
				{stock ? (
					<div className={s.stock()}>
						<span className={s.stockDot()} />
						<span className={s.stockText()}>{stock}</span>
					</div>
				) : null}
			</div>
			<div className={s.panel()}>
				<div className={s.ring()} />
				<div className={s.disc()} />
				<img src={image} alt="" className={s.image()} />
				{badge ? <span className={s.badge()}>{badge}</span> : null}
				{discount ? <span className={s.sticker()}>{discount}</span> : null}
			</div>
		</div>
	);
}
