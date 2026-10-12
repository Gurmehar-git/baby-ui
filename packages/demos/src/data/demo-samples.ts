import { GOALS, GOALS_CONFIG } from "./channels";
import { CIRCUIT_CONNECTIONS, CIRCUIT_NODES } from "./circuit";
import { CONTRIBUTIONS } from "./contributions";
import { avatar, photo } from "./media";
import { ORBIT_PEOPLE } from "./stacks";
import {
	MAP_TOTAL,
	MAP_TRENDS,
	MONTHLY_REVENUE,
	REVENUE_AVERAGE,
	REVENUE_TREND,
} from "./stat";
import { STATUSES } from "./status";
import { WORLD, WORLD_VALUES } from "./world";

export const AGENT_SCREEN = {
	streamSrc:
		"https://wsrv.nl/?url=95dnc2a95qgwt9ff.public.blob.vercel-storage.com/agent-desktop-v3.png&w=1280&output=webp&q=80",
};

export const CASE_STUDY_FLIP_STACK = {
	heading: "Design that delivers.",
	endLabel: "The end",
	items: [
		{
			eyebrow: "Fintech",
			title: "Boosted conversion by 42% with a product-led redesign",
			description:
				"We restructured onboarding and clarified the value proposition, turning more visitors into active users.",
			image: "https://picsum.photos/id/1011/900/700",
			imageAlt: "Person paddling a canoe on a lake",
		},
		{
			eyebrow: "Hospitality",
			title: "A slower digital experience for a faster-growing retreat",
			description:
				"A cinematic booking journey brings the landscape forward and simplifies room selection.",
			image: "https://picsum.photos/id/1018/900/700",
			imageAlt: "Mountain valley under a clear sky",
		},
		{
			eyebrow: "Culture",
			title: "Turning a living archive into something you can wander",
			description:
				"Bold editorial type and an intuitive collection system make decades of work feel immediate.",
			image: "https://picsum.photos/id/1040/900/700",
			imageAlt: "Castle on a hill above a town",
		},
		{
			eyebrow: "Climate",
			title: "Making complex energy data clear enough to act on",
			description:
				"An approachable visual system turns live infrastructure data into useful decisions.",
			image: "https://picsum.photos/id/1044/900/700",
			imageAlt: "Rocky coastline at sunset",
		},
	],
};

export const CIRCUIT_BOARD = {
	nodes: CIRCUIT_NODES,
	connections: CIRCUIT_CONNECTIONS,
	label:
		"Data pipeline: input feeds parse and validate, which merge into output; the cache has an error.",
};

export const CODE_BLOCK = {
	code: "export function cn(...inputs: ClassValue[]) {\n\treturn twMerge(clsx(inputs));\n}",
};

type Collaborator = { name: string; pill: string; pillText?: string; cursor: string };

const COLLABORATORS: [Collaborator, Collaborator] = [
	{
		name: "Dylan",
		pill: "bg-chart-4",
		pillText: "text-background",
		cursor: "text-chart-4",
	},
	{
		name: "Evan",
		pill: "bg-chart-2",
		pillText: "text-background",
		cursor: "text-chart-2",
	},
];

export const COLLAB_CARD = {
	backgroundUrl: "https://picsum.photos/id/1043/800/500",
	collaborators: COLLABORATORS,
	presenceColors: [
		"var(--chart-4)",
		"var(--chart-2)",
		"var(--chart-1)",
		"var(--chart-3)",
	],
	presenceAvatars: [12, 32, 47, 5].map(avatar),
};

export const COLLECTION_SURFER = {
	title: "Heritage FW25 collection",
	items: [1005, 1011, 1012, 1027, 1035, 1038, 1041, 1050, 1062, 1074].map((id, i) => ({
		src: `https://picsum.photos/id/${id}/440/588`,
		alt: `Look ${i + 1}`,
	})),
};

export const CONTEXT_CARDS = {
	count: 32,
	chunks: [
		{
			title: "Vendor onboarding rule",
			chars: "290 characters",
			body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
			source: "Dairy Onboarding SOP.pdf",
			badge: "PDF",
			tone: "destructive" as const,
		},
		{
			title: "Seasonal demand row",
			chars: "1,250 characters",
			body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
			source: "Sales Velocity Export.csv",
			badge: "CSV",
			tone: "success" as const,
		},
	],
};

export const DITHERED_LOGO = {
	src: "https://cdn.simpleicons.org/svelte",
	alt: "Svelte logo",
};

export const FILTER_TABLE = {
	rows: [
		{
			task: "Restock mango sorbet",
			date: "Dec 03",
			status: "todo" as const,
			owner: "Mango Moon Gelato",
		},
		{
			task: "Churn black sesame",
			date: "Sep 22",
			status: "progress" as const,
			owner: "Kumo Creamery",
		},
		{
			task: "Print summer menu",
			date: "Jan 02",
			status: "todo" as const,
			owner: "Coral Coast Sorbet",
		},
		{
			task: "Taste-test batch 42",
			date: "Nov 08",
			status: "progress" as const,
			owner: "Maple Orbit",
		},
		{
			task: "Order waffle cones",
			date: "Apr 14",
			status: "done" as const,
			owner: "Aurora Scoops",
		},
	],
	labels: {
		columns: { task: "Task name", date: "Date", status: "Status", owner: "Advisor" },
	},
};

export const INFINITE_IMAGE_FIELD = {
	items: [
		[1015, "A river bending through a valley", "River Bend"],
		[1016, "Red canyon walls at dusk", "Canyon"],
		[1018, "Green highlands under cloud", "Highlands"],
		[1019, "A beach at low tide", "Low Tide"],
		[1020, "Snow on a mountain ridge", "Snowline"],
		[1021, "Fog over an open field", "Fog Field"],
		[1022, "Aurora over a dark lake", "Aurora"],
		[1025, "A pug wrapped in a blanket", "Pug Study"],
		[1035, "A waterfall in a forest", "Falls"],
		[1039, "Rapids between mossy rocks", "Rapids"],
	].map(([id, alt, title], i) => ({
		src: photo(Number(id), 480, 400),
		alt: String(alt),
		title: String(title),
		caption: String(i + 1).padStart(2, "0"),
	})),
};

export const GITHUB_CALENDAR = {
	days: CONTRIBUTIONS,
	title: "@baby-ui",
	locale: "en-US",
};

export const GRADIENT_HERO_01 = {
	badge: "Previewing baby ui blocks",
	headline: "Launch pages that feel finished from the first pass",
	description:
		"Simple sections with considered spacing, quiet motion, and production ready code you can paste into real product work.",
	actions: [
		{ label: "Explore blocks", href: "/components/blocks" },
		{ label: "View source", href: "https://github.com/kanakkholwal/baby-ui" },
	],
	install: "npx shadcn@latest add @baby-ui/gradient-hero-01",
	meta: ["React and Svelte", "MIT licensed"],
};

export const ORBIT_CARD_STACK = { items: ORBIT_PEOPLE };

export const SCROLL_CHOREOGRAPHY = {
	images: {
		topLeft: {
			src: "https://picsum.photos/id/1015/800/540",
			alt: "River winding through a canyon",
		},
		topRight: {
			src: "https://picsum.photos/id/1036/1600/1000",
			alt: "Snowy forest at dusk",
		},
		bottomLeft: {
			src: "https://picsum.photos/id/1043/800/540",
			alt: "Autumn leaves on a lake",
		},
		bottomRight: {
			src: "https://picsum.photos/id/1039/800/540",
			alt: "Waterfall in a green gorge",
		},
	},
};

export const SCROLL_SPLIT_CARD = {
	endLabel: "So cool, right?",
	image: "https://picsum.photos/id/1018/1200/600",
	imageAlt: "Mountain valley under a clear sky",
	cards: [
		{ title: "Plan", description: "Map the journey before a single pixel moves." },
		{ title: "Build", description: "Ship small, measured steps behind real data." },
		{ title: "Grow", description: "Tune what works and retire what does not." },
	],
};

export const STAT_CARD = {
	title: "Total revenue",
	data: MONTHLY_REVENUE,
	dataKey: "revenue",
	value: REVENUE_AVERAGE,
	label: "Monthly average",
	description: "Across all paid plans",
	trend: REVENUE_TREND,
	comparisonLabel: "vs last month",
	formatValue: new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format,
};

export const STAT_CARD_MAP = {
	title: "Sample index",
	geo: WORLD,
	values: WORLD_VALUES,
	trends: MAP_TRENDS,
	value: MAP_TOTAL,
	label: "All countries",
	trend: 8.4,
};

export const STATUS_MONITOR = { statuses: STATUSES, title: "API", locale: "en-US" };

export const TEXT_FLIP = { words: ["fantastic", "love", "fire", "awesome"] };

export const USAGE_CARD = {
	title: "Today's rings",
	description: "Move, exercise and stand goals",
	data: GOALS,
	config: GOALS_CONFIG,
};
