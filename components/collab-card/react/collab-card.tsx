import { Avatar, AvatarImage } from "../../avatar/react/avatar";
import { cn } from "../../lib/react/cn";
import { type CollabCardTone, collabCard } from "./variants";

export type { CollabCardTone };

export type CollabCardCollaborator = {
	name: string;
	/** Tailwind background class for the name pill. */
	pill: string;
	/** Tailwind text class for the pill label. */
	pillText?: string;
	/** Tailwind text color class for the cursor (sets `color`, read by the SVG's `fill`). */
	cursor: string;
};

export interface CollabCardProps {
	/** The two named editors whose cursors click on the pills below the frame. */
	collaborators: [CollabCardCollaborator, CollabCardCollaborator];
	/** Avatar swatch colors for the visible presence stack (left to right). */
	presenceColors: string[];
	/** Avatar image URLs, matched to `presenceColors` by index; the colour shows until each loads. */
	presenceAvatars?: string[];
	/** Editors beyond the visible swatches, shown as a `+N` avatar. */
	extraCount?: number;
	greeting: string;
	eyebrow: string;
	intro: string;
	conjunction?: string;
	trailing?: string;
	/** Status line beside the live dot. Defaults to a count derived from `presenceColors`/`extraCount`. */
	liveLabel?: string;
	/** Background image URL. Falls back to the tone's canvas gradient. */
	backgroundUrl?: string;
	tone?: CollabCardTone;
	className?: string;
}

const OVERLAP = "-ml-[1.08cqi]";
const CORNERS = [
	"-left-[0.9cqi] -top-[0.9cqi]",
	"-right-[0.9cqi] -top-[0.9cqi]",
	"-left-[0.9cqi] -bottom-[0.9cqi]",
	"-right-[0.9cqi] -bottom-[0.9cqi]",
];

function Cursor({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden className={className}>
			<path
				d="M4 3.2 L4 19.4 L8.6 15.2 L11.4 21.2 L14 20 L11.2 14 L17.2 13.6 Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function ClickBurst({ className }: { className?: string }) {
	return (
		<span
			data-burst=""
			aria-hidden
			className={cn(
				"pointer-events-none absolute inline-block h-[3cqi] w-[3cqi]",
				"before:absolute before:inset-[35%] before:rounded-full before:bg-current",
				"after:absolute after:inset-0 after:rounded-full",
				"after:bg-[conic-gradient(from_0deg,transparent_0_8%,currentColor_8%_12%,transparent_12%_33%,currentColor_33%_37%,transparent_37%_58%,currentColor_58%_62%,transparent_62%_83%,currentColor_83%_87%,transparent_87%)]",
				"after:mask-[radial-gradient(circle,transparent_38%,black_40%,black_60%,transparent_62%)]",
				className,
			)}
		/>
	);
}

export function CollabCard({
	collaborators,
	presenceColors,
	presenceAvatars = [],
	extraCount = 0,
	greeting,
	eyebrow,
	intro,
	conjunction = "&",
	trailing = "",
	liveLabel,
	backgroundUrl,
	tone = "inverted",
	className,
}: CollabCardProps) {
	const [first, second] = collaborators;
	const editing = liveLabel ?? `Live · ${presenceColors.length + extraCount} editing`;
	const styles = collabCard({ tone });

	return (
		<div
			data-slot="collab-card"
			data-tone={tone}
			className={cn(styles.root(), className)}
			style={
				backgroundUrl
					? {
							backgroundImage: `url(${backgroundUrl})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}
					: undefined
			}
		>
			{backgroundUrl ? null : <div aria-hidden className={styles.backdrop()} />}
			<div aria-hidden className={styles.glow()} />
			<div aria-hidden className={styles.dots()} />

			<header className="absolute inset-x-[5cqi] top-[4cqi] z-10 flex items-center justify-between gap-[2cqi]">
				<span className={styles.status()}>
					<span className="relative inline-flex h-[1.7cqi] w-[1.7cqi] shrink-0">
						<span className={styles.livePing()} />
						<span className={styles.liveDot()} />
					</span>
					<span className="truncate tabular-nums leading-snug">{editing}</span>
				</span>
				<ul className="m-0 flex list-none items-center p-0" aria-hidden>
					{presenceColors.map((color, index) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: items render in a fixed order and can repeat, so position is the identity.
							key={`${color}-${index}`}
							className={cn("relative size-[3.25cqi] shrink-0", index > 0 && OVERLAP)}
							style={{ zIndex: index + 1 }}
						>
							<Avatar className={styles.swatch()} style={{ backgroundColor: color }}>
								<AvatarImage src={presenceAvatars[index]} alt="" />
							</Avatar>
						</li>
					))}
					{extraCount > 0 ? (
						<li
							className={cn("relative size-[3.25cqi] shrink-0", OVERLAP)}
							style={{ zIndex: presenceColors.length + 1 }}
						>
							<span className={styles.extra()}>+{extraCount}</span>
						</li>
					) : null}
				</ul>
			</header>

			<div className="relative flex h-full w-full flex-col items-center justify-center gap-[3.2cqi] px-[5.5cqi] pt-[9cqi] pb-[5cqi]">
				<p className={styles.eyebrow()}>{eyebrow}</p>

				<div className="relative w-[80%] max-w-full">
					<div className={styles.frame()}>
						{CORNERS.map((pos) => (
							<span key={pos} aria-hidden className={cn(styles.handle(), pos)} />
						))}
						<h2 className="font-(family-name:--font-heading) font-medium text-[17.5cqi] leading-[0.92] tracking-tight">
							{greeting}
						</h2>
					</div>

					<span
						aria-hidden
						className="collab-cursor collab-cursor--host pointer-events-none absolute top-[-3.6cqi] left-[-2.8cqi]"
					>
						<Cursor className={styles.cursor()} />
					</span>
				</div>

				<p className={styles.line()}>
					<span className={styles.muted()}>{intro}</span>

					<span className="relative inline-flex items-center">
						<span className={cn(styles.pill(), first.pill, first.pillText)}>
							{first.name}
						</span>
						<span
							aria-hidden
							className={cn(
								"collab-cursor collab-cursor--first pointer-events-none absolute right-[-1.8cqi] bottom-[-2.9cqi]",
								first.cursor,
							)}
						>
							<Cursor className={cn(styles.cursor(), "-scale-x-100")} />
							<ClickBurst className="top-[-0.7cqi] right-[-0.7cqi]" />
						</span>
					</span>

					<span className={styles.faint()}>{conjunction}</span>

					<span className="relative inline-flex items-center">
						<span className={cn(styles.pill(), second.pill, second.pillText)}>
							{second.name}
						</span>
						<span
							aria-hidden
							className={cn(
								"collab-cursor collab-cursor--second pointer-events-none absolute top-[-3.2cqi] right-[-2.8cqi]",
								second.cursor,
							)}
						>
							<Cursor className={styles.cursor()} />
							<ClickBurst className="bottom-[-0.7cqi] left-[-0.7cqi]" />
						</span>
					</span>

					{trailing ? <span className={styles.muted()}>{trailing}</span> : null}
				</p>
			</div>
		</div>
	);
}
