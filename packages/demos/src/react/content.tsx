"use client";

import {
	Attachment,
	AttachmentContent,
	AttachmentMeta,
	AttachmentName,
	AttachmentPreview,
	AttachmentProgress,
	AttachmentRemove,
	AttachmentRetry,
	Attachments,
	Button,
	CodeBlock,
	type ColorFormat,
	ColorPicker,
	Composer,
	Conversation,
	ConversationContent,
	ConversationScrollButton,
	CopyButton,
	FileDiff,
	Markdown,
	Message,
	MessageBubble,
	MessageContent,
	Question,
	type QuestionAnswers,
	type QuestionItem,
	Reasoning,
	TagInput,
	Tool,
} from "@baby-ui/react";
import { type ComponentProps, useEffect, useState } from "react";
import { CHAT_ATTACHMENTS } from "../data/attachment";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

const SAMPLE_MD = [
	"## Installing",
	"Components are **copied into your project**, not installed. Run `shadcn add` and the source is yours.",
	"",
	"1. You own the source",
	"2. Nothing is imported at runtime",
	"3. Updates are a [diff](https://git-scm.com/docs/git-diff), not a version bump",
	"",
	"| Port | Primitives |",
	"| --- | --- |",
	"| React | Base UI |",
	"| Svelte | bits-ui |",
	"",
	"```bash",
	"npx shadcn add @baby-ui/button",
	"```",
].join("\n");
// Whitespace stays on the chunk before it, so the joined text is the sample verbatim.
const SAMPLE_CHUNKS = SAMPLE_MD.split(/(?<=\s)/);

export function CopyButtonDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof CopyButton>>(props);
	const text = p.text || "npx shadcn@latest add button";
	return (
		<div className="flex w-full max-w-[22rem] items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2">
			<code className="truncate font-mono text-foreground text-xs">{text}</code>
			<CopyButton
				text={text}
				label={p.label || "Copy"}
				copiedLabel={p.copiedLabel || "Copied"}
				iconOnly={p.iconOnly ?? true}
			/>
		</div>
	);
}

export function MarkdownDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Markdown>>(props);
	const [count, setCount] = useState(0);
	const [run, setRun] = useState(0);

	// The scripted stream lives here; the component only renders what it is given.
	useEffect(() => setCount(0), [run, p.animate]);
	useEffect(() => {
		if (count >= SAMPLE_CHUNKS.length) return;
		const timer = setTimeout(() => setCount((n) => n + 1), 40);
		return () => clearTimeout(timer);
	}, [count]);

	return (
		<div className="flex w-full max-w-md flex-col items-start gap-3">
			<Markdown
				content={SAMPLE_CHUNKS.slice(0, count).join("")}
				streaming={count < SAMPLE_CHUNKS.length}
				variant={p.variant ?? "default"}
				size={p.size ?? "default"}
				animate={p.animate ?? "fade"}
				caret={p.caret ?? true}
				className="w-full"
			/>
			<Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
				Replay
			</Button>
		</div>
	);
}

const DIFF = [
	{ kind: "context" as const, text: "export function Button(props: ButtonProps) {" },
	{ kind: "remove" as const, text: "  const classes = button({ variant });" },
	{
		kind: "add" as const,
		text: "  const classes = cn(button({ variant, size }), className);",
	},
	{ kind: "context" as const, text: "  return <button className={classes} />;" },
	{ kind: "context" as const, text: "}" },
];

export function FileDiffDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof FileDiff>>(props);
	return (
		<div className="w-full max-w-lg">
			<FileDiff
				filename={p.filename || "src/button.tsx"}
				lines={DIFF}
				showLineNumbers={p.showLineNumbers ?? true}
			/>
		</div>
	);
}

export function TagInputDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof TagInput>>(props);
	const [tags, setTags] = useState(["svelte", "react"]);
	return (
		<div className="w-full max-w-80">
			<TagInput
				tags={tags}
				onTagsChange={setTags}
				placeholder={p.placeholder || "Add a tag…"}
				max={p.max ?? 6}
				disabled={p.disabled ?? false}
				invalid={p.invalid ?? false}
				size={p.size ?? "default"}
				label="Tags"
			/>
		</div>
	);
}

export function ColorPickerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof ColorPicker>>(props);
	const [value, setValue] = useState("#7dd3fc");
	const [format, setFormat] = useState<ColorFormat>("hsv");
	useEffect(() => {
		if (p.value) setValue(p.value);
	}, [p.value]);
	useEffect(() => setFormat(p.format ?? "hsv"), [p.format]);
	// Recents live in the parent; the popover adds the colour it closed on.
	const [recent, setRecent] = useState<string[]>([]);
	return (
		<ColorPicker
			value={value}
			onValueChange={setValue}
			format={format}
			onFormatChange={setFormat}
			variant={p.variant ?? "field"}
			className={p.variant === "row" ? "max-w-64" : undefined}
			size={p.size ?? "default"}
			invalid={p.invalid ?? false}
			recent={recent}
			onOpenChange={(open) => {
				if (!open)
					setRecent((list) => [value, ...list.filter((c) => c !== value)].slice(0, 6));
			}}
			label={p.label || "Accent"}
		/>
	);
}

export function AttachmentDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Attachment>>(props);
	const variant = p.variant ?? "chip";
	const all = CHAT_ATTACHMENTS.map((a) => a.id as string);
	const [shown, setShown] = useState(all);
	const [retried, setRetried] = useState<string[]>([]);

	return (
		<div className="flex w-full max-w-md flex-col gap-2 rounded-2xl border border-border bg-background p-2">
			{/* Cards are full width, so `wrap` stacks them; chips and tiles scroll in one line. */}
			<Attachments variant={variant === "card" ? "wrap" : "scroll"}>
				{CHAT_ATTACHMENTS.filter((a) => shown.includes(a.id)).map((file, i) => {
					const status =
						i === 0 && file.id === "shot"
							? (p.status ?? "ready")
							: "failed" in file && !retried.includes(file.id)
								? "error"
								: "ready";
					return (
						<Attachment
							key={file.id}
							name={file.name}
							variant={variant}
							status={status}
							progress={p.progress ?? 40}
						>
							<AttachmentPreview src={"src" in file ? file.src : undefined} />
							<AttachmentContent>
								<AttachmentName />
								<AttachmentMeta>{file.meta}</AttachmentMeta>
								{variant === "card" ? <AttachmentProgress /> : null}
							</AttachmentContent>
							<AttachmentRetry onClick={() => setRetried((r) => [...r, file.id])} />
							<AttachmentRemove
								onClick={() => setShown((s) => s.filter((id) => id !== file.id))}
							/>
						</Attachment>
					);
				})}
			</Attachments>
			<div className="flex items-center justify-between gap-2 px-2 pb-1">
				<span className="text-muted-foreground text-sm">Ask about these files</span>
				{shown.length < all.length ? (
					<Button
						size="xs"
						variant="ghost"
						onClick={() => {
							setShown(all);
							setRetried([]);
						}}
					>
						Reset
					</Button>
				) : null}
			</div>
		</div>
	);
}

const COMPOSER_MODELS = [
	{
		value: "fast",
		label: "Fast",
		icon: (
			<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
				<path d="M8.5 1 3 9h4l-.5 6L13 7H9z" />
			</svg>
		),
	},
	{
		value: "reasoning",
		label: "Reasoning",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				aria-hidden
			>
				<path d="M12 2.8a5 5 0 0 0-2.8 9.1c.4.3.6.8.6 1.3v.4h4.4v-.4c0-.5.2-1 .6-1.3A5 5 0 0 0 12 2.8Z" />
				<path d="M9.6 16.2h4.8" strokeLinecap="round" />
			</svg>
		),
	},
];

const COMPOSER_ACTIONS = [
	{
		value: "attach",
		label: "Attach file",
		description: "Upload a document for context",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden
			>
				<path d="M17 3a2.8 2.8 0 1 1 4 4L9.5 18.5a3 3 0 0 1-4.24-4.24L15 4.5" />
			</svg>
		),
	},
	{
		value: "image",
		label: "Add image",
		description: "Attach a screenshot or photo",
		icon: (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden
			>
				<rect x="3" y="4" width="18" height="16" rx="2" />
				<circle cx="8.5" cy="9.5" r="1.5" />
				<path d="m21 15-5-5-9 9" />
			</svg>
		),
	},
];

export function ComposerDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Composer>>(props);
	const [value, setValue] = useState("");
	const [sent, setSent] = useState("");
	const [model, setModel] = useState("fast");
	const [loading, setLoading] = useState(p.loading ?? false);

	useEffect(() => setLoading(p.loading ?? false), [p.loading]);

	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Composer
				value={value}
				onValueChange={setValue}
				onSubmit={(text) => {
					setSent(text);
					setValue("");
					setLoading(true);
				}}
				placeholder={p.placeholder || "Send a message…"}
				size={p.size ?? "default"}
				loading={loading}
				onStop={() => setLoading(false)}
				disabled={p.disabled ?? false}
				maxRows={p.maxRows ?? 8}
				models={COMPOSER_MODELS}
				model={model}
				onModelChange={setModel}
				actions={COMPOSER_ACTIONS}
			/>
			{sent ? <p className="text-muted-foreground text-xs">Sent: {sent}</p> : null}
		</div>
	);
}

const INLINE_CODE =
	"rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs";
const USER_BUBBLE = "rounded-xl bg-input text-foreground px-4 py-2.5";

export function ConversationDemo({ props }: { props: Props }) {
	return (
		<div
			className="w-full max-w-96 rounded-xl border border-border bg-card/40 p-2"
			style={{ height: typeof props.maxHeight === "string" ? props.maxHeight : "22rem" }}
		>
			<Conversation className="h-full">
				<ConversationContent>
					<Message align="end" animated={false}>
						<MessageContent>
							<MessageBubble variant="ghost" className={USER_BUBBLE}>
								Investigate why checkout latency rose after 14:00 UTC. Focus on the latest
								release and give me a safe mitigation.
							</MessageBubble>
						</MessageContent>
					</Message>

					<Reasoning duration={4.8}>Compared traces with the release timeline</Reasoning>

					<div className="flex flex-col gap-3 text-sm leading-relaxed">
						<h3 className="font-heading font-semibold text-base text-foreground">
							What changed
						</h3>
						<p className="text-muted-foreground">
							The latency increase starts in{" "}
							<code className={INLINE_CODE}>POST /checkout</code> immediately after
							release <code className={INLINE_CODE}>web-2418</code>.
						</p>
						<ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
							<li>
								Address validation added{" "}
								<strong className="text-foreground">430 ms</strong> at p95.
							</li>
							<li>The provider timed out for 8% of non-US requests.</li>
							<li>Database and inventory spans stayed within baseline.</li>
						</ul>
						<blockquote className="border-border border-l-2 pl-3 text-muted-foreground">
							Roll back the synchronous validation call, then keep the rule behind the
							existing review queue.
						</blockquote>
					</div>

					<Message align="end" animated={false}>
						<MessageContent>
							<MessageBubble variant="ghost" className={USER_BUBBLE}>
								Show me the smallest rollback and how to verify it.
							</MessageBubble>
						</MessageContent>
					</Message>

					<p className="text-foreground text-sm">Use the targeted flag first:</p>

					<CodeBlock
						language="ts"
						code={
							"await flags.disable('checkout.address-verification');\nawait assertLatencyBelow('checkout', { p95: 300 });"
						}
					/>
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>
		</div>
	);
}

export function ToolDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Tool>>(props);
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Tool
				name={p.name || "search_docs"}
				status={p.status ?? "running"}
				input={'{ "query": "dock magnification" }'}
				output={'{ "matches": 3 }'}
				defaultOpen={p.defaultOpen ?? false}
			/>
			<Tool
				name="read_file"
				status="done"
				input={'{ "path": "dock.tsx" }'}
				output="248 lines"
			/>
		</div>
	);
}

const QUESTIONS: QuestionItem[] = [
	{
		id: "runtime",
		title: "Which runtime should this target?",
		options: [
			{ value: "edge", label: "Edge" },
			{ value: "node", label: "Node" },
			{ value: "both", label: "Both" },
		],
	},
	{
		id: "features",
		title: "Which features does it need?",
		description: "Pick any that apply, or add your own.",
		multiple: true,
		allowCustom: true,
		customPlaceholder: "Add another requirement…",
		options: [
			{ value: "streaming", label: "Streaming responses" },
			{ value: "auth", label: "Auth middleware" },
			{ value: "caching", label: "Response caching" },
		],
	},
	{
		id: "priority",
		title: "How urgent is this?",
		options: [
			{ value: "now", label: "Ship this week" },
			{ value: "soon", label: "Next sprint" },
			{ value: "later", label: "No rush" },
		],
	},
];

export function QuestionDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof Question>>(props);
	const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
	return (
		<div className="w-full max-w-sm">
			<Question
				key={String(props.layout)}
				layout={p.layout ?? "card"}
				questions={QUESTIONS}
				onSubmit={setSubmitted}
			/>
			{submitted ? (
				<p className="mt-2 text-muted-foreground text-xs">
					Submitted: {JSON.stringify(submitted)}
				</p>
			) : null}
		</div>
	);
}
