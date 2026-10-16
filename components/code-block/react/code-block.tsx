import { useMemo } from "react";
import { CopyButton } from "../../copy-button/react/copy-button";
import { cn } from "../../lib/react/cn";

export interface CodeBlockProps {
	code: string;
	/** Pre-highlighted markup from Shiki, highlight.js or similar; `code` stays the copy source. */
	html?: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	maxHeight?: string;
	className?: string;
}

export function CodeBlock({
	code,
	html,
	language = "ts",
	filename,
	showLineNumbers = false,
	maxHeight = "24rem",
	className,
}: CodeBlockProps) {
	const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

	return (
		// Inset frame: a tinted rim holds the header, the code sits on an inner surface whose
		// radius is the outer one minus border and inset.
		<div
			data-slot="code-block"
			className={cn(
				"min-w-0 max-w-full rounded-xl border border-border bg-card p-1 text-foreground",
				className,
			)}
		>
			<div className="flex min-h-8 items-center gap-2 px-1 pb-1">
				<span className="inline-flex h-5 shrink-0 items-center rounded border border-border bg-background px-1.5 font-mono font-semibold text-xs text-muted-foreground uppercase tracking-wider">
					{language}
				</span>
				{filename ? (
					<span className="truncate font-mono text-muted-foreground text-xs">
						{filename}
					</span>
				) : null}
				<div className="ml-auto shrink-0">
					<CopyButton text={code} iconOnly />
				</div>
			</div>
			<div className="overflow-hidden rounded-[calc(var(--radius-xl)-1px-0.25rem)] bg-background">
				{html ? (
					<div
						style={{ maxHeight }}
						className="scroll-area overflow-auto py-4 font-mono text-sm leading-[1.7] [&_.line]:px-5 [&_code]:block [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre>code:not(:has(.line))]:px-5"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: `html` is the caller's own highlighter output, by contract.
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				) : (
					<pre
						style={{ maxHeight }}
						className="scroll-area overflow-auto py-4 font-mono text-sm leading-[1.7]"
					>
						<code>
							{lines.map((line, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
								<span key={i} className="flex px-5">
									{showLineNumbers ? (
										<span
											aria-hidden
											className="mr-4 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/60"
										>
											{i + 1}
										</span>
									) : null}
									<span className="text-foreground">{line || " "}</span>
								</span>
							))}
						</code>
					</pre>
				)}
			</div>
		</div>
	);
}
