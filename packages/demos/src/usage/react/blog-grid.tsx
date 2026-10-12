"use client";

import { BlogGrid, type BlogPost } from "@baby-ui/react";

export function Example({ posts }: { posts: BlogPost[] }) {
	return <BlogGrid posts={posts} title="Blog" getHref={(post) => `/blog/${post.id}`} />;
}
