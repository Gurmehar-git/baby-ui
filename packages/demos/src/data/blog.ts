import type { BlogAuthor, BlogPost } from "../../../../components/blog-grid/posts";
import { avatar, photo } from "./media";

const emma: BlogAuthor = {
	name: "Emma Collins",
	role: "Product designer",
	avatar: avatar(5),
};
const marcus: BlogAuthor = {
	name: "Marcus Johnson",
	role: "Frontend engineer",
	avatar: avatar(12),
};
const jasmine: BlogAuthor = {
	name: "Jasmine Brooks",
	role: "Design lead",
	avatar: avatar(23),
};
const daniel: BlogAuthor = {
	name: "Daniel Kim",
	role: "Backend engineer",
	avatar: avatar(33),
};

const image = (id: number, alt: string) => ({ src: photo(id, 1200, 750), alt });

const BODY = [
	"Most of the work happened before anyone wrote code: we sat with a dozen teams and watched where their week actually went.",
	"What we found was less about speed than about trust. People wanted to know the thing would still be there tomorrow.",
	"So we shipped the smallest version that kept that promise, then listened again.",
];

/** Sample posts for the blog grid demos. */
export const BLOG_POSTS: BlogPost[] = [
	{
		id: "second-visit",
		title: "Designing for the second visit",
		excerpt:
			"First impressions get the attention, but returning users decide whether a product sticks.",
		category: "Design",
		date: "2026-09-28",
		readTime: 6,
		author: jasmine,
		image: image(1015, "A river winding through a green valley"),
		body: BODY,
		featured: true,
	},
	{
		id: "edge-cache",
		title: "Moving our cache to the edge",
		excerpt: "How we cut median latency in half without rewriting the API.",
		category: "Engineering",
		date: "2026-09-21",
		readTime: 9,
		author: daniel,
		image: image(1016, "Canyon walls in late light"),
		body: BODY,
	},
	{
		id: "workflows",
		title: "Workflows, now for every team",
		excerpt: "Automate handoffs between teams with no code, on every plan.",
		category: "Product",
		date: "2026-09-15",
		readTime: 4,
		author: emma,
		image: image(1018, "Mountains above a sea of clouds"),
		body: BODY,
	},
	{
		id: "motion-budget",
		title: "A motion budget for interfaces",
		excerpt: "Why every animation should earn its milliseconds, and how we measure it.",
		category: "Design",
		date: "2026-09-08",
		readTime: 7,
		author: marcus,
		image: image(1019, "A quiet beach at dawn"),
		body: BODY,
	},
	{
		id: "remote-offsite",
		title: "What we learned from our first remote offsite",
		excerpt: "Three days, nine time zones and one surprisingly good shared playlist.",
		category: "Company",
		date: "2026-09-01",
		readTime: 5,
		author: emma,
		image: image(1020, "Snowy peaks under a blue sky"),
		body: BODY,
	},
	{
		id: "typed-forms",
		title: "Typed forms from schema to screen",
		excerpt:
			"One schema now drives validation, the API and the error messages people read.",
		category: "Engineering",
		date: "2026-08-25",
		readTime: 8,
		author: marcus,
		image: image(1021, "Fog rolling over a forest"),
		body: BODY,
	},
	{
		id: "pricing-update",
		title: "A simpler pricing page",
		excerpt: "Two plans, one price per seat, and no asterisks.",
		category: "Product",
		date: "2026-08-18",
		readTime: 3,
		author: jasmine,
		image: image(1022, "A lone tree on a hill"),
		body: BODY,
	},
	{
		id: "empty-states",
		title: "The quiet power of empty states",
		excerpt: "The first screen someone sees is usually empty. It should still teach.",
		category: "Design",
		date: "2026-08-11",
		readTime: 5,
		author: jasmine,
		image: image(1023, "Dunes rippled by wind"),
		body: BODY,
	},
	{
		id: "on-call",
		title: "Making on-call humane",
		excerpt: "Fewer pages, better runbooks and a rotation people do not dread.",
		category: "Engineering",
		date: "2026-08-04",
		readTime: 6,
		author: daniel,
		image: image(1024, "A vulture perched against the sky"),
		body: BODY,
	},
];
