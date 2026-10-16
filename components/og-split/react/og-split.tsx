import { cn } from "../../lib/react/cn";
import { type OgSplitMode, ogSplit } from "./variants";

export type { OgSplitMode };

export interface OgSplitProps {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Image URL for the curved panel on the right. */
	image: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	mode?: OgSplitMode;
	className?: string;
}

/** A 1200x630 brand card: wordmark left, an image panel with a curved edge right. */
export function OgSplit({
	name,
	image,
	logo,
	tagline,
	mode = "dark",
	className,
}: OgSplitProps) {
	const s = ogSplit({ mode });
	return (
		<div data-slot="og-split" className={cn(s.root(), className)}>
			<img src={image} alt="" className={s.panel()} />
			<div className={s.mark()}>
				<div className={s.wordmark()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span className={s.name()}>{name}</span>
				</div>
				{tagline ? <p className={s.tagline()}>{tagline}</p> : null}
			</div>
		</div>
	);
}
