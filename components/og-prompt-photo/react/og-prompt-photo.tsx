import { cn } from "../../lib/react/cn";
import { type OgPromptPhotoMode, ogPromptPhoto } from "./variants";

export type { OgPromptPhotoMode };

export interface OgPromptPhotoProps {
	/** Headline over the photo, up to two lines. */
	title: string;
	/** Background photo URL; keep the middle calm so the title reads. */
	image: string;
	/** Example prompt shown in the box. */
	placeholder: string;
	/** Option chips along the bottom of the box. */
	chips?: string[];
	mode?: OgPromptPhotoMode;
	className?: string;
}

/** A 1200x630 card: a headline and an AI prompt box with option chips over a photo. */
export function OgPromptPhoto({
	title,
	image,
	placeholder,
	chips = [],
	mode = "light",
	className,
}: OgPromptPhotoProps) {
	const s = ogPromptPhoto({ mode });
	return (
		<div data-slot="og-prompt-photo" className={cn(s.root(), className)}>
			<img src={image} alt="" className={s.image()} />
			<p className={s.title()}>{title}</p>
			<div className={s.card()}>
				<div className={s.field()}>
					<span className={s.caret()} />
					<span>{placeholder}</span>
				</div>
				<div className={s.row()}>
					<span className={s.iconChip()}>
						<svg
							viewBox="0 0 24 24"
							width="22"
							height="22"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<rect x="3" y="4" width="18" height="16" rx="3" />
							<path d="m4 17 5-5 4 4 3-3 4 4" />
							<circle cx="15.5" cy="9" r="1.5" />
						</svg>
					</span>
					{chips.map((chip) => (
						<span key={chip} className={s.chip()}>
							{chip}
						</span>
					))}
					<span className={s.send()}>
						<svg
							viewBox="0 0 24 24"
							width="26"
							height="26"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
						>
							<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
						</svg>
					</span>
				</div>
			</div>
		</div>
	);
}
