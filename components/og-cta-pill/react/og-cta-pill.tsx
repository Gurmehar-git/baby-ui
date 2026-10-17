import { cn } from "../../lib/cn";
import { type OgCtaPillMode, type OgCtaPillTone, ogCtaPill } from "../variants";

export type { OgCtaPillMode, OgCtaPillTone };

export interface OgCtaPillProps {
	/** The call to action inside the pill; one short line. */
	label: string;
	/** Logo image URL above the pill; a white mark reads best on the field. */
	logo?: string;
	mode?: OgCtaPillMode;
	tone?: OgCtaPillTone;
	className?: string;
}

/** A 1200x630 card: one huge call-to-action pill on a grained colour field, lit from below. */
export function OgCtaPill({
	label,
	logo,
	mode = "light",
	tone = "chart",
	className,
}: OgCtaPillProps) {
	const s = ogCtaPill({ mode, tone });
	return (
		<div data-slot="og-cta-pill" className={cn(s.root(), className)}>
			<span className={s.texture()} />
			<span className={s.glow()} />
			{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
			<div className={s.pill()}>
				<span className={s.label()}>{label}</span>
			</div>
		</div>
	);
}
