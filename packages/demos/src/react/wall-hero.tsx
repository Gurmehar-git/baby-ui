"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	Badge,
	Button,
	MessageActions,
	MessageActionsBar,
	MessageActionsCopy,
	MessageActionsFeedback,
	MessageActionsRegenerate,
	Progress,
	ReactionBar,
	ReactionBarCount,
	ReactionBarIcon,
	ReactionBarItem,
	Switch,
	WallHero,
	WallHeroActions,
	WallHeroBrand,
	WallHeroCard,
	WallHeroColumn,
	WallHeroCommand,
	WallHeroContent,
	WallHeroDescription,
	WallHeroTitle,
	WallHeroWall,
} from "@baby-ui/react";
import type { ComponentProps } from "react";
import { controlProps } from "../data/preview-props";
import { REACTION_BAR_ITEMS } from "../data/reaction-bar";
import {
	WALL_HERO_COMMAND,
	WALL_HERO_SETTINGS,
	WALL_HERO_TAGS,
	WALL_HERO_TEAM,
} from "../data/wall-hero";

function Mark() {
	return (
		<svg viewBox="0 0 28 28" aria-hidden="true" className="text-foreground">
			<rect x="3" y="9" width="12" height="16" rx="3" fill="currentColor" />
			<rect
				x="13"
				y="3"
				width="12"
				height="12"
				rx="3"
				fill="currentColor"
				opacity="0.45"
			/>
		</svg>
	);
}

export function WallHeroDemo({ props }: { props: Record<string, unknown> }) {
	const p = controlProps<ComponentProps<typeof WallHero>>(props);
	return (
		<WallHero variant={p.variant}>
			<WallHeroContent>
				<WallHeroBrand>
					<Mark />
					Baby UI
				</WallHeroBrand>
				<WallHeroTitle>Components with calm motion</WallHeroTitle>
				<WallHeroDescription>
					Composable parts for React and Svelte. Install one with the shadcn CLI and own
					the source.
				</WallHeroDescription>
				<WallHeroCommand command={WALL_HERO_COMMAND} />
				<WallHeroActions>
					<Button href="#components">Browse components</Button>
					<Button href="#docs" variant="outline">
						Read the docs
					</Button>
				</WallHeroActions>
			</WallHeroContent>
			<WallHeroWall>
				<WallHeroColumn duration="70s">
					<WallHeroCard>
						<Progress label="Profile setup" value={60} showValue />
					</WallHeroCard>
					<WallHeroCard>
						<ReactionBar value={["like"]}>
							{REACTION_BAR_ITEMS.slice(0, 3).map((item) => (
								<ReactionBarItem
									key={item.value}
									value={item.value}
									label={item.label}
									count={item.count}
									tone={item.tone}
								>
									<ReactionBarIcon icon={item.value} />
									<ReactionBarCount />
								</ReactionBarItem>
							))}
						</ReactionBar>
					</WallHeroCard>
					<WallHeroCard className="grid gap-3">
						{WALL_HERO_SETTINGS.map((s) => (
							<Switch key={s.label} label={s.label} checked={s.checked} size="sm" />
						))}
					</WallHeroCard>
				</WallHeroColumn>
				<WallHeroColumn direction="down" duration="85s">
					<WallHeroCard className="grid gap-2">
						<p className="m-0 text-sm">Lisbon in May is mild, about 22°C by day.</p>
						<MessageActions variant="solid">
							<MessageActionsBar>
								<MessageActionsCopy text="Lisbon in May is mild." />
								<MessageActionsRegenerate />
								<MessageActionsFeedback />
							</MessageActionsBar>
						</MessageActions>
					</WallHeroCard>
					<WallHeroCard className="flex items-center justify-between gap-3">
						<AvatarGroup>
							{WALL_HERO_TEAM.map((initials) => (
								<Avatar key={initials}>
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>
							))}
						</AvatarGroup>
						<Badge variant="success">4 online</Badge>
					</WallHeroCard>
					<WallHeroCard>
						<Progress label="Storage" value={82} tone="info" showValue />
					</WallHeroCard>
				</WallHeroColumn>
				<WallHeroColumn duration="78s">
					<WallHeroCard className="flex flex-wrap gap-1.5">
						{WALL_HERO_TAGS.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</WallHeroCard>
					<WallHeroCard className="grid gap-1">
						<span className="text-muted-foreground text-xs">Revenue</span>
						<span className="flex items-baseline gap-2 font-medium text-2xl tabular-nums">
							$96.4k
							<Badge variant="success">+7.9%</Badge>
						</span>
					</WallHeroCard>
					<WallHeroCard>
						<Progress label="Onboarding" value={40} showValue />
					</WallHeroCard>
				</WallHeroColumn>
			</WallHeroWall>
		</WallHero>
	);
}
