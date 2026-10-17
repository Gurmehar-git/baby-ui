<script lang="ts">
import { untrack } from "svelte";
import Avatar from "../../avatar/svelte/avatar.svelte";
import AvatarFallback from "../../avatar/svelte/avatar-fallback.svelte";
import AvatarImage from "../../avatar/svelte/avatar-image.svelte";
import Button from "../../button/svelte/button.svelte";
import Collapsible from "../../collapsible/svelte/collapsible.svelte";
import CollapsibleContent from "../../collapsible/svelte/collapsible-content.svelte";
import CollapsibleTrigger from "../../collapsible/svelte/collapsible-trigger.svelte";
import { cn } from "../../lib/cn";
import { EMPTY_MENTIONS, initials, type MentionValue } from "../../mention-input/mention";
import MentionInput from "../../mention-input/svelte/mention-input.svelte";
import RollingDigits from "../../rolling-digits/svelte/rolling-digits.svelte";
import {
	addComment,
	COMMENT_THREAD_LABELS,
	type CommentAuthor,
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
} from "../thread";
import { type CommentThreadVariant, commentThread } from "../variants";

let {
	comments = $bindable(),
	onCommentsChange,
	currentUser,
	people,
	resolved = $bindable(),
	onResolvedChange,
	title,
	reactions = DEFAULT_REACTIONS,
	placeholder = "Reply, or @mention someone",
	maxDepth = 2,
	nowLabel = "Just now",
	labels,
	variant = "default",
	class: classProp,
}: {
	/** Bindable. */
	comments?: ThreadComment[];
	/** Gets the full next tree and what changed, for syncing to a server. */
	onCommentsChange?: (comments: ThreadComment[], event: CommentThreadEvent) => void;
	/** The person writing; their comments can be edited and deleted. */
	currentUser: CommentAuthor;
	/** People who can be mentioned; defaults to everyone in the thread. */
	people?: CommentAuthor[];
	/** Bindable. */
	resolved?: boolean;
	onResolvedChange?: (resolved: boolean) => void;
	/** What the thread is about, such as "Hero headline". */
	title?: string;
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
	class?: string;
} = $props();

const t = $derived({ ...COMMENT_THREAD_LABELS, ...labels });
let root = $state<HTMLElement>();
let ready = $state(false);
$effect(() => {
	ready = true;
});
let own = $state(untrack(() => comments ?? []));
const list = $derived(comments ?? own);
let ownResolved = $state(untrack(() => resolved ?? false));
const isResolved = $derived(resolved ?? ownResolved);
let editing = $state<string | null>(null);
let confirming = $state<string | null>(null);
let picker = $state<string | null>(null);
let collapsed = $state<Record<string, boolean>>({});
let replyTo = $state<{ id: string; name: string } | null>(null);
let draft = $state<MentionValue>(EMPTY_MENTIONS);
let editDraft = $state<MentionValue>(EMPTY_MENTIONS);

const mentionable = $derived(
	people ?? [...commentAuthors(list, new Map([[currentUser.id, currentUser]])).values()],
);
const total = $derived(countComments(list));
const participants = $derived([...commentAuthors(list).values()]);
const s = $derived(commentThread({ variant }));
const replying = $derived(
	replyTo ? splitAround(t.replyingTo(replyTo.name), replyTo.name) : null,
);

const focusIn = (selector: string) =>
	requestAnimationFrame(() =>
		root?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true }),
	);
function commit({ next, event }: { next: ThreadComment[]; event: CommentThreadEvent }) {
	if (comments === undefined) own = next;
	else comments = next;
	onCommentsChange?.(next, event);
}
function setResolvedTo(next: boolean) {
	if (resolved === undefined) ownResolved = next;
	else resolved = next;
	onResolvedChange?.(next);
	editing = confirming = picker = null;
	replyTo = null;
	focusIn(next ? "[data-reopen]" : "[data-resolve]");
}
function send() {
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
	if (result.parentId) collapsed = { ...collapsed, [result.parentId]: false };
	commit(result);
	draft = EMPTY_MENTIONS;
	replyTo = null;
}
function saveEdit(id: string) {
	const body = editDraft.text.trim();
	if (!body) return;
	commit(editComment(list, id, body));
	editing = null;
}
const cancelOnEscape = (cancel: () => void) => (event: KeyboardEvent) => {
	if (event.key !== "Escape" || event.defaultPrevented) return;
	event.preventDefault();
	event.stopPropagation();
	cancel();
};
const close = () => {
	confirming = picker = null;
};
</script>

{#snippet glyph(d: string, className?: string)}
	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
		class={cn("size-3.5", className)}><path {d} /></svg
	>
{/snippet}

{#snippet person(author: CommentAuthor, className: string)}
	<Avatar class={className} aria-hidden="true">
		{#if author.avatar}<AvatarImage src={author.avatar} alt="" />{/if}
		<AvatarFallback>{initials(author.name)}</AvatarFallback>
	</Avatar>
{/snippet}

{#snippet renderComment(comment: ThreadComment)}
	{@const mine = comment.author.id === currentUser.id}
	{@const replies = comment.replies ?? []}
	{@const open = !collapsed[comment.id]}
	<li class={s.item()}>
		<Collapsible class={s.clip()} bind:open={() => open, (next) => (collapsed = { ...collapsed, [comment.id]: !next })}>
			<article
				class={s.comment()}
				aria-label={comment.deleted ? t.deletedComment : `${comment.author.name}, ${comment.createdAt}`}
			>
				{#if comment.deleted}
					<span aria-hidden="true" class={s.deletedDot()}></span>
				{:else}
					{@render person(comment.author, s.avatar())}
				{/if}
				<div class={s.main()}>
					{#if comment.deleted}
						<p class={s.deleted()}>{t.deletedText}</p>
					{:else}
						<header class={s.meta()}>
							<span class={s.name()}>{comment.author.name}</span>
							<span class={s.time()}>{comment.createdAt}{comment.edited ? ` · ${t.edited}` : ""}</span>
						</header>
						{#if editing === comment.id}
							<div class={s.item()}>
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									data-ct-edit={comment.id}
									class={cn(s.clip(), s.compact())}
									onkeydown={cancelOnEscape(() => (editing = null))}
								>
									<MentionInput
										bind:value={editDraft}
										people={mentionable}
										minRows={1}
										submitOnEnter
										onSubmit={() => saveEdit(comment.id)}
										aria-label={t.editComment}
										placeholder={t.editComment}
									/>
									<div class={s.compactActions()}>
										<Button size="sm" variant="ghost" onclick={() => (editing = null)}>{t.cancel}</Button>
										<Button
											size="sm"
											disabled={!editDraft.text.trim() || editDraft.text.trim() === comment.body.trim()}
											onclick={() => saveEdit(comment.id)}>{t.save}</Button
										>
									</div>
								</div>
							</div>
						{:else}
							<p class={s.body()}>
								{#each splitMentions(comment.body, mentionable) as part, index (index)}{#if index % 2}<span
											class={s.mention()}>{part}</span
										>{:else}{part}{/if}{/each}
							</p>
							<div class={s.footer()}>
								{#if (comment.reactions ?? []).length > 0}
									<div class={s.reactions()}>
										{#each comment.reactions ?? [] as reaction (reaction.emoji)}
											{@const pressed = reaction.users.includes(currentUser.id)}
											<button
												type="button"
												aria-pressed={pressed}
												aria-label={t.reactionCount(reaction.emoji, reaction.users.length, pressed)}
												class={s.reaction()}
												onclick={() => commit(toggleReaction(list, comment.id, reaction.emoji, currentUser.id))}
											>
												<span aria-hidden="true">{reaction.emoji}</span>
												<RollingDigits value={reaction.users.length} startOnView={false} />
											</button>
										{/each}
									</div>
								{/if}
								{#if confirming === comment.id}
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div data-open="" class={s.actions()} onkeydown={cancelOnEscape(close)}>
										<span class={s.prompt()}>{t.deleteConfirm}</span>
										<Button size="xs" variant="ghost" class={s.action()} onclick={close}>{t.cancel}</Button>
										<Button
											size="xs"
											variant="ghost"
											autofocus
											class={cn(s.action(), "text-destructive hover:bg-destructive/10 hover:text-destructive")}
											onclick={() => {
												commit(deleteComment(list, comment.id));
												close();
												if (replyTo?.id === comment.id) replyTo = null;
											}}>{t.delete}</Button
										>
									</div>
								{:else if picker === comment.id}
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<div
										role="group"
										aria-label={t.reactions}
										data-open=""
										class={s.actions()}
										onkeydown={cancelOnEscape(close)}
									>
										{#each reactions as emoji, index (emoji)}
											<!-- svelte-ignore a11y_autofocus -->
											<button
												type="button"
												autofocus={index === 0}
												aria-label={t.reactWith(emoji)}
												aria-pressed={!!comment.reactions
													?.find((reaction) => reaction.emoji === emoji)
													?.users.includes(currentUser.id)}
												class={s.emoji()}
												style:transition-delay="{index * 25}ms"
												onclick={() => {
													commit(toggleReaction(list, comment.id, emoji, currentUser.id));
													close();
												}}>{emoji}</button
											>
										{/each}
										<Button size="icon-xs" variant="ghost" class={s.action()} aria-label={t.closeReactions} onclick={close}>
											{@render glyph("M18 6 6 18M6 6l12 12")}
										</Button>
									</div>
								{:else}
									<div class={s.actions()}>
										<Button
											size="icon-xs"
											variant="ghost"
											class={s.action()}
											aria-label={t.addReaction}
											onclick={() => {
												picker = comment.id;
												confirming = null;
											}}
										>
											{@render glyph("M22 11v1a10 10 0 1 1-9-10m-5 12s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01M16 5h6m-3-3v6")}
										</Button>
										<Button
											size="xs"
											variant="ghost"
											class={s.action()}
											onclick={() => {
												replyTo = { id: comment.id, name: comment.author.name };
												focusIn("[data-ct-composer] textarea");
											}}>{t.reply}</Button
										>
										{#if mine}
											<Button
												size="xs"
												variant="ghost"
												class={s.action()}
												onclick={() => {
													editDraft = { text: comment.body, mentions: [] };
													editing = comment.id;
													confirming = picker = null;
													focusIn(`[data-ct-edit="${comment.id}"] textarea`);
												}}>{t.edit}</Button
											>
											<Button
												size="xs"
												variant="ghost"
												class={s.action()}
												onclick={() => {
													confirming = comment.id;
													editing = picker = null;
												}}>{t.delete}</Button
											>
										{/if}
									</div>
								{/if}
							</div>
						{/if}
					{/if}
					{#if replies.length > 0}
						<CollapsibleTrigger class={s.toggle()}>
							{open ? t.hideReplies : t.showReplies(countComments(replies))}
							{#if !open}
								<span aria-hidden="true" class={s.stack()}>
									{#each [...commentAuthors(replies).values()].slice(0, 3) as author (author.id)}
										{@render person(author, "size-4.5 text-[8px]")}
									{/each}
								</span>
							{/if}
						</CollapsibleTrigger>
					{/if}
				</div>
			</article>
			{#if replies.length > 0}
				<CollapsibleContent class="p-0 text-foreground">
					<ul class={s.replies()}>
						{#each replies as reply (reply.id)}{@render renderComment(reply)}{/each}
					</ul>
				</CollapsibleContent>
			{/if}
		</Collapsible>
	</li>
{/snippet}

<section
	bind:this={root}
	aria-label={t.thread}
	data-slot="comment-thread"
	data-ready={ready || undefined}
	data-resolved={isResolved || undefined}
	class={cn(s.root(), classProp)}
>
	<div data-on={!isResolved} inert={isResolved} class={s.face()}>
		<div class={s.clip()}>
			<header class={s.header()}>
				<div class={s.heading()}>
					{#if title}<h3 class={s.title()}>{title}</h3>{/if}
					<span class={s.subtitle()}>{t.commentCount(total)}</span>
				</div>
				<Button
					size="sm"
					variant="outline"
					data-resolve=""
					disabled={!total}
					class={s.pill()}
					onclick={() => setResolvedTo(true)}
				>
					{@render glyph("m5 12 5 5 9-10")}
					{t.resolve}
				</Button>
			</header>
			{#if list.length > 0}
				<ul class={s.list()}>
					{#each list as comment (comment.id)}{@render renderComment(comment)}{/each}
				</ul>
			{:else}
				<p class={s.empty()}>{t.empty}</p>
			{/if}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class={s.composerArea()}
				data-ct-composer=""
				onkeydown={(event) => replyTo && cancelOnEscape(() => (replyTo = null))(event)}
			>
				{#if replying}
					<div class={s.replying()}>
						<span class={cn(s.clip(), s.replyingInner())}>
							{@render glyph("m15 10 5 5-5 5M4 4v7a4 4 0 0 0 4 4h12")}
							<span>{replying.before}<span class={s.replyingName()}>{replying.part}</span>{replying.after}</span>
							<Button size="icon-xs" variant="ghost" aria-label={t.cancelReply} onclick={() => (replyTo = null)}>
								{@render glyph("M18 6 6 18M6 6l12 12")}
							</Button>
						</span>
					</div>
				{/if}
				<div class={s.composer()}>
					{@render person(currentUser, s.composerAvatar())}
					<MentionInput
						bind:value={draft}
						people={mentionable}
						minRows={1}
						maxRows={6}
						submitOnEnter
						onSubmit={send}
						{placeholder}
						aria-label={placeholder}
					/>
					<Button disabled={!draft.text.trim()} onclick={send} class="rounded-full">{t.send}</Button>
				</div>
			</div>
		</div>
	</div>
	<div data-on={isResolved} inert={!isResolved} class={s.face()}>
		<div class={s.clip()}>
			<div class={s.resolved()}>
				<span aria-hidden="true" class={s.resolvedIcon()}>{@render glyph("m5 12 5 5 9-10", "stroke-2")}</span>
				<span class={s.resolvedText()}>
					<span class={s.resolvedTitle()}
						>{t.resolved}{#if title}{" · "}<span class={s.resolvedSubject()}>{title}</span>{/if}</span
					>
					<span class={s.resolvedMeta()}>{t.commentCount(total)} · {t.peopleCount(participants.length)}</span>
				</span>
				<span aria-hidden="true" class={s.stack()}>
					{#each participants.slice(0, 3) as author (author.id)}
						{@render person(author, "size-5.5 text-[9px]")}
					{/each}
				</span>
				<Button size="sm" variant="outline" data-reopen="" class="rounded-full" onclick={() => setResolvedTo(false)}>
					{@render glyph("M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5")}
					{t.reopen}
				</Button>
			</div>
		</div>
	</div>
</section>
