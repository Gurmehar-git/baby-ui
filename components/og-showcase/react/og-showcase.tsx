import { cn } from "../../lib/react/cn";
import { OG_SHOWCASE_COLUMNS, type OgShowcaseMode, ogShowcase } from "./variants";

export type { OgShowcaseMode };

export interface OgShowcaseProps {
	/** Headline, bottom left; clamps to four lines. */
	title: string;
	/** Screenshot URLs for the two columns of framed shots; they repeat to fill. */
	images: string[];
	/** Product name beside the logo. */
	site?: string;
	logo?: string;
	description?: string;
	mode?: OgShowcaseMode;
	className?: string;
}

/** A 1200x630 product card: headline left, two offset columns of framed screenshots right. */
export function OgShowcase({
	title,
	images,
	site,
	logo,
	description,
	mode = "light",
	className,
}: OgShowcaseProps) {
	const s = ogShowcase({ mode });
	const pics = images.filter(Boolean);
	return (
		<div data-slot="og-showcase" className={cn(s.root(), className)}>
			{pics.length
				? OG_SHOWCASE_COLUMNS.map((col, c) => (
						<div
							key={col.left}
							className={s.column()}
							style={{ left: col.left, top: col.top }}
						>
							{col.heights.map((height, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								<div key={`${height}-${i}`} className={s.frame()} style={{ height }}>
									<img
										src={pics[(c * 3 + i) % pics.length]}
										alt=""
										className={s.shot()}
									/>
								</div>
							))}
						</div>
					))
				: null}
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
