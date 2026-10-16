import { z } from "zod";
import { CategorySchema } from "./spec.ts";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** What a `components/<slug>/index.md` must have: docvia's per-collection schema for components. */
export const ComponentDocRequiredSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	component: z.string().regex(SLUG, "component must be a kebab-case slug"),
	category: CategorySchema,
});

/**
 * Deliberately only stable identity: docvia's content hash includes frontmatter, so
 * embedding the full spec would bust every doc's cache on any registry rebuild.
 */
export const ComponentDocFrontmatterSchema = ComponentDocRequiredSchema.extend({
	tags: z.array(z.string()).default([]),
	draft: z.boolean().default(false),
	order: z.number().optional(),
});

export type ComponentDocFrontmatter = z.infer<typeof ComponentDocFrontmatterSchema>;
