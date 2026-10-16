import { cn } from "../../lib/react/cn";
import { type OgWordmarkMode, ogWordmark } from "./variants";

export type { OgWordmarkMode };

export interface OgWordmarkProps {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	mode?: OgWordmarkMode;
	className?: string;
}

/** A 1200x630 card with nothing but the logo and wordmark. Render it with takumi-js. */
export function OgWordmark({
	name,
	logo,
	tagline,
	mode = "light",
	className,
}: OgWordmarkProps) {
	const s = ogWordmark({ mode });
	return (
		<div data-slot="og-wordmark" className={cn(s.root(), className)}>
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
