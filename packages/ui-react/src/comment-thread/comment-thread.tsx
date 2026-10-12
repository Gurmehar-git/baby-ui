"use client";

import {
	type KeyboardEvent as ReactKeyboardEvent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Button } from "../button/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../collapsible/collapsible";
import { cn } from "../lib/cn";
import { EMPTY_MENTIONS, initials, type MentionValue } from "../mention-input/mention";
import { MentionInput } from "../mention-input/mention-input";
import { RollingDigits } from "../rolling-digits/rolling-digits";
import {
	addComment,
	COMMENT_THREAD_LABELS,
	type CommentAuthor,
	type CommentReaction,
	type CommentThreadEvent,
	type CommentThreadLabels,
	commentAuthors,
	countComments,
	DEFAULT_REACTIONS,
	deleteComment,
	editComment,
	splitAround,
	splitMentions,
	type ThreadComment,
	toggleReaction,
} from "./thread";
import { type CommentThreadVariant, commentThread } from "./variants";

export type {
	CommentAuthor,
	CommentReaction,
	CommentThreadEvent,
	CommentThreadLabels,
	CommentThreadVariant,
	ThreadComment,
};

export interface CommentThreadProps {
	comments?: ThreadComment[];
	defaultComments?: ThreadComment[];
	/** Gets the full next tree and what changed, for syncing to a server. */
	onCommentsChange?: (comments: ThreadComment[], event: CommentThreadEvent) => void;
	/** The person writing; their comments can be edited and deleted. */
	currentUser: CommentAuthor;
	/** People who can be mentioned; defaults to everyone in the thread. */
	people?: CommentAuthor[];
	resolved?: boolean;
	defaultResolved?: boolean;
	onResolvedChange?: (resolved: boolean) => void;
	/** What the thread is about, such as "Hero headline". */
	title?: ReactNode;
	/** Emoji offered by the reaction picker. */
	reactions?: string[];
	placeholder?: string;
	/** Replies deeper than this attach to the deepest allowed parent. */
	maxDepth?: number;
	/** Time label for comments written now. */
	nowLabel?: string;
	/** Words for localisation; any key left out keeps its English default. */
	labels?: Partial<CommentThreadLabels>;
	variant?: CommentThreadVariant;
	className?: string;
}

type Ui = {
	editing: string | null;
	confirming: string | null;
	picker: string | null;
	collapsed: Record<string, boolean>;
};

const Glyph = ({ d, className }: { d: string; className?: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.75"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden
		className={cn("size-3.5", className)}
	>
		<path d={d} />
	</svg>
);
const CHECK = "m5 12 5 5 9-10";
const REOPEN = "M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5";
const SMILE =
	"M22 11v1a10 10 0 1 1-9-10m-5 12s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M16 5h6m-3-3v6";
const CLOSE = "M18 6 6 18M6 6l12 12";
const REPLY = "m15 10 5 5-5 5M4 4v7a4 4 0 0 0 4 4h12";

function Person({ author, className }: { author: CommentAuthor; className?: string }) {
	return (
		<Avatar className={className} aria-hidden>
			{author.avatar && <AvatarImage src={author.avatar} alt="" />}
			<AvatarFallback>{initials(author.name)}</AvatarFallback>
		</Avatar>
	);
}

/**
 * A threaded discussion: replies nest and collapse, reactions toggle with a rolling count, authors
 * edit and delete in place, the composer autocompletes @mentions, and resolving folds it to a chip.
 */
export function CommentThread({
	comments,
	defaultComments = [],
	onCommentsChange,
	currentUser,
	people,
	resolved,
	defaultResolved = false,
	onResolvedChange,
	title,
	reactions = DEFAULT_REACTIONS,
	placeholder = "Reply, or @mention someone",
	maxDepth = 2,
	nowLabel = "Just now",
	labels,
	variant = "default",
	className,
}: CommentThreadProps) {
	const t = { ...COMMENT_THREAD_LABELS, ...labels };
	const rootRef = useRef<HTMLElement>(null);
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);
	const [own, setOwn] = useState(defaultComments);
	const list = comments ?? own;
	const [ownResolved, setOwnResolved] = useState(defaultResolved);
	const isResolved = resolved ?? ownResolved;
	const [ui, setUi] = useState<Ui>({
		editing: null,
		confirming: null,
		picker: null,
		collapsed: {},
	});
	const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
	const [draft, setDraft] = useState<MentionValue>(EMPTY_MENTIONS);
	const [editDraft, setEditDraft] = useState<MentionValue>(EMPTY_MENTIONS);

	const mentionable = people ?? [
		...commentAuthors(list, new Map([[currentUser.id, currentUser]])).values(),
	];
	const total = countComments(list);
	const participants = [...commentAuthors(list).values()];
	const s = commentThread({ variant });

	const focusIn = (selector: string) =>
		requestAnimationFrame(() =>
			rootRef.current
				?.querySelector<HTMLElement>(selector)
				?.focus({ preventScroll: true }),
		);
	const commit = ({
		next,
		event,
	}: {
		next: ThreadComment[];
		event: CommentThreadEvent;
	}) => {
		if (comments === undefined) setOwn(next);
		onCommentsChange?.(next, event);
	};
	const setResolvedTo = (next: boolean) => {
		if (resolved === undefined) setOwnResolved(next);
		onResolvedChange?.(next);
		setUi((current) => ({ ...current, editing: null, confirming: null, picker: null }));
		setReplyTo(null);
		focusIn(next ? "[data-reopen]" : "[data-resolve]");
	};
	const send = () => {
		const body = draft.text.trim();
		if (!body) return;
		const result = addComment(
			list,
			currentUser,
			body,
			nowLabel,
			replyTo?.id ?? null,
			maxDepth,
		);
		const parentId = result.parentId;
		if (parentId)
			setUi((current) => ({
				...current,
				collapsed: { ...current.collapsed, [parentId]: false },
			}));
		commit(result);
		setDraft(EMPTY_MENTIONS);
		setReplyTo(null);
	};
	const saveEdit = (id: string) => {
		const body = editDraft.text.trim();
		if (!body) return;
		commit(editComment(list, id, body));
		setUi((current) => ({ ...current, editing: null }));
	};
	const cancelOnEscape = (cancel: () => void) => (event: ReactKeyboardEvent) => {
		if (event.key !== "Escape" || event.defaultPrevented) return;
		event.preventDefault();
		event.stopPropagation();
		cancel();
	};

	const body = (text: string) => (
		<p className={s.body()}>
			{splitMentions(text, mentionable).map((part, index) =>
				index % 2 ? (
					// biome-ignore lint/suspicious/noArrayIndexKey: parts are positional and never reorder
					<span key={index} className={s.mention()}>
						{part}
					</span>
				) : (
					part
				),
			)}
		</p>
	);

	const renderComment = (comment: ThreadComment): ReactNode => {
		const mine = comment.author.id === currentUser.id;
		const replies = comment.replies ?? [];
		const open = !ui.collapsed[comment.id];
		const editing = ui.editing === comment.id;
		const confirming = ui.confirming === comment.id;
		const picking = ui.picker === comment.id;
		const close = () =>
			setUi((current) => ({ ...current, confirming: null, picker: null }));
		return (
			<li key={comment.id} className={s.item()}>
				<Collapsible
					className={s.clip()}
					open={open}
					onOpenChange={(next) =>
						setUi((current) => ({
							...current,
							collapsed: { ...current.collapsed, [comment.id]: !next },
						}))
					}
				>
					<article
						className={s.comment()}
						aria-label={
							comment.deleted
								? t.deletedComment
								: `${comment.author.name}, ${comment.createdAt}`
						}
					>
						{comment.deleted ? (
							<span aria-hidden className={s.deletedDot()} />
						) : (
							<Person author={comment.author} className={s.avatar()} />
						)}
						<div className={s.main()}>
							{comment.deleted ? (
								<p className={s.deleted()}>{t.deletedText}</p>
							) : (
								<>
									<header className={s.meta()}>
										<span className={s.name()}>{comment.author.name}</span>
										<span className={s.time()}>
											{comment.createdAt}
											{comment.edited && ` · ${t.edited}`}
										</span>
									</header>
									{editing ? (
										<div className={s.item()}>
											{/* biome-ignore lint/a11y/noStaticElementInteractions: Escape cancels the edit from inside the field */}
											<div
												data-ct-edit={comment.id}
												className={cn(s.clip(), s.compact())}
												onKeyDown={cancelOnEscape(() =>
													setUi((current) => ({ ...current, editing: null })),
												)}
											>
												<MentionInput
													value={editDraft}
													onValueChange={setEditDraft}
													people={mentionable}
													minRows={1}
													submitOnEnter
													onSubmit={() => saveEdit(comment.id)}
													aria-label={t.editComment}
													placeholder={t.editComment}
												/>
												<div className={s.compactActions()}>
													<Button
														size="sm"
														variant="ghost"
														onClick={() =>
															setUi((current) => ({ ...current, editing: null }))
														}
													>
														{t.cancel}
													</Button>
													<Button
														size="sm"
														disabled={
															!editDraft.text.trim() ||
															editDraft.text.trim() === comment.body.trim()
														}
														onClick={() => saveEdit(comment.id)}
													>
														{t.save}
													</Button>
												</div>
											</div>
										</div>
									) : (
										<>
											{body(comment.body)}
											<div className={s.footer()}>
												{(comment.reactions ?? []).length > 0 && (
													<div className={s.reactions()}>
														{(comment.reactions ?? []).map((reaction) => {
															const pressed = reaction.users.includes(currentUser.id);
															return (
																<button
																	key={reaction.emoji}
																	type="button"
																	aria-pressed={pressed}
																	aria-label={t.reactionCount(
																		reaction.emoji,
																		reaction.users.length,
																		pressed,
																	)}
																	className={s.reaction()}
																	onClick={() =>
																		commit(
																			toggleReaction(
																				list,
																				comment.id,
																				reaction.emoji,
																				currentUser.id,
																			),
																		)
																	}
																>
																	<span aria-hidden>{reaction.emoji}</span>
																	<RollingDigits
																		value={reaction.users.length}
																		startOnView={false}
																	/>
																</button>
															);
														})}
													</div>
												)}
												{confirming ? (
													// biome-ignore lint/a11y/noStaticElementInteractions: Escape closes the inline prompt
													<div
														key="confirm"
														data-open=""
														className={s.actions()}
														onKeyDown={cancelOnEscape(close)}
													>
														<span className={s.prompt()}>{t.deleteConfirm}</span>
														<Button
															size="xs"
															variant="ghost"
															className={s.action()}
															onClick={close}
														>
															{t.cancel}
														</Button>
														<Button
															size="xs"
															variant="ghost"
															autoFocus
															className={cn(
																s.action(),
																"text-destructive hover:bg-destructive/10 hover:text-destructive",
															)}
															onClick={() => {
																commit(deleteComment(list, comment.id));
																close();
																if (replyTo?.id === comment.id) setReplyTo(null);
															}}
														>
															{t.delete}
														</Button>
													</div>
												) : picking ? (
													// biome-ignore lint/a11y/useSemanticElements: a fieldset would add a border and legend to an inline row
													<div
														key="picker"
														role="group"
														aria-label={t.reactions}
														data-open=""
														className={s.actions()}
														onKeyDown={cancelOnEscape(close)}
													>
														{reactions.map((emoji, index) => (
															<button
																key={emoji}
																type="button"
																// biome-ignore lint/a11y/noAutofocus: the picker opens on request and focuses its first emoji
																autoFocus={index === 0}
																aria-label={t.reactWith(emoji)}
																aria-pressed={
																	!!comment.reactions
																		?.find((reaction) => reaction.emoji === emoji)
																		?.users.includes(currentUser.id)
																}
																className={s.emoji()}
																style={{ transitionDelay: `${index * 25}ms` }}
																onClick={() => {
																	commit(
																		toggleReaction(
																			list,
																			comment.id,
																			emoji,
																			currentUser.id,
																		),
																	);
																	close();
																}}
															>
																{emoji}
															</button>
														))}
														<Button
															size="icon-xs"
															variant="ghost"
															className={s.action()}
															aria-label={t.closeReactions}
															onClick={close}
														>
															<Glyph d={CLOSE} />
														</Button>
													</div>
												) : (
													<div key="actions" className={s.actions()}>
														<Button
															size="icon-xs"
															variant="ghost"
															className={s.action()}
															aria-label={t.addReaction}
															onClick={() =>
																setUi((current) => ({
																	...current,
																	picker: comment.id,
																	confirming: null,
																}))
															}
														>
															<Glyph d={SMILE} />
														</Button>
														<Button
															size="xs"
															variant="ghost"
															className={s.action()}
															onClick={() => {
																setReplyTo({ id: comment.id, name: comment.author.name });
																focusIn("[data-ct-composer] textarea");
															}}
														>
															{t.reply}
														</Button>
														{mine && (
															<Button
																size="xs"
																variant="ghost"
																className={s.action()}
																onClick={() => {
																	setEditDraft({ text: comment.body, mentions: [] });
																	setUi((current) => ({
																		...current,
																		editing: comment.id,
																		confirming: null,
																		picker: null,
																	}));
																	focusIn(`[data-ct-edit="${comment.id}"] textarea`);
																}}
															>
																{t.edit}
															</Button>
														)}
														{mine && (
															<Button
																size="xs"
																variant="ghost"
																className={s.action()}
																onClick={() =>
																	setUi((current) => ({
																		...current,
																		confirming: comment.id,
																		editing: null,
																		picker: null,
																	}))
																}
															>
																{t.delete}
															</Button>
														)}
													</div>
												)}
											</div>
										</>
									)}
								</>
							)}
							{replies.length > 0 && (
								<CollapsibleTrigger className={s.toggle()}>
									{open ? t.hideReplies : t.showReplies(countComments(replies))}
									{!open && (
										<span aria-hidden className={s.stack()}>
											{[...commentAuthors(replies).values()].slice(0, 3).map((author) => (
												<Person
													key={author.id}
													author={author}
													className="size-4.5 text-[8px]"
												/>
											))}
										</span>
									)}
								</CollapsibleTrigger>
							)}
						</div>
					</article>
					{replies.length > 0 && (
						<CollapsibleContent className="p-0 text-foreground">
							<ul className={s.replies()}>{replies.map(renderComment)}</ul>
						</CollapsibleContent>
					)}
				</Collapsible>
			</li>
		);
	};

	const replying = replyTo ? splitAround(t.replyingTo(replyTo.name), replyTo.name) : null;

	return (
		<section
			ref={rootRef}
			aria-label={t.thread}
			data-slot="comment-thread"
			data-ready={ready || undefined}
			data-resolved={isResolved || undefined}
			className={cn(s.root(), className)}
		>
			<div data-on={!isResolved} inert={isResolved} className={s.face()}>
				<div className={s.clip()}>
					<header className={s.header()}>
						<div className={s.heading()}>
							{title && <h3 className={s.title()}>{title}</h3>}
							<span className={s.subtitle()}>{t.commentCount(total)}</span>
						</div>
						<Button
							size="sm"
							variant="outline"
							data-resolve=""
							disabled={!total}
							className={s.pill()}
							onClick={() => setResolvedTo(true)}
						>
							<Glyph d={CHECK} />
							{t.resolve}
						</Button>
					</header>
					{list.length > 0 ? (
						<ul className={s.list()}>{list.map(renderComment)}</ul>
					) : (
						<p className={s.empty()}>{t.empty}</p>
					)}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: Escape cancels the reply from inside the field */}
					<div
						className={s.composerArea()}
						data-ct-composer=""
						onKeyDown={replyTo ? cancelOnEscape(() => setReplyTo(null)) : undefined}
					>
						{replying && (
							<div className={s.replying()}>
								<span className={cn(s.clip(), s.replyingInner())}>
									<Glyph d={REPLY} />
									<span>
										{replying.before}
										<span className={s.replyingName()}>{replying.part}</span>
										{replying.after}
									</span>
									<Button
										size="icon-xs"
										variant="ghost"
										aria-label={t.cancelReply}
										onClick={() => setReplyTo(null)}
									>
										<Glyph d={CLOSE} />
									</Button>
								</span>
							</div>
						)}
						<div className={s.composer()}>
							<Person author={currentUser} className={s.composerAvatar()} />
							<MentionInput
								value={draft}
								onValueChange={setDraft}
								people={mentionable}
								minRows={1}
								maxRows={6}
								submitOnEnter
								onSubmit={send}
								placeholder={placeholder}
								aria-label={placeholder}
							/>
							<Button
								disabled={!draft.text.trim()}
								onClick={send}
								className="rounded-full"
							>
								{t.send}
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div data-on={isResolved} inert={!isResolved} className={s.face()}>
				<div className={s.clip()}>
					<div className={s.resolved()}>
						<span aria-hidden className={s.resolvedIcon()}>
							<Glyph d={CHECK} className="stroke-2" />
						</span>
						<span className={s.resolvedText()}>
							<span className={s.resolvedTitle()}>
								{t.resolved}
								{title ? (
									<>
										{" · "}
										<span className={s.resolvedSubject()}>{title}</span>
									</>
								) : null}
							</span>
							<span className={s.resolvedMeta()}>
								{t.commentCount(total)} · {t.peopleCount(participants.length)}
							</span>
						</span>
						<span aria-hidden className={s.stack()}>
							{participants.slice(0, 3).map((author) => (
								<Person key={author.id} author={author} className="size-5.5 text-[9px]" />
							))}
						</span>
						<Button
							size="sm"
							variant="outline"
							data-reopen=""
							className="rounded-full"
							onClick={() => setResolvedTo(false)}
						>
							<Glyph d={REOPEN} />
							{t.reopen}
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
