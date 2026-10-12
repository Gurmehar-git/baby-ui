"use client";

import {
	type CSSProperties,
	type MouseEvent,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { flushSync } from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Button } from "../button/button";
import { cn } from "../lib/cn";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../pagination/pagination";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group/toggle-group";
import {
	ALL,
	type BlogAuthor,
	type BlogPost,
	blogPage,
	easeHeight,
	formatPostDate,
	withViewTransition,
} from "./posts";
import { type BlogGridVariant, blogGrid } from "./variants";

export type { BlogAuthor, BlogGridVariant, BlogPost };

export interface BlogGridProps {
	posts: BlogPost[];
	/** `featured` leads page one with a wide card; `grid` keeps every card equal. */
	variant?: BlogGridVariant;
	title?: string;
	description?: string;
	/** Filter labels in order; "All" comes first. */
	categories?: string[];
	/** Active category, or "All". */
	category?: string;
	onCategoryChange?: (category: string) => void;
	/** One-based page. */
	page?: number;
	onPageChange?: (page: number) => void;
	/** Cards per page below the featured post. */
	pageSize?: number;
	/** Link per post; cards become links and the in-place reader is off. */
	getHref?: (post: BlogPost) => string;
	/** The post open in the in-place reader, by id. */
	openPost?: string | null;
	onOpenPostChange?: (id: string | null) => void;
	locale?: string;
	className?: string;
}

/** A blog index: category filters, a featured post, paged cards, and an in-place reader whose image morphs out of its card. */
export function BlogGrid({
	posts,
	variant = "featured",
	title = "Journal",
	description,
	categories,
	category: categoryProp,
	onCategoryChange,
	page: pageProp,
	onPageChange,
	pageSize = 6,
	getHref,
	openPost: openProp,
	onOpenPostChange,
	locale,
	className,
}: BlogGridProps) {
	const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
	const s = blogGrid({ variant });
	const root = useRef<HTMLElement>(null);
	const frame = useRef<HTMLDivElement>(null);
	const settle = useRef<() => void>(() => {});
	const [ownCategory, setOwnCategory] = useState(ALL);
	const [ownPage, setOwnPage] = useState(1);
	const [ownOpen, setOwnOpen] = useState<string | null>(null);
	const [dir, setDir] = useState(0);
	const category = categoryProp ?? ownCategory;
	const openId = openProp !== undefined ? openProp : ownOpen;
	const view = blogPage(
		posts,
		category,
		pageProp ?? ownPage,
		pageSize,
		variant === "featured",
	);
	const reading = openId ? posts.find((post) => post.id === openId) : undefined;
	const tabs = [ALL, ...(categories ?? [...new Set(posts.map((post) => post.category))])];
	const pageKey = `${category}-${view.page}`;

	// biome-ignore lint/correctness/useExhaustiveDependencies: runs once the new page has rendered, to ease to its height.
	useLayoutEffect(() => {
		settle.current();
		settle.current = () => {};
	}, [pageKey]);

	const setCategory = (next: string | string[]) => {
		const picked = Array.isArray(next) ? next[0] : next;
		if (!picked || picked === category) return;
		settle.current = easeHeight(frame.current);
		setDir(0);
		if (categoryProp === undefined) setOwnCategory(picked);
		onCategoryChange?.(picked);
		if (pageProp === undefined) setOwnPage(1);
		onPageChange?.(1);
	};
	const setPage = (next: number) => {
		if (next === view.page || next < 1 || next > view.pageCount) return;
		settle.current = easeHeight(frame.current);
		setDir(next > view.page ? 1 : -1);
		if (pageProp === undefined) setOwnPage(next);
		onPageChange?.(next);
		const top = root.current?.getBoundingClientRect().top ?? 0;
		if (top < 0) root.current?.scrollIntoView({ block: "start" });
	};
	const setOpen = (id: string | null) =>
		withViewTransition(() => {
			const from = openId;
			flushSync(() => {
				if (openProp === undefined) setOwnOpen(id);
				onOpenPostChange?.(id);
			});
			// Closing returns focus to the card the reader came from.
			if (!id && from)
				root.current
					?.querySelector<HTMLElement>(`[data-post="${from}"]`)
					?.focus({ preventScroll: true });
		});
	const open = (post: BlogPost, event: MouseEvent) => {
		if (getHref) return;
		event.preventDefault();
		setOpen(post.id);
	};
	const imageName = (post: BlogPost) =>
		({ viewTransitionName: `blog-${uid}-${post.id}` }) as CSSProperties;

	const byline = (author: BlogAuthor, readTime: number) => (
		<div className={s.byline()}>
			<Avatar size="sm" className="size-6">
				{author.avatar ? <AvatarImage src={author.avatar} alt="" /> : null}
				<AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
			</Avatar>
			<span className={s.author()}>{author.name}</span>
			<span className={s.readTime()}>{readTime} min read</span>
		</div>
	);
	const meta = (post: BlogPost) => (
		<p className={s.meta()}>
			<span>{post.category}</span>
			<span aria-hidden="true">·</span>
			<time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
		</p>
	);
	const card = (post: BlogPost, featured = false) => (
		<a
			key={post.id}
			href={getHref?.(post) ?? `#${post.id}`}
			data-post={post.id}
			onClick={(event) => open(post, event)}
			className={cn(s.card(), featured && s.featuredCard())}
		>
			{post.image ? (
				<div className={s.imageFrame()} style={imageName(post)}>
					<img
						src={post.image.src}
						alt={post.image.alt}
						loading={featured ? "eager" : "lazy"}
						decoding="async"
						className={s.image()}
					/>
				</div>
			) : null}
			<div className={s.body()}>
				{meta(post)}
				<h3 className={cn(s.cardTitle(), featured && s.featuredTitle())}>{post.title}</h3>
				<p className={cn(s.excerpt(), featured && s.featuredExcerpt())}>{post.excerpt}</p>
				{byline(post.author, post.readTime)}
			</div>
		</a>
	);

	return (
		<section
			ref={root}
			data-slot="blog-grid"
			data-variant={variant}
			aria-labelledby={reading ? `${uid}-reader` : `${uid}-title`}
			className={cn(s.root(), className)}
		>
			<div className={s.inner()}>
				{reading ? (
					<article className={s.reader()} aria-labelledby={`${uid}-reader`}>
						<Button
							variant="ghost"
							size="sm"
							className={s.back()}
							autoFocus
							onClick={() => setOpen(null)}
						>
							<svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
								<path
									d="M13 8H3m4-4L3 8l4 4"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							All posts
						</Button>
						<header className={s.body()}>
							{meta(reading)}
							<h2 id={`${uid}-reader`} className={s.readerTitle()}>
								{reading.title}
							</h2>
							{byline(reading.author, reading.readTime)}
						</header>
						{reading.image ? (
							<div className={s.readerImage()} style={imageName(reading)}>
								<img
									src={reading.image.src}
									alt={reading.image.alt}
									decoding="async"
									className="size-full object-cover"
								/>
							</div>
						) : null}
						<div className={s.readerBody()}>
							<p>{reading.excerpt}</p>
							{(reading.body ?? []).map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</div>
					</article>
				) : (
					<>
						<header className={s.header()}>
							<h2 id={`${uid}-title`} className={s.title()}>
								{title}
							</h2>
							{description ? <p className={s.description()}>{description}</p> : null}
						</header>
						<div className={s.filters()}>
							<ToggleGroup
								variant="segmented"
								label="Filter by category"
								value={category}
								onValueChange={setCategory}
							>
								{tabs.map((tab) => (
									<ToggleGroupItem key={tab} value={tab}>
										{tab}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
						<div ref={frame} className={s.frame()}>
							<div>
								<div
									key={pageKey}
									className={s.page()}
									style={{ "--dir": dir } as CSSProperties}
								>
									{view.featured ? card(view.featured, true) : null}
									{view.posts.length ? (
										<div className={s.grid()}>{view.posts.map((post) => card(post))}</div>
									) : null}
									{view.filtered.length === 0 ? (
										<p className={s.empty()}>No posts in {category} yet.</p>
									) : null}
								</div>
								{view.pageCount > 1 ? (
									<Pagination className={s.pagination()}>
										<PaginationContent>
											<PaginationItem>
												<PaginationPrevious
													disabled={view.page === 1}
													onClick={() => setPage(view.page - 1)}
												/>
											</PaginationItem>
											{Array.from(
												{ length: view.pageCount },
												(_, index) => index + 1,
											).map((number) => (
												<PaginationItem key={number}>
													<PaginationLink
														active={number === view.page}
														aria-label={`Page ${number}`}
														onClick={() => setPage(number)}
													>
														{number}
													</PaginationLink>
												</PaginationItem>
											))}
											<PaginationItem>
												<PaginationNext
													disabled={view.page === view.pageCount}
													onClick={() => setPage(view.page + 1)}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								) : null}
							</div>
						</div>
					</>
				)}
			</div>
		</section>
	);
}
