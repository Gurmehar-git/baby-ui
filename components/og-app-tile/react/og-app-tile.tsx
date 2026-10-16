import { cn } from "../../lib/react/cn";
import { type OgAppTileMode, type OgAppTileTone, ogAppTile } from "./variants";

export type { OgAppTileMode, OgAppTileTone };

export interface OgAppTileProps {
	/** App or product name; one line. */
	name: string;
	/** Logo image URL, set inside the tile. */
	logo: string;
	description?: string;
	mode?: OgAppTileMode;
	tone?: OgAppTileTone;
	className?: string;
}

/** A 1200x630 card: the logo on an app tile with a soft glow, name and description below. */
export function OgAppTile({
	name,
	logo,
	description,
	mode = "light",
	tone = "chart",
	className,
}: OgAppTileProps) {
	const s = ogAppTile({ mode, tone });
	return (
		<div data-slot="og-app-tile" className={cn(s.root(), className)}>
			<span className={s.glow()} />
			<div className={s.tile()}>
				<img src={logo} alt="" className={s.logo()} />
			</div>
			<div className={s.body()}>
				<p className={s.title()}>{name}</p>
				{description ? <p className={s.description()}>{description}</p> : null}
			</div>
		</div>
	);
}
