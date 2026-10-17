import { cn } from "../../lib/cn";
import { ogTestimonialStars } from "../stars";
import {
	type OgTestimonialAlign,
	type OgTestimonialMode,
	type OgTestimonialStar,
	type OgTestimonialTone,
	ogTestimonial,
} from "../variants";

export type {
	OgTestimonialAlign,
	OgTestimonialMode,
	OgTestimonialStar,
	OgTestimonialTone,
};

export interface OgTestimonialProps {
	/** The quote itself, the focal point; clamps to four lines. */
	quote: string;
	author: { name: string; role?: string; avatar?: string };
	company?: string;
	/** Company logo URL, end of the author row. */
	companyLogo?: string;
	/** 0 to 5, drawn to the nearest half star. */
	rating?: number;
	mode?: OgTestimonialMode;
	tone?: OgTestimonialTone;
	align?: OgTestimonialAlign;
	className?: string;
}

const STAR =
	"M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z";
const HALF = "M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253z";

/** A 1200x630 customer quote card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgTestimonial({
	quote,
	author,
	company,
	companyLogo,
	rating,
	mode = "light",
	tone = "neutral",
	align = "left",
	className,
}: OgTestimonialProps) {
	const s = ogTestimonial({ mode, tone, align });
	const byline = [author.role, company].filter(Boolean).join(" · ");
	return (
		<div data-slot="og-testimonial" className={cn(s.root(), className)}>
			<div className={s.header()}>
				<span aria-hidden="true" className={s.mark()}>
					“
				</span>
				{rating !== undefined ? (
					<div className={s.stars()}>
						{ogTestimonialStars(rating).map((state, i) => (
							<svg
								aria-hidden="true"
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								key={i}
								width="22"
								height="22"
								viewBox="0 0 24 24"
								fill={state === "half" ? "none" : "currentColor"}
								stroke="currentColor"
								strokeWidth="2"
								strokeLinejoin="round"
								className={s.star({ star: state })}
							>
								<path d={STAR} />
								{state === "half" ? <path d={HALF} fill="currentColor" /> : null}
							</svg>
						))}
					</div>
				) : null}
			</div>
			<p className={s.quote()}>{quote}</p>
			<div className={s.footer()}>
				{author.avatar ? <img src={author.avatar} alt="" className={s.avatar()} /> : null}
				<div className={s.person()}>
					<span className={s.name()}>{author.name}</span>
					{byline ? <span className={s.role()}>{byline}</span> : null}
				</div>
				{companyLogo ? <img src={companyLogo} alt="" className={s.logo()} /> : null}
			</div>
		</div>
	);
}
