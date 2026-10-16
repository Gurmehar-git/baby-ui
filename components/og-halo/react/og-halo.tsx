import { cn } from "../../lib/react/cn";
import { type OgHaloMode, type OgHaloTone, ogHalo } from "./variants";

export type { OgHaloMode, OgHaloTone };

export interface OgHaloProps {
	/** Mark image URL, centred over the halo; a dark mark on the dark card reads as a silhouette. */
	logo: string;
	mode?: OgHaloMode;
	tone?: OgHaloTone;
	className?: string;
}

/** A 1200x630 card: one mark centred in a soft halo of light. */
export function OgHalo({
	logo,
	mode = "dark",
	tone = "neutral",
	className,
}: OgHaloProps) {
	const s = ogHalo({ mode, tone });
	return (
		<div data-slot="og-halo" className={cn(s.root(), className)}>
			<span className={s.halo()} />
			<img src={logo} alt="" className={s.logo()} />
		</div>
	);
}
