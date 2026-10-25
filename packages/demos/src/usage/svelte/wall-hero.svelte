<script lang="ts">
import {
	Button,
	WallHero,
	WallHeroActions,
	WallHeroCard,
	WallHeroColumn,
	WallHeroCommand,
	WallHeroContent,
	WallHeroDescription,
	WallHeroTitle,
	WallHeroWall,
} from "@baby-ui/svelte";

const tiles = ["Charts", "Forms", "Agents", "Motion"];
const directions = ["up", "down", "up"] as const;
</script>

<WallHero>
	<WallHeroContent>
		<WallHeroTitle>Ship the calm version</WallHeroTitle>
		<WallHeroDescription>Components for product teams.</WallHeroDescription>
		<WallHeroCommand command="npx shadcn@latest add @baby-ui/wall-hero" />
		<WallHeroActions>
			<Button href="/docs">Get started</Button>
		</WallHeroActions>
	</WallHeroContent>
	<WallHeroWall>
		{#each directions as direction, i (i)}
			<WallHeroColumn {direction}>
				{#each tiles as tile (tile)}
					<WallHeroCard>{tile}</WallHeroCard>
				{/each}
			</WallHeroColumn>
		{/each}
	</WallHeroWall>
</WallHero>
