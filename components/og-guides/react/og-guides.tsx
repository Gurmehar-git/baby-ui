import { cn } from "../../lib/react/cn";
import { type OgGuidesMode, ogGuides } from "./variants";

export type { OgGuidesMode };

export interface OgGuidesProps {
	/** Up to two lines, top left. */
	title: string;
	/** Up to four lines under the title. */
	description?: string;
	/** Mark image URL, bottom right inside the guides. */
	logo?: string;
	mode?: OgGuidesMode;
	className?: string;
}

/** A 1200x630 card: title and body inside crossing edge guides, the mark bottom right. */
export function OgGuides({
	title,
	description,
	logo,
	mode = "dark",
	className,
}: OgGuidesProps) {
	const s = ogGuides({ mode });
	return (
		<div data-slot="og-guides" className={cn(s.root(), className)}>
			<span className={s.top()} />
			<span className={s.bottom()} />
			<span className={s.left()} />
			<span className={s.right()} />
			<p className={s.title()}>{title}</p>
			{description ? <p className={s.description()}>{description}</p> : null}
			{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
		</div>
	);
}
