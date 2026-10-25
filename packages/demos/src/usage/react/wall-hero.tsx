"use client";

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
} from "@baby-ui/react";

const tiles = ["Charts", "Forms", "Agents", "Motion"];
const columns = [
	{ id: "left", direction: "up" },
	{ id: "middle", direction: "down" },
	{ id: "right", direction: "up" },
] as const;

export function Example() {
	return (
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
				{columns.map((column) => (
					<WallHeroColumn key={column.id} direction={column.direction}>
						{tiles.map((tile) => (
							<WallHeroCard key={tile}>{tile}</WallHeroCard>
						))}
					</WallHeroColumn>
				))}
			</WallHeroWall>
		</WallHero>
	);
}
