import { cn } from "../../lib/cn";
import { type OgBigIconMode, ogBigIcon } from "../variants";

export type { OgBigIconMode };

export interface OgBigIconProps {
	/** Brand name top left; one line. */
	name: string;
	/** Up to two lines. */
	title: string;
	/** One large icon image URL, cropped by the right edge. */
	icon: string;
	/** Small caps label under the name, e.g. "Icons". */
	label?: string;
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	/** Icon image URLs tiled faintly behind everything; cycles to fill the card. */
	pattern?: string[];
	mode?: OgBigIconMode;
	className?: string;
}

const PATTERN_SLOTS = 96;

/** A 1200x630 card: brand, title and body on the left, one huge icon cropped on the right. */
export function OgBigIcon({
	name,
	title,
	icon,
	label,
	description,
	logo,
	pattern = [],
	mode = "light",
	className,
}: OgBigIconProps) {
	const s = ogBigIcon({ mode });
	return (
		<div data-slot="og-big-icon" className={cn(s.root(), className)}>
			{pattern.length > 0 ? (
				<div className={s.pattern()}>
					{Array.from({ length: PATTERN_SLOTS }, (_, i) => (
						<img
							// biome-ignore lint/suspicious/noArrayIndexKey: generated from a count, so position is the identity.
							key={i}
							src={pattern[i % pattern.length]}
							alt=""
							className={s.patternIcon()}
						/>
					))}
				</div>
			) : null}
			<img src={icon} alt="" className={s.icon()} />
			<div className={s.brand()}>
				{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
				<div className={s.names()}>
					<span className={s.name()}>{name}</span>
					{label ? <span className={s.label()}>{label}</span> : null}
				</div>
			</div>
			<div className={s.body()}>
				<p className={s.title()}>{title}</p>
				{description ? <p className={s.description()}>{description}</p> : null}
			</div>
		</div>
	);
}
