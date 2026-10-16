import { cn } from "../../lib/react/cn";
import {
	OG_DOCS_PAGE_BONES,
	type OgDocsPageMode,
	type OgDocsPageMotif,
	type OgDocsPageTone,
	ogDocsPage,
} from "./variants";

export type { OgDocsPageMode, OgDocsPageMotif, OgDocsPageTone };

export interface OgDocsPageProps {
	title: string;
	/** Docs site name shown top left. */
	site: string;
	logo?: string;
	description?: string;
	/** Breadcrumb trail above the title; the last entry is highlighted. */
	section?: string[];
	/** Code or shell lines for the window; placeholder bars render when omitted. */
	snippet?: string[];
	filename?: string;
	mode?: OgDocsPageMode;
	tone?: OgDocsPageTone;
	motif?: OgDocsPageMotif;
	className?: string;
}

/** A 1200x630 documentation page card. Render it to PNG with takumi-js (see the docs recipe). */
export function OgDocsPage({
	title,
	site,
	logo,
	description,
	section,
	snippet,
	filename,
	mode = "light",
	tone = "neutral",
	motif = "code",
	className,
}: OgDocsPageProps) {
	const s = ogDocsPage({ mode, tone, motif });
	const crumbs = section ?? [];
	const lines = snippet?.slice(0, 8);
	const shell = motif === "terminal";
	return (
		<div data-slot="og-docs-page" className={cn(s.root(), className)}>
			<div className={s.dots()} />
			<div className={s.column()}>
				<div className={s.brand()}>
					{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
					<span className={s.site()}>{site}</span>
				</div>
				{crumbs.length ? (
					<div className={s.crumbs()}>
						{crumbs.map((crumb, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							<span key={`${i}-${crumb}`} className="flex items-center gap-3">
								{i > 0 ? (
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className={s.chevron()}
										aria-hidden="true"
									>
										<path d="m9 6 6 6-6 6" />
									</svg>
								) : null}
								<span className={i === crumbs.length - 1 ? s.crumbCurrent() : s.crumb()}>
									{crumb}
								</span>
							</span>
						))}
					</div>
				) : null}
				<h1 className={cn(s.title(), !crumbs.length && "mt-auto")}>{title}</h1>
				{description ? <p className={s.description()}>{description}</p> : null}
			</div>
			<div className={s.window()}>
				<div className={s.bar()}>
					<span className={s.light()} />
					<span className={s.light()} />
					<span className={s.light()} />
					{filename ? <span className={s.filename()}>{filename}</span> : null}
				</div>
				<div className={s.lines()}>
					{lines
						? lines.map((line, i) => {
								const command = shell && line.startsWith("$ ");
								const muted = shell ? !command : /^\s*(\/\/|#)/.test(line);
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
									<div key={`${i}-${line}`} className={s.line()}>
										<span className={s.gutter()}>{i + 1}</span>
										{command ? <span className={s.prompt()}>$</span> : null}
										<span className={muted ? s.comment() : s.code()}>
											{command ? line.slice(2) : line || " "}
										</span>
									</div>
								);
							})
						: OG_DOCS_PAGE_BONES.map((width, i) => (
								<div key={width} className={cn(s.line(), "h-[33.6px]")}>
									<span className={s.gutter()}>{i + 1}</span>
									{shell && i % 3 === 0 ? <span className={s.prompt()}>$</span> : null}
									{i % 3 === 0 ? <span className={s.boneAccent()} /> : null}
									<span className={s.bone()} style={{ width }} />
								</div>
							))}
				</div>
			</div>
		</div>
	);
}
