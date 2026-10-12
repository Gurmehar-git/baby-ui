import origins from "#lib/generated/origins.json";

type Framework = "react" | "svelte";

const CLI = { react: "shadcn@latest", svelte: "shadcn-svelte@latest" } as const;
const ROUTE = { react: "r", svelte: "svelte/r" } as const;

/** The registry item URL; JS gets its own route, so the language switch changes what the CLI writes. */
export const installUrl = (slug: string, framework: Framework, dialect: string) =>
	`${origins.registry}/${ROUTE[framework]}${dialect === "js" ? "/js" : ""}/${slug}.json`;

/** The `dlx` arguments that add a component with the framework's shadcn CLI. */
export const installArgs = (slug: string, framework: Framework, dialect: string) =>
	`${CLI[framework]} add ${installUrl(slug, framework, dialect)}`;
