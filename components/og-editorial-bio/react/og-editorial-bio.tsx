import { cn } from "../../lib/cn";
import {
	type OgEditorialBioMode,
	type OgEditorialBioTone,
	ogEditorialBio,
} from "../variants";

export type { OgEditorialBioMode, OgEditorialBioTone };

export interface OgEditorialBioProps {
	/** First line, flush left. */
	name: string;
	/** The bio, one entry per line; every other line indents. Five fit under the name. */
	lines: string[];
	mode?: OgEditorialBioMode;
	tone?: OgEditorialBioTone;
	className?: string;
}

/** A 1200x630 personal card: name and bio as staggered lines over a large tone circle. */
export function OgEditorialBio({
	name,
	lines,
	mode = "light",
	tone = "chart",
	className,
}: OgEditorialBioProps) {
	const s = ogEditorialBio({ mode, tone });
	const shown = [name, ...lines].filter(Boolean).slice(0, 6);
	return (
		<div data-slot="og-editorial-bio" className={cn(s.root(), className)}>
			<div className={s.circle()} />
			<div className={s.crossX()} />
			<div className={s.crossY()} />
			<div className={s.lines()}>
				{shown.map((line, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
					<span key={`${i}-${line}`} className={cn(s.line(), i % 2 === 1 && s.indent())}>
						{line}
					</span>
				))}
			</div>
		</div>
	);
}
