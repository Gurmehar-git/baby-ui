import { cn } from "../../lib/react/cn";
import {
	type OgBlogPostMode,
	type OgBlogPostTone,
	type OgBlogPostVariant,
	ogBlogPost,
} from "./variants";

export type { OgBlogPostMode, OgBlogPostTone, OgBlogPostVariant };

export interface OgBlogPostProps {
	title: string;
	/** Site or publication name; top left, or centred above the title in `cover`. */
	site: string;
	logo?: string;
	excerpt?: string;
	/** Top right in `default`; the muted lead line over the title in `cover`. */
	category?: string;
	/** Image URL faded in under the text in `cover`. */
	cover?: string;
	author?: { name: string; avatar?: string };
	date?: string;
	readingTime?: string;
	mode?: OgBlogPostMode;
	tone?: OgBlogPostTone;
	variant?: OgBlogPostVariant;
	className?: string;
}

/** A 1200x630 blog post card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgBlogPost({
	title,
	site,
	logo,
	excerpt,
	category,
	cover,
	author,
	date,
	readingTime,
	mode = "light",
	tone = "neutral",
	variant = "default",
	className,
}: OgBlogPostProps) {
	const s = ogBlogPost({ mode, tone, variant });
	const meta = [date, readingTime].filter(Boolean);
	const centred = variant === "cover";
	return (
		<div data-slot="og-blog-post" className={cn(s.root(), className)}>
			{centred ? (
				cover ? (
					<img src={cover} alt="" className={s.cover()} />
				) : null
			) : (
				<>
					<div className={s.ruleTop()} />
					<div className={s.ruleBottom()} />
					<div className={s.ruleLeft()} />
					<div className={s.ruleRight()} />
				</>
			)}
			<div className={s.header()}>
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span>{site}</span>
				</div>
				{category && !centred ? (
					<span className={s.category()}>
						<span className={s.dot()} />
						{category}
					</span>
				) : null}
			</div>
			<div className={s.body()}>
				{category && centred ? <p className={s.lead()}>{category}</p> : null}
				<h1 className={s.title()}>{title}</h1>
				{excerpt ? <p className={s.excerpt()}>{excerpt}</p> : null}
			</div>
			{!centred && (author || meta.length) ? (
				<div className={s.footer()}>
					{author?.avatar ? (
						<img src={author.avatar} alt="" className={s.avatar()} />
					) : null}
					{author ? <span className={s.author()}>{author.name}</span> : null}
					{meta.map((item) => (
						<span key={item} className="flex items-center gap-5">
							<span className={s.sep()} />
							<span className={s.meta()}>{item}</span>
						</span>
					))}
				</div>
			) : null}
		</div>
	);
}
