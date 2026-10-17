import { cn } from "../../lib/cn";
import {
	OG_PAPER_WINDOW_LIGHTS,
	type OgPaperWindowMode,
	ogPaperWindow,
	ogPaperWindowLight,
} from "../variants";

export type { OgPaperWindowMode };

export interface OgPaperWindowProps {
	/** Brand name set as the wordmark; one line. */
	name: string;
	/** Up to three lines in the serif. */
	title: string;
	/** Artwork URL behind the window. */
	image: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgPaperWindowMode;
	className?: string;
}

/** A 1200x630 card: a paper window with traffic lights and serif copy lying over artwork. */
export function OgPaperWindow({
	name,
	title,
	image,
	logo,
	mode = "light",
	className,
}: OgPaperWindowProps) {
	const s = ogPaperWindow({ mode });
	return (
		<div data-slot="og-paper-window" className={cn(s.root(), className)}>
			<img src={image} alt="" className={s.image()} />
			<div className={s.paper()}>
				<div className={s.lights()}>
					{OG_PAPER_WINDOW_LIGHTS.map((button) => (
						<span
							key={button}
							className={cn(s.light(), ogPaperWindowLight({ button }))}
						/>
					))}
				</div>
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span className={s.name()}>{name}</span>
				</div>
				<p className={s.title()}>{title}</p>
			</div>
		</div>
	);
}
