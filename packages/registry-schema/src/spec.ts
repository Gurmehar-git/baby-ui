import { z } from "zod";
import { CATEGORIES, CATEGORY } from "./categories.ts";
import { PropSpecSchema } from "./control.ts";

export const FRAMEWORKS = ["react", "svelte"] as const;

export const CategorySchema = z.enum(CATEGORIES);
export const FrameworkSchema = z.enum(FRAMEWORKS);
export type Framework = z.infer<typeof FrameworkSchema>;

/** Mirrors shadcn's registry-item file types; both CLIs accept the same set. */
export const FileTypeSchema = z.enum([
	"registry:ui",
	"registry:component",
	"registry:lib",
	"registry:hook",
	"registry:block",
	"registry:page",
	"registry:file",
	"registry:style",
	"registry:theme",
]);

export const SpecFileSchema = z.object({
	/** Path inside the implementation package, relative to its `src/`. */
	path: z.string().min(1),
	type: FileTypeSchema.default("registry:ui"),
	/** Install destination in the consumer's app. Required for page/file types. */
	target: z.string().optional(),
});

export const ImplSchema = z.object({
	/** Named export the demo and registry entry point at. */
	entry: z.string().min(1),
	files: z.array(SpecFileSchema).min(1),
	/** npm packages the copied source imports. Must be exhaustive: this is the install list. */
	dependencies: z.array(z.string()).default([]),
	registryDependencies: z.array(z.string()).default([]),
});

export type Impl = z.infer<typeof ImplSchema>;

/** Attribution for a ported component. Drives THIRD_PARTY_LICENSES generation. */
export const LicenseOriginSchema = z.object({
	source: z.string().min(1),
	url: z.string().url(),
	license: z.string().min(1),
	copyright: z.string().min(1),
});

export const MotionSpecSchema = z.object({
	/** Named springs from @baby-ui/tokens this component uses. */
	springs: z.array(z.enum(["snappy", "gentle", "bouncy"])).default([]),
	/** What the component does under prefers-reduced-motion. Required if it animates. */
	reducedMotion: z.string().min(1),
	/** Behaviour both ports must match, written as observable facts, not implementation. */
	behaviour: z.array(z.string()).default([]),
});

/** One row of the Keys | Action table: `{ keys: ["Enter", "Space"], action: "Toggles the panel" }`. */
export const KeyBindingSchema = z.object({
	/** Each entry is one key or chord as printed: "Tab", "Shift+Tab", "Arrow Left", "Page Up". */
	keys: z.array(z.string().min(1)).min(1),
	action: z.string().min(1),
});

export const A11ySchema = z.object({
	role: z.string().optional(),
	keyboard: z.array(KeyBindingSchema).default([]),
	notes: z.array(z.string()).default([]),
});

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Choosing and using the component well; read by the page, its markdown twin and agents. */
export const GuidanceSchema = z.object({
	when: z.array(z.string().min(1)).default([]),
	/** `use` names the component to reach for instead; registry-build checks the slug exists. */
	whenNot: z
		.array(z.object({ text: z.string().min(1), use: z.string().regex(SLUG).optional() }))
		.default([]),
	responsive: z.array(z.string().min(1)).default([]),
	performance: z.array(z.string().min(1)).default([]),
	/** Pitfalls and choices an agent gets wrong without being told. */
	ai: z.array(z.string().min(1)).default([]),
});

export type KeyBinding = z.infer<typeof KeyBindingSchema>;
export type Guidance = z.infer<typeof GuidanceSchema>;

export const ComponentSpecSchema = z.object({
	slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
	name: z.string().min(1),
	description: z.string().min(1),
	category: CategorySchema,
	tier: z.enum(["free", "pro"]).default("free"),
	status: z.enum(["stable", "beta", "alpha", "experimental"]).default("beta"),
	/** Hidden from the catalog, nav, search and counts; the registry still serves it so installs keep working. */
	retired: z.boolean().default(false),
	/** Badged "New" and listed first; clear it once the component has settled. */
	isNew: z.boolean().default(false),
	/** Badged "Updated" after a user-facing change, unless `isNew` is set; clear it with the next release. */
	isUpdated: z.boolean().default(false),

	props: z.array(PropSpecSchema).default([]),
	/** Named variant axes, e.g. `{ variant: ["default","ghost"], size: ["sm","lg"] }`. */
	variants: z.record(z.string(), z.array(z.string())).default({}),

	/** A framework key is absent until that port exists. */
	impl: z
		.object({ react: ImplSchema.optional(), svelte: ImplSchema.optional() })
		.refine((v) => v.react || v.svelte, "at least one implementation required"),

	/**
	 * `auto`: `pnpm gen` writes both demos, rendering `impl.*.entry` with the typed sample export
	 * named after the slug (OG_BLOG_POST) plus control values; `frame` sizes the preview.
	 */
	demo: z
		.object({
			mode: z.literal("auto"),
			frame: z.enum(["og", "none", "sm", "md", "lg", "xl", "full"]).default("none"),
		})
		.optional(),

	motion: MotionSpecSchema.optional(),
	a11y: A11ySchema.default({ keyboard: [], notes: [] }),
	guidance: GuidanceSchema.default({
		when: [],
		whenNot: [],
		responsive: [],
		performance: [],
		ai: [],
	}),
	licenseOrigin: LicenseOriginSchema.optional(),

	/** CSS custom properties the component reads, beyond the shared token layer. */
	cssVars: z.record(z.string(), z.string()).default({}),
	keywords: z.array(z.string()).default([]),
	/** Overrides the category's install folder, e.g. `emails/ui` for the email kit. */
	installDir: z.string().optional(),
});

export type ComponentSpec = z.infer<typeof ComponentSpecSchema>;
export type ComponentSpecInput = z.input<typeof ComponentSpecSchema>;

export function installDir(spec: Pick<ComponentSpec, "category" | "installDir">): string {
	return spec.installDir ?? CATEGORY[spec.category].installDir;
}

/** Initial control values, from each prop's declared default; booleans default to false. */
export function defaultProps(
	spec: Pick<ComponentSpec, "props">,
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const prop of spec.props) {
		if (prop.control.kind === "none") continue;
		out[prop.name] =
			prop.default ?? (prop.control.kind === "boolean" ? false : undefined);
	}
	return out;
}

/** Authoring helper: validates at module load so a bad spec fails the build, not a request. */
export function defineComponent(spec: ComponentSpecInput): ComponentSpec {
	return ComponentSpecSchema.parse(spec);
}
