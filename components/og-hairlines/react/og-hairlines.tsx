import { cn } from "../../lib/react/cn";
import { type OgHairlinesMode, ogHairlines } from "./variants";

export type { OgHairlinesMode };

export interface OgHairlinesProps {
	/** Brand name above the title; one line. */
	name: string;
	/** Up to two lines, centred. */
	title: string;
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgHairlinesMode;
	className?: string;
}

/** A 1200x630 card: centred brand, title and description inside crossing hairline guides. */
export function OgHairlines({
	name,
	title,
	description,
	logo,
	mode = "light",
	className,
}: OgHairlinesProps) {
	const s = ogHairlines({ mode });
	return (
		<div data-slot="og-hairlines" className={cn(s.root(), className)}>
			<span className={s.top()} />
			<span className={s.bottom()} />
			<span className={s.left()} />
			<span className={s.right()} />
			<div className={s.brand()}>
				{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
				<span className={s.name()}>{name}</span>
			</div>
			<p className={s.title()}>{title}</p>
			{description ? <p className={s.description()}>{description}</p> : null}
		</div>
	);
}
