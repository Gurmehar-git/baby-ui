import { cn } from "../../lib/react/cn";
import { type OgPricingMode, type OgPricingTone, ogPricing } from "./variants";

export type { OgPricingMode, OgPricingTone };

export interface OgPricingProps {
	/** Plan name above the price. */
	plan: string;
	/** Pre-formatted, e.g. "$29". */
	price: string;
	/** Up to four ticks; extras are dropped. */
	features: string[];
	/** e.g. "/month". */
	period?: string;
	/** Old price, struck through beside the period. */
	compareAt?: string;
	/** Label for the most popular treatment; passing it adds the ring, glow and badge. */
	popular?: string;
	note?: string;
	brand?: string;
	logo?: string;
	mode?: OgPricingMode;
	tone?: OgPricingTone;
	className?: string;
}

/** A 1200x630 pricing plan card. Render it to PNG with takumi-js. */
export function OgPricing({
	plan,
	price,
	features,
	period,
	compareAt,
	popular,
	note,
	brand,
	logo,
	mode = "light",
	tone = "neutral",
	className,
}: OgPricingProps) {
	const s = ogPricing({ mode, tone, popular: Boolean(popular) });
	return (
		<div data-slot="og-pricing" className={cn(s.root(), className)}>
			<div className={s.ledger()} />
			<div className={s.glow()} />
			<div className={s.left()}>
				{brand || logo ? (
					<div className={s.brand()}>
						{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
						{brand ? <span>{brand}</span> : null}
					</div>
				) : null}
				<span className={s.plan()}>{plan}</span>
				<div className={s.priceRow()}>
					<span className={s.price()}>{price}</span>
					{compareAt || period ? (
						<div className={s.priceMeta()}>
							{compareAt ? <span className={s.compare()}>{compareAt}</span> : null}
							{period ? <span className={s.period()}>{period}</span> : null}
						</div>
					) : null}
				</div>
				{note ? <p className={s.note()}>{note}</p> : null}
			</div>
			<div className={s.card()}>
				{popular ? (
					<span className={s.popular()}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className={s.star()}
							aria-hidden="true"
						>
							<path d="M12 17.75l-6.17 3.24 1.18-6.87-5-4.87 6.9-1 3.09-6.25 3.09 6.25 6.9 1-5 4.87 1.18 6.87z" />
						</svg>
						{popular}
					</span>
				) : null}
				{features.slice(0, 4).map((feature) => (
					<div key={feature} className={s.feature()}>
						<span className={s.tick()}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={s.check()}
								aria-hidden="true"
							>
								<path d="M5 12l5 5l10-10" />
							</svg>
						</span>
						<span className={s.featureText()}>{feature}</span>
					</div>
				))}
			</div>
		</div>
	);
}
