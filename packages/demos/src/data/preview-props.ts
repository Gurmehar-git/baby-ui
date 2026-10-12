import { EMAIL_SAMPLES } from "./email-samples";
import { OG_SAMPLE_BY_PROPS, OG_SAMPLES } from "./og-samples";
import { USAGE_METER } from "./storage";

/** Samples that follow a control value, keyed by slug. */
export const SAMPLE_BY_PROPS: Record<
	string,
	(props: Record<string, unknown>) => Record<string, unknown>
> = {
	...OG_SAMPLE_BY_PROPS,
	"usage-card": (props) => (props.layout === "meter" ? USAGE_METER : {}),
};

/** Control values minus the unset ones, typed as the component's props (controls come from its spec). */
export function controlProps<Props>(props: Record<string, unknown> | undefined): Props {
	return Object.fromEntries(
		Object.entries(props ?? {}).filter(
			([, value]) => value !== undefined && value !== "",
		),
	) as Props;
}

/** Resolves site-hosted sample assets (`logoUrl: "/email/..."`) against the rendering origin. */
export function withSiteAssets(
	props: Record<string, unknown>,
	origin: string,
): Record<string, unknown> {
	return Object.fromEntries(
		Object.entries(props).map(([key, value]) => [
			key,
			key.endsWith("Url") && typeof value === "string" && value.startsWith("/")
				? `${origin}${value}`
				: value,
		]),
	);
}

const TEMPLATE_SAMPLES: Record<string, Record<string, unknown>> = {
	...OG_SAMPLES,
	...EMAIL_SAMPLES,
};

/**
 * Props a template previews with, in the auto demos' spread order: sample, values derived from
 * the controls, then set control values. Used by the OG/email endpoints and `pnpm emails`.
 */
export function previewProps(
	slug: string,
	controls: Record<string, unknown>,
	sample: Record<string, unknown> = TEMPLATE_SAMPLES[slug] ?? {},
): Record<string, unknown> {
	return {
		...sample,
		...(SAMPLE_BY_PROPS[slug]?.(controls) ?? {}),
		...controlProps<Record<string, unknown>>(controls),
	};
}
