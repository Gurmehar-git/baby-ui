"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../../button/react/button";
import { button } from "../../button/react/variants";
import { Card } from "../../card/react/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../../dropdown-menu/react/dropdown-menu";
import { cn } from "../../lib/react/cn";
import { Textarea } from "../../textarea/react/textarea";
import { ToggleGroup, ToggleGroupItem } from "../../toggle-group/react/toggle-group";
import {
	CHAT_COMPOSER_LABELS,
	type ChatComposerLabels,
	type ChatMessage,
	type ChatStatus,
	type ChatTopic,
	promptHistory,
	resolvingIndex,
} from "./types";
import {
	type ChatComposerSize,
	type ChatComposerVariant,
	chatComposer,
} from "./variants";

export type {
	ChatComposerLabels,
	ChatComposerSize,
	ChatComposerVariant,
	ChatMessage,
	ChatStatus,
	ChatTopic,
};

const ICON_TRIGGER = button({ variant: "ghost", size: "icon-sm" });

function Glyph({ d, fill = false }: { d: string; fill?: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill={fill ? "currentColor" : "none"}
			stroke={fill ? "none" : "currentColor"}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d={d} />
		</svg>
	);
}

export interface ChatComposerProps {
	/** Every message in the active thread, oldest first. Required: no sample data of its own. */
	messages: ChatMessage[];
	/** Switchable threads; the header toggles are these. Hidden when empty. */
	topics?: ChatTopic[];
	topic?: string;
	defaultTopic?: string;
	onTopicChange?: (key: string) => void;
	/** Controlled draft text. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	/** Fired with the trimmed prompt and the active topic key; the caller appends messages. */
	onSend?: (text: string, topic: string | undefined) => void;
	/** Shows the "new conversation" action when provided. */
	onNew?: () => void;
	status?: ChatStatus;
	variant?: ChatComposerVariant;
	size?: ChatComposerSize;
	labels?: Partial<ChatComposerLabels>;
	className?: string;
}

/** A controlled chat panel: topic toggles, a scrolling thread and a composer, built from registry parts. */
export function ChatComposer({
	messages,
	topics = [],
	topic: topicProp,
	defaultTopic,
	onTopicChange,
	value: valueProp,
	defaultValue = "",
	onValueChange,
	onSend,
	onNew,
	status = "idle",
	variant,
	size,
	labels: labelsProp,
	className,
}: ChatComposerProps) {
	const labels = { ...CHAT_COMPOSER_LABELS, ...labelsProp };
	const [innerTopic, setInnerTopic] = useState(defaultTopic ?? topics[0]?.key);
	const [innerValue, setInnerValue] = useState(defaultValue);
	const [copyStatus, setCopyStatus] = useState("");
	const thread = useRef<HTMLDivElement>(null);
	const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const topic = topicProp ?? innerTopic;
	const draft = valueProp ?? innerValue;
	const s = chatComposer({ variant, size });
	const history = promptHistory(messages);
	const resolving = resolvingIndex(messages, status);
	const canSend = draft.trim().length > 0 && status !== "streaming";

	useEffect(() => {
		const el = thread.current;
		if (el && messages.length) el.scrollTo({ top: el.scrollHeight });
	}, [messages.length]);

	useEffect(() => () => clearTimeout(copyTimer.current), []);

	function setDraft(next: string) {
		if (valueProp === undefined) setInnerValue(next);
		onValueChange?.(next);
	}

	function setTopic(next: string) {
		if (!next) return;
		if (topicProp === undefined) setInnerTopic(next);
		onTopicChange?.(next);
	}

	function send(text: string) {
		const trimmed = text.trim();
		if (!trimmed || status === "streaming") return;
		onSend?.(trimmed, topic);
		setDraft("");
	}

	function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			send(draft);
		}
	}

	async function copyConversation() {
		try {
			await navigator.clipboard.writeText(messages.map((m) => m.body).join("\n"));
			setCopyStatus(labels.copied);
		} catch {
			setCopyStatus(labels.copyFailed);
		}
		clearTimeout(copyTimer.current);
		copyTimer.current = setTimeout(() => setCopyStatus(""), 1500);
	}

	return (
		<div data-slot="chat-composer" className={cn(s.frame(), className)}>
			<Card className={s.root()}>
				<div className={s.header()}>
					{topics.length > 0 ? (
						<ToggleGroup
							type="single"
							size="sm"
							label={labels.topics}
							value={topic ?? ""}
							onValueChange={(v) => setTopic(v as string)}
						>
							{topics.map((t) => (
								<ToggleGroupItem key={t.key} value={t.key}>
									{t.label}
								</ToggleGroupItem>
							))}
						</ToggleGroup>
					) : (
						<span />
					)}
					<div className={s.actions()}>
						{onNew ? (
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={labels.newConversation}
								onClick={onNew}
							>
								<Glyph d="M12 5v14M5 12h14" />
							</Button>
						) : null}
						<DropdownMenu>
							<DropdownMenuTrigger aria-label={labels.history} className={ICON_TRIGGER}>
								<Glyph d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>{labels.recentPrompts}</DropdownMenuLabel>
								{history.length === 0 ? (
									<div className="px-2.5 py-1.5 text-muted-foreground text-xs">
										{labels.noHistory}
									</div>
								) : (
									history.map((entry) => (
										<DropdownMenuItem key={entry} onClick={() => send(entry)}>
											<span className="min-w-0 flex-1 truncate">{entry}</span>
										</DropdownMenuItem>
									))
								)}
							</DropdownMenuContent>
						</DropdownMenu>
						<DropdownMenu>
							<DropdownMenuTrigger aria-label={labels.more} className={ICON_TRIGGER}>
								<Glyph
									fill
									d="M5 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM12 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM19 13.8a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z"
								/>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={copyConversation}>
									{copyStatus || labels.copy}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div
					ref={thread}
					role="log"
					aria-live="polite"
					aria-relevant="additions"
					className={s.thread()}
				>
					{messages.map((m, i) =>
						m.role === "user" ? (
							<p key={m.id} className={s.user()}>
								{m.body}
							</p>
						) : (
							<div
								key={m.id}
								className={chatComposer({ size, resolving: i === resolving }).assistant()}
							>
								{m.author || m.meta ? (
									<div className={s.byline()}>
										{m.author ? <span className={s.author()}>{m.author}</span> : null}
										{m.meta ? <span className={s.meta()}>{m.meta}</span> : null}
									</div>
								) : null}
								<p className={s.body()}>{m.body}</p>
							</div>
						),
					)}
				</div>

				<div className={s.composer()}>
					<Textarea
						rows={1}
						autoGrow
						maxRows={4}
						size="sm"
						value={draft}
						onChange={(event) => setDraft(event.target.value)}
						onKeyDown={onKeyDown}
						placeholder={labels.placeholder}
						aria-label={labels.prompt}
						className="min-h-8 flex-1"
					/>
					<Button
						size="icon-sm"
						aria-label={labels.send}
						disabled={!canSend}
						onClick={() => send(draft)}
					>
						<Glyph d="M12 19V5M5 12l7-7 7 7" />
					</Button>
				</div>
			</Card>
			<span role="status" className="sr-only">
				{copyStatus}
			</span>
		</div>
	);
}
