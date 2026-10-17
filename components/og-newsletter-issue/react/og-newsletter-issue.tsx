import { cn } from "../../lib/cn";
import {
	type OgNewsletterIssueMode,
	type OgNewsletterIssueTone,
	ogNewsletterIssue,
} from "../variants";

export type { OgNewsletterIssueMode, OgNewsletterIssueTone };

export interface OgNewsletterIssueProps {
	/** Newsletter name, set small in the masthead. */
	publication: string;
	/** Lead story headline, the focal point; clamps to three lines, two with a list. */
	headline: string;
	/** Pre-formatted issue label, e.g. "No. 42". */
	issue?: string;
	date?: string;
	logo?: string;
	/** Up to three other stories, numbered under the lead. */
	inside?: string[];
	insideLabel?: string;
	mode?: OgNewsletterIssueMode;
	tone?: OgNewsletterIssueTone;
	className?: string;
}

/** A 1200x630 newsletter issue card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgNewsletterIssue({
	publication,
	headline,
	issue,
	date,
	logo,
	inside = [],
	insideLabel = "In this issue",
	mode = "light",
	tone = "neutral",
	className,
}: OgNewsletterIssueProps) {
	const items = inside.filter(Boolean).slice(0, 3);
	const s = ogNewsletterIssue({ mode, tone, list: items.length > 0 });
	const issueLine = [issue, date].filter(Boolean).join(" · ");
	return (
		<div data-slot="og-newsletter-issue" className={cn(s.root(), className)}>
			<div className={s.masthead()}>
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span className={s.publication()}>{publication}</span>
				</div>
				{issueLine ? <span className={s.issue()}>{issueLine}</span> : null}
			</div>
			<h1 className={s.headline()}>{headline}</h1>
			{items.length ? (
				<div className={s.inside()}>
					<span className={s.insideLabel()}>{insideLabel}</span>
					<div className={s.list()}>
						{items.map((item, i) => (
							<div key={item} className={s.item()}>
								<span className={s.number()}>{String(i + 1).padStart(2, "0")}</span>
								<span className={s.itemText()}>{item}</span>
							</div>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
}
