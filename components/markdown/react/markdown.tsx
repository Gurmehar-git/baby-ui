import { Markdown as DocviaMarkdown, StreamingMarkdown } from "@docvia/markdown/react";
import { cn } from "../../lib/react/cn";
import { type MarkdownAnimate, markdownMotion } from "./motion";
import { type MarkdownSize, type MarkdownVariant, markdown } from "./variants";

export type { MarkdownAnimate, MarkdownSize, MarkdownVariant };

export interface MarkdownProps {
	/** Markdown source; while streaming, the whole text so far. */
	content: string;
	variant?: MarkdownVariant;
	size?: MarkdownSize;
	/** `true` while chunks arrive, `false` once done. Unset renders static text. */
	streaming?: boolean;
	/** Word entry while streaming: `true` fades, an effect name picks another, `false` is off. */
	animate?: MarkdownAnimate;
	/** Blinking caret after the last word while streaming. */
	caret?: boolean;
	className?: string;
}

export function Markdown({
	content,
	variant = "default",
	size = "default",
	streaming,
	animate = "fade",
	caret = true,
	className,
}: MarkdownProps) {
	return (
		<div
			data-slot="markdown"
			aria-busy={streaming || undefined}
			className={cn(markdown({ variant, size }), className)}
		>
			{streaming === undefined ? (
				<DocviaMarkdown>{content}</DocviaMarkdown>
			) : (
				<StreamingMarkdown
					streaming={streaming}
					animate={markdownMotion(animate)}
					caret={caret}
				>
					{content}
				</StreamingMarkdown>
			)}
		</div>
	);
}
