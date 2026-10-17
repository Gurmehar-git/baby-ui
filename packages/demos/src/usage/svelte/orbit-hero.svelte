<script lang="ts">
import {
	OrbitHero,
	OrbitHeroAction,
	OrbitHeroActions,
	OrbitHeroContent,
	OrbitHeroDescription,
	OrbitHeroSubheading,
	OrbitHeroTitle,
} from "@baby-ui/svelte";

const groups = [
	{
		label: "Frameworks",
		outer: ["React", "Svelte", "Vue", "Solid", "Angular", "Astro", "Qwik", "Lit"],
		inner: ["Next", "Kit", "Nuxt", "Remix"],
	},
	{
		label: "Runtimes",
		outer: ["Node", "Bun", "Deno", "Workers", "Lambda", "Edge", "WASM", "Docker"],
		inner: ["V8", "JSC", "QJS", "SM"],
	},
];
</script>

<OrbitHero {groups}>
	{#snippet item(name)}
		<span class="text-xs font-medium">{name.slice(0, 2)}</span>
	{/snippet}
	<OrbitHeroContent>
		<OrbitHeroTitle>
			Icons for
			<OrbitHeroSubheading>Modern Frameworks</OrbitHeroSubheading>
		</OrbitHeroTitle>
		<OrbitHeroDescription>One icon set, packaged for every stack you ship.</OrbitHeroDescription>
		<OrbitHeroActions>
			<OrbitHeroAction href="/icons">Explore</OrbitHeroAction>
			<OrbitHeroAction variant="outline" href="/docs">Get started</OrbitHeroAction>
		</OrbitHeroActions>
	</OrbitHeroContent>
</OrbitHero>
