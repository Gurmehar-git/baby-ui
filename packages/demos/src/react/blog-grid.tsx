"use client";

import { BlogGrid } from "@baby-ui/react";
import type { ComponentProps } from "react";
import { BLOG_POSTS } from "../data/blog";
import { controlProps } from "../data/preview-props";

export function BlogGridDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof BlogGrid>>(props);
	return (
		<BlogGrid
			key={p.variant}
			posts={BLOG_POSTS}
			variant={p.variant}
			description="Product news, design notes and engineering deep dives from the team."
			categories={["Product", "Design", "Engineering", "Company"]}
			pageSize={3}
			locale="en-US"
		/>
	);
}
