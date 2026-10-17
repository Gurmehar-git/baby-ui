import { cn } from "../../lib/cn";
import {
	OG_APP_ICON_DOODLES,
	type OgAppIconMode,
	ogAppIcon,
	ogAppIconDoodle,
} from "../variants";

export type { OgAppIconMode };

export interface OgAppIconProps {
	/** Glyph image URL; a white glyph reads best on the tile. */
	logo: string;
	/** Tile fill, any CSS colour; the brand colour reads best. */
	color: string;
	mode?: OgAppIconMode;
	className?: string;
}

/** A 1200x630 card: one large app icon centred, on a doodle field (light) or plain (dark). */
export function OgAppIcon({ logo, color, mode = "light", className }: OgAppIconProps) {
	const s = ogAppIcon({ mode });
	return (
		<div data-slot="og-app-icon" className={cn(s.root(), className)}>
			{OG_APP_ICON_DOODLES.map((d) => (
				<span
					key={`${d.left}-${d.top}`}
					className={cn(s.doodle(), ogAppIconDoodle({ shape: d.shape }))}
					style={{
						left: d.left,
						top: d.top,
						width: d.size,
						height: d.size,
						transform: `rotate(${d.turn}deg)`,
					}}
				/>
			))}
			<div className={s.tile()} style={{ backgroundColor: color }}>
				<span className={s.sheen()} />
				<img src={logo} alt="" className={s.logo()} />
			</div>
		</div>
	);
}
