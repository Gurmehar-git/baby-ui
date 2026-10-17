import { z } from "zod";

const record = z.record(z.string(), z.string());

// Lenient on purpose: third-party registries omit fields our own build always writes.
export const RegistryFileSchema = z
	.object({
		path: z.string().optional(),
		content: z.string().optional(),
		type: z.string(),
		target: z.string().optional(),
	})
	// shadcn-svelte 1.x items give only a `target`.
	.transform(({ path, ...file }, ctx) => {
		const resolved = path ?? file.target;
		if (resolved !== undefined) return { ...file, path: resolved };
		ctx.addIssue({ code: "custom", message: "a file needs a path or a target" });
		return z.NEVER;
	});

export const RegistryItemSchema = z.object({
	name: z.string(),
	type: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	dependencies: z.array(z.string()).optional(),
	devDependencies: z.array(z.string()).optional(),
	registryDependencies: z.array(z.string()).optional(),
	files: z.array(RegistryFileSchema).optional(),
	cssVars: z.record(z.string(), record).optional(),
	css: z.record(z.string(), z.unknown()).optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});

export type RegistryFile = z.infer<typeof RegistryFileSchema>;
export type RegistryItem = z.infer<typeof RegistryItemSchema>;

export const RegistryIndexSchema = z.array(
	z.object({
		name: z.string(),
		type: z.string(),
		title: z.string().optional(),
		description: z.string().optional(),
	}),
);

export type RegistryIndex = z.infer<typeof RegistryIndexSchema>;
