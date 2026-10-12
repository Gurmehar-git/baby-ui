export type CommentAuthor = {
	id: string;
	name: string;
	/** Square image URL; initials show without one. */
	avatar?: string;
};

export type CommentReaction = {
	emoji: string;
	/** Ids of the people who reacted. */
	users: string[];
};

export type ThreadComment = {
	id: string;
	author: CommentAuthor;
	/** Plain text; "@Full Name" mentions of known people are highlighted. */
	body: string;
	/** Display label such as "2h" or "Sep 18". */
	createdAt: string;
	edited?: boolean;
	/** A deleted comment with replies keeps its place as a quiet placeholder. */
	deleted?: boolean;
	reactions?: CommentReaction[];
	replies?: ThreadComment[];
};

/** What changed, for syncing to a server; the change handler also gets the full next tree. */
export type CommentThreadEvent =
	| { type: "reply"; comment: ThreadComment; parentId: string | null }
	| { type: "edit"; id: string; body: string }
	| { type: "delete"; id: string }
	| { type: "react"; id: string; emoji: string; added: boolean };

export type CommentThreadLabels = {
	thread: string;
	commentCount: (count: number) => string;
	peopleCount: (count: number) => string;
	resolve: string;
	resolved: string;
	reopen: string;
	empty: string;
	reply: string;
	edit: string;
	delete: string;
	cancel: string;
	send: string;
	save: string;
	editComment: string;
	edited: string;
	deleteConfirm: string;
	deletedText: string;
	deletedComment: string;
	replyingTo: (name: string) => string;
	cancelReply: string;
	showReplies: (count: number) => string;
	hideReplies: string;
	addReaction: string;
	closeReactions: string;
	reactions: string;
	reactWith: (emoji: string) => string;
	reactionCount: (emoji: string, count: number, includesYou: boolean) => string;
};

export const COMMENT_THREAD_LABELS: CommentThreadLabels = {
	thread: "Comment thread",
	commentCount: (count) => `${count} ${count === 1 ? "comment" : "comments"}`,
	peopleCount: (count) => `${count} ${count === 1 ? "person" : "people"}`,
	resolve: "Resolve",
	resolved: "Resolved",
	reopen: "Reopen",
	empty: "No comments yet. Start the conversation below.",
	reply: "Reply",
	edit: "Edit",
	delete: "Delete",
	cancel: "Cancel",
	send: "Send",
	save: "Save",
	editComment: "Edit comment",
	edited: "edited",
	deleteConfirm: "Delete this comment?",
	deletedText: "This comment was deleted",
	deletedComment: "Deleted comment",
	replyingTo: (name) => `Replying to ${name}`,
	cancelReply: "Cancel reply",
	showReplies: (count) => `Show ${count} ${count === 1 ? "reply" : "replies"}`,
	hideReplies: "Hide replies",
	addReaction: "Add reaction",
	closeReactions: "Close reactions",
	reactions: "Reactions",
	reactWith: (emoji) => `React with ${emoji}`,
	reactionCount: (emoji, count, includesYou) =>
		`${emoji} ${count}${includesYou ? ", including you" : ""}`,
};

export const DEFAULT_REACTIONS = ["👍", "❤️", "🎉", "👀", "🚀", "✅"];

/** Every change returns a new tree, so a controlled parent can store it as is. */
export const mapComment = (
	list: ThreadComment[],
	id: string,
	fn: (comment: ThreadComment) => ThreadComment | null,
): ThreadComment[] =>
	list.flatMap((comment) => {
		if (comment.id === id) {
			const next = fn(comment);
			return next ? [next] : [];
		}
		return comment.replies?.length
			? [{ ...comment, replies: mapComment(comment.replies, id, fn) }]
			: [comment];
	});

export const countComments = (list: ThreadComment[]): number =>
	list.reduce(
		(sum, comment) =>
			sum + (comment.deleted ? 0 : 1) + countComments(comment.replies ?? []),
		0,
	);

export function commentAuthors(
	list: ThreadComment[],
	into = new Map<string, CommentAuthor>(),
) {
	for (const comment of list) {
		if (!comment.deleted) into.set(comment.author.id, comment.author);
		commentAuthors(comment.replies ?? [], into);
	}
	return into;
}

function pathTo(
	list: ThreadComment[],
	id: string,
	trail: string[] = [],
): string[] | null {
	for (const comment of list) {
		if (comment.id === id) return [...trail, id];
		const found = pathTo(comment.replies ?? [], id, [...trail, comment.id]);
		if (found) return found;
	}
	return null;
}

function findComment(list: ThreadComment[], id: string): ThreadComment | null {
	for (const comment of list) {
		if (comment.id === id) return comment;
		const found = findComment(comment.replies ?? [], id);
		if (found) return found;
	}
	return null;
}

/** Splits a body so odd indexes are "@Full Name" mentions of `people`. */
export function splitMentions(text: string, people: CommentAuthor[]) {
	const names = people
		.map((person) => person.name)
		.sort((a, b) => b.length - a.length)
		.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	if (!names.length) return [text];
	return text.split(new RegExp(`(@(?:${names.join("|")}))`, "g"));
}

/** Wraps the first `part` in `text` so a translated sentence keeps its highlighted name. */
export function splitAround(text: string, part: string) {
	const at = part ? text.indexOf(part) : -1;
	return at < 0
		? { before: text, part: "", after: "" }
		: { before: text.slice(0, at), part, after: text.slice(at + part.length) };
}

let serial = 0;
const newId = () => `c-${Date.now().toString(36)}-${(serial++).toString(36)}`;

/** Adds a reply; replies deeper than `maxDepth` attach to the deepest allowed parent. */
export function addComment(
	list: ThreadComment[],
	author: CommentAuthor,
	body: string,
	createdAt: string,
	replyTo: string | null,
	maxDepth: number,
) {
	const comment: ThreadComment = { id: newId(), author, body, createdAt, reactions: [] };
	const path = replyTo ? (pathTo(list, replyTo) ?? []) : [];
	const parentId = path[Math.min(path.length, maxDepth) - 1] ?? null;
	const next = parentId
		? mapComment(list, parentId, (parent) => ({
				...parent,
				replies: [...(parent.replies ?? []), comment],
			}))
		: [...list, comment];
	const event: CommentThreadEvent = { type: "reply", comment, parentId };
	return { next, event, parentId };
}

export function editComment(list: ThreadComment[], id: string, body: string) {
	const event: CommentThreadEvent = { type: "edit", id, body };
	return {
		next: mapComment(list, id, (comment) => ({ ...comment, body, edited: true })),
		event,
	};
}

export function deleteComment(list: ThreadComment[], id: string) {
	const event: CommentThreadEvent = { type: "delete", id };
	const next = mapComment(list, id, (comment) =>
		comment.replies?.length
			? { ...comment, deleted: true, body: "", reactions: [] }
			: null,
	);
	return { next, event };
}

export function toggleReaction(
	list: ThreadComment[],
	id: string,
	emoji: string,
	userId: string,
) {
	const target = findComment(list, id);
	const reactions = target?.reactions ?? [];
	const existing = reactions.find((reaction) => reaction.emoji === emoji);
	const added = !existing?.users.includes(userId);
	const nextReactions = existing
		? reactions
				.map((reaction) =>
					reaction.emoji !== emoji
						? reaction
						: {
								...reaction,
								users: added
									? [...reaction.users, userId]
									: reaction.users.filter((user) => user !== userId),
							},
				)
				.filter((reaction) => reaction.users.length)
		: [...reactions, { emoji, users: [userId] }];
	const event: CommentThreadEvent = { type: "react", id, emoji, added };
	return {
		next: mapComment(list, id, (comment) => ({ ...comment, reactions: nextReactions })),
		event,
	};
}
