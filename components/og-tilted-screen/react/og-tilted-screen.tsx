import { cn } from "../../lib/cn";
import {
	type OgTiltedScreenMode,
	type OgTiltedScreenTone,
	ogTiltedScreen,
} from "../variants";

export type { OgTiltedScreenMode, OgTiltedScreenTone };

export interface OgTiltedScreenProps {
	/** Headline, left; clamps to three lines. */
	title: string;
	/** Screenshot URL, tilted off the right edge. */
	image: string;
	/** Product name beside the logo. */
	site?: string;
	logo?: string;
	description?: string;
	mode?: OgTiltedScreenMode;
	tone?: OgTiltedScreenTone;
	className?: string;
}

/** A 1200x630 product card: headline left, one tilted screenshot right over a soft glow. */
export function OgTiltedScreen({
	title,
	image,
	site,
	logo,
	description,
	mode = "dark",
	tone = "primary",
	className,
}: OgTiltedScreenProps) {
	const s = ogTiltedScreen({ mode, tone });
	return (
		<div data-slot="og-tilted-screen" className={cn(s.root(), className)}>
			<div className={s.glow()} />
			<img src={image} alt="" className={s.screen()} />
			{logo || site ? (
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					{site ? <span className={s.site()}>{site}</span> : null}
				</div>
			) : null}
			<h1 className={s.title()}>{title}</h1>
			{description ? <p className={s.description()}>{description}</p> : null}
		</div>
	);
}
