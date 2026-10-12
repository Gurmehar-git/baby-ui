"use client";

import { CommentThread, type ThreadComment } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { THREAD_COMMENTS, THREAD_ME, THREAD_PEOPLE } from "../data/comment-thread";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function CommentThreadDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof CommentThread>>(props);
	const [comments, setComments] = useState<ThreadComment[]>(THREAD_COMMENTS);
	const [resolved, setResolved] = useState(false);
	return (
		<div className="w-full max-w-lg">
			<CommentThread
				title="Hero headline"
				comments={comments}
				onCommentsChange={setComments}
				resolved={resolved}
				onResolvedChange={setResolved}
				currentUser={THREAD_ME}
				people={THREAD_PEOPLE}
				variant={p.variant}
			/>
		</div>
	);
}
