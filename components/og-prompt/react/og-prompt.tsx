import { cn } from "../../lib/cn";
import { type OgPromptMode, type OgPromptTone, ogPrompt } from "../variants";

export type { OgPromptMode, OgPromptTone };

export interface OgPromptProps {
	/** Brand name set as the wordmark; one line. */
	name: string;
	/** Text already typed in the prompt box. */
	placeholder: string;
	/** One line under the wordmark. */
	description?: string;
	/** Logo image URL beside the name. */
	logo?: string;
	mode?: OgPromptMode;
	tone?: OgPromptTone;
	className?: string;
}

/** A 1200x630 card: a wordmark over a chat prompt box that rises from a band of colour. */
export function OgPrompt({
	name,
	placeholder,
	description,
	logo,
	mode = "dark",
	tone = "chart",
	className,
}: OgPromptProps) {
	const s = ogPrompt({ mode, tone });
	return (
		<div data-slot="og-prompt" className={cn(s.root(), className)}>
			<span className={s.wash()} />
			<span className={s.aura()} />
			<div className={s.brand()}>
				{logo ? <img src={logo} alt="" className={s.logo()} /> : null}
				<span className={s.name()}>{name}</span>
			</div>
			{description ? <p className={s.description()}>{description}</p> : null}
			<div className={s.box()}>
				<div className={s.field()}>
					<span>{placeholder}</span>
					<span className={s.caret()} />
				</div>
				<span className={s.send()}>
					<svg
						viewBox="0 0 24 24"
						width="36"
						height="36"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.4"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden
					>
						<path d="M12 19V5M5 12l7-7 7 7" />
					</svg>
				</span>
			</div>
		</div>
	);
}
