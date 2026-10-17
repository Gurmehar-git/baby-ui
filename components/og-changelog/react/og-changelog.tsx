import { cn } from "../../lib/cn";
import {
	OG_CHANGELOG_ICONS,
	type OgChangelogKind,
	type OgChangelogMode,
	type OgChangelogTone,
	ogChangelog,
	ogChangelogMarker,
} from "../variants";

export type { OgChangelogKind, OgChangelogMode, OgChangelogTone };

export interface OgChangelogHighlight {
	kind: OgChangelogKind;
	text: string;
	/** Marker text; defaults to the capitalised kind. */
	label?: string;
}

export interface OgChangelogProps {
	/** Release version, e.g. "v2.4.0"; also drawn as the background numeral. */
	version: string;
	headline: string;
	/** Product name shown top left. */
	site: string;
	logo?: string;
	/** Pre-formatted release date. */
	date?: string;
	/** Up to three entries; extra entries are dropped. */
	highlights?: OgChangelogHighlight[];
	mode?: OgChangelogMode;
	tone?: OgChangelogTone;
	className?: string;
}

/** A 1200x630 release card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgChangelog({
	version,
	headline,
	site,
	logo,
	date,
	highlights,
	mode = "light",
	tone = "neutral",
	className,
}: OgChangelogProps) {
	const s = ogChangelog({ mode, tone });
	const items = highlights?.slice(0, 3) ?? [];
	return (
		<div data-slot="og-changelog" className={cn(s.root(), className)}>
			<div className={s.ghost()}>{version}</div>
			<div className={s.stub()}>
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span className={s.site()}>{site}</span>
				</div>
				<div className={s.pill()}>
					<span className={s.pillText()}>{version}</span>
				</div>
				{date ? <div className={s.date()}>{date}</div> : null}
				<div className={s.rail()}>
					<span className={s.railHead()} />
					<span className={s.railLine()} />
					<span className={s.railDot()} />
					<span className={s.railLine()} />
					<span className={s.railDot()} />
					<span className={s.railLine()} />
					<span className={s.railDot()} />
				</div>
			</div>
			<div className={cn(s.notch(), "-top-7")} />
			<div className={cn(s.notch(), "-bottom-7")} />
			<div className={s.main()}>
				<h1 className={s.headline()}>{headline}</h1>
				{items.length ? (
					<div className={s.list()}>
						{items.map((item, i) => {
							const m = ogChangelogMarker({ kind: item.kind });
							return (
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								<div key={`${i}-${item.text}`} className={s.item()}>
									<span className={m.marker()}>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className={m.icon()}
											aria-hidden="true"
										>
											{OG_CHANGELOG_ICONS[item.kind].map((d) => (
												<path key={d} d={d} />
											))}
										</svg>
										{item.label ?? item.kind.charAt(0).toUpperCase() + item.kind.slice(1)}
									</span>
									<span className={s.text()}>{item.text}</span>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
		</div>
	);
}
