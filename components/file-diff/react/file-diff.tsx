import { cn } from "../../lib/cn";
import { type DiffLineKind, diffRow } from "../variants";

export type DiffLine = { kind: DiffLineKind; text: string };

const MARK = { add: "+", remove: "-", context: " " };

export interface FileDiffProps {
	filename: string;
	lines: DiffLine[];
	showLineNumbers?: boolean;
	className?: string;
}

export function FileDiff({
	filename,
	lines,
	showLineNumbers = true,
	className,
}: FileDiffProps) {
	const added = lines.filter((l) => l.kind === "add").length;
	const removed = lines.filter((l) => l.kind === "remove").length;

	return (
		<div
			data-slot="file-diff"
			className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}
		>
			<div
				data-slot="file-diff-header"
				className="flex items-center justify-between gap-3 border-border border-b bg-background/60 px-4 py-2.5"
			>
				<span className="truncate font-mono text-foreground text-xs">{filename}</span>
				<span className="flex shrink-0 items-center gap-2 font-mono text-xs">
					<span className="text-success-strong">+{added}</span>
					<span className="text-destructive-strong">-{removed}</span>
				</span>
			</div>

			<div
				data-slot="file-diff-content"
				className="overflow-x-auto font-mono text-sm leading-relaxed"
			>
				{lines.map((line, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
						key={i}
						data-slot="file-diff-line"
						data-kind={line.kind}
						className={diffRow({ kind: line.kind })}
					>
						{showLineNumbers ? (
							<span
								aria-hidden
								className="mr-3 inline-block w-6 shrink-0 select-none text-right text-muted-foreground/60"
							>
								{i + 1}
							</span>
						) : null}
						<span aria-hidden className="mr-2 inline-block w-2 shrink-0 select-none">
							{MARK[line.kind]}
						</span>
						<span>
							<span className="sr-only">
								{line.kind === "add"
									? "Added: "
									: line.kind === "remove"
										? "Removed: "
										: ""}
							</span>
							{line.text || " "}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
