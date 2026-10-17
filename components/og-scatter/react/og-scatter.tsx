import { cn } from "../../lib/cn";
import { OG_SCATTER_TILES, type OgScatterMode, ogScatter } from "../variants";

export type { OgScatterMode };

export interface OgScatterProps {
	/** Brand name, set as the wordmark; one line. */
	name: string;
	/** Logo image URL beside the name. */
	logo?: string;
	tagline?: string;
	/** Image URLs for the seven tiles around the mark; they repeat to fill. */
	images: string[];
	mode?: OgScatterMode;
	className?: string;
}

/** A 1200x630 brand card: the wordmark ringed by rounded image tiles, some softly blurred. */
export function OgScatter({
	name,
	logo,
	tagline,
	images,
	mode = "light",
	className,
}: OgScatterProps) {
	const s = ogScatter({ mode });
	const pics = images.filter(Boolean);
	return (
		<div data-slot="og-scatter" className={cn(s.root(), className)}>
			{pics.length
				? OG_SCATTER_TILES.map((tile, i) => (
						<img
							key={`${tile.left}-${tile.top}`}
							src={pics[i % pics.length]}
							alt=""
							className={cn(s.tile(), tile.soft && s.softTile())}
							style={{
								left: tile.left,
								top: tile.top,
								width: tile.width,
								height: tile.height,
							}}
						/>
					))
				: null}
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
