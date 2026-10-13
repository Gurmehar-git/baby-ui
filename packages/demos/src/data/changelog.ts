import type { ChangelogEntry } from "../../../ui-react/src/changelog-feed/changelog";
import { photo } from "./media";

const WEBHOOK = `import { verifyWebhook } from "@acme/node";

const event = verifyWebhook(body, headers, secret);
if (event.type === "order.paid") {
  await fulfil(event.data.order);
}`;

/** Sample release notes for the changelog demos, four months of an imaginary storefront product. */
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
	{
		id: "masonry",
		date: "2026-09-18",
		version: "4.12.0",
		kind: "new",
		title: "Masonry gallery layout",
		summary: "Mix portrait and landscape work without cropping a single frame.",
		details: [
			"Choose two to five columns for each breakpoint.",
			"Drag an image and the columns rebalance while you move it.",
		],
		media: {
			type: "photo",
			src: photo(1040, 1200, 800),
			alt: "A gallery of mixed photographs",
			caption: "Four columns on desktop, two on phones.",
		},
	},
	{
		id: "resumable",
		date: "2026-09-18",
		version: "4.12.0",
		kind: "improved",
		title: "Uploads resume after a dropped connection",
		summary:
			"Large uploads continue from the last finished chunk instead of starting over.",
		details: ["Files upload in 8 MB chunks, each retried up to five times."],
	},
	{
		id: "currency",
		date: "2026-09-09",
		version: "4.11.2",
		kind: "fixed",
		title: "Discount codes stay applied after a currency switch",
		summary: "Switching from EUR to CHF at checkout no longer clears an applied code.",
		details: ["Affected 0.4% of checkouts since 4.11.0."],
	},
	{
		id: "webhooks",
		date: "2026-09-02",
		version: "4.11.0",
		kind: "new",
		title: "Order webhooks",
		summary: "Receive a signed request when an order is paid, refunded or shipped.",
		details: [
			"Every request carries a timestamped signature.",
			"Failed deliveries retry with backoff for 72 hours.",
		],
		media: { type: "code", file: "webhook.ts", code: WEBHOOK, language: "ts" },
	},
	{
		id: "avif",
		date: "2026-08-26",
		version: "4.10.0",
		kind: "improved",
		title: "Product pages load 38% faster on mobile",
		summary: "Images now ship as AVIF with responsive sizes for each device.",
		details: ["Median largest paint dropped from 2.9 s to 1.8 s."],
	},
	{
		id: "inventory",
		date: "2026-08-14",
		version: "4.9.3",
		kind: "fixed",
		title: "Stock no longer goes negative during a sale",
		summary: "Concurrent checkouts now reserve inventory in a single step.",
	},
	{
		id: "variants",
		date: "2026-07-22",
		version: "4.8.0",
		kind: "new",
		title: "Variants with their own photos",
		summary: "Each colour or size can show its own gallery on the product page.",
	},
	{
		id: "timezone",
		date: "2026-07-10",
		version: "4.7.1",
		kind: "fixed",
		title: "Scheduled posts respect the studio time zone",
		summary: "A post scheduled for 09:00 in Zurich no longer goes live at 09:00 UTC.",
	},
	{
		id: "domains",
		date: "2026-06-03",
		version: "4.5.0",
		kind: "improved",
		title: "Custom domains verify in under a minute",
		summary: "Add two DNS records and the check runs every few seconds.",
	},
];
