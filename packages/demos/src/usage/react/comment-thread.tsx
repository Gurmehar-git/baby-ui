"use client";

import { CommentThread, type ThreadComment } from "@baby-ui/react";
import { useState } from "react";

const me = { id: "you", name: "Sam Rivera" };

export function Example() {
	const [comments, setComments] = useState<ThreadComment[]>([
		{
			id: "1",
			author: { id: "ada", name: "Ada Park" },
			body: "Ship it?",
			createdAt: "2h",
		},
	]);
	return (
		<CommentThread comments={comments} onCommentsChange={setComments} currentUser={me} />
	);
}
