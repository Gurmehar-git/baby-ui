import { cn } from "../../lib/react/cn";
import {
	type OgProductLaunchLayout,
	type OgProductLaunchMode,
	type OgProductLaunchTone,
	ogProductLaunch,
} from "./variants";

export type { OgProductLaunchLayout, OgProductLaunchMode, OgProductLaunchTone };

export interface OgProductLaunchProps {
	/** Product name, the headline. */
	name: string;
	tagline?: string;
	/** Filled launch badge above the name, e.g. "Now available". */
	badge?: string;
	brand?: string;
	logo?: string;
	/** Plain muted line under the tagline (split layout only). */
	url?: string;
	/** Absolute image URL, shown as a floating rounded shot that bleeds off the canvas. */
	screenshot?: string;
	mode?: OgProductLaunchMode;
	tone?: OgProductLaunchTone;
	layout?: OgProductLaunchLayout;
	className?: string;
}

/** A 1200x630 product launch card led by a floating screenshot. Render it to PNG with takumi-js. */
export function OgProductLaunch({
	name,
	tagline,
	badge,
	brand,
	logo,
	url,
	screenshot,
	mode = "light",
	tone = "neutral",
	layout = "split",
	className,
}: OgProductLaunchProps) {
	const s = ogProductLaunch({ mode, tone, layout });
	return (
		<div data-slot="og-product-launch" className={cn(s.root(), className)}>
			<div className={s.shot()}>
				<div className={s.frame()}>
					{screenshot ? <img src={screenshot} alt="" className={s.image()} /> : null}
				</div>
			</div>
			<div className={s.content()}>
				{brand || logo ? (
					<div className={s.brand()}>
						{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
						{brand ? <span className={s.brandName()}>{brand}</span> : null}
					</div>
				) : null}
				<div className={s.body()}>
					{badge ? <span className={s.badge()}>{badge}</span> : null}
					<h1 className={s.name()}>{name}</h1>
					{tagline ? <p className={s.tagline()}>{tagline}</p> : null}
					{url ? <span className={s.url()}>{url}</span> : null}
				</div>
			</div>
		</div>
	);
}
