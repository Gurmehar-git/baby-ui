import { photo } from "./media";

/** Files attached in the chat demo; the first follows the status and progress controls. */
export const CHAT_ATTACHMENTS = [
	{ id: "shot", name: "checkout-flow.png", src: photo(1025, 192, 192), meta: "1.2 MB" },
	{ id: "brief", name: "launch-brief.pdf", meta: "248 KB" },
	{ id: "export", name: "q3-export.csv", meta: "1.4 MB", failed: true },
] as const;
