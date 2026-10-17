"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarGroup,
	AvatarImage,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CtaSection,
	CtaSectionAction,
	CtaSectionActions,
	CtaSectionContent,
	CtaSectionDescription,
	CtaSectionDismiss,
	CtaSectionNote,
	CtaSectionPoint,
	CtaSectionPoints,
	CtaSectionTitle,
	CtaSectionVisual,
	Progress,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { CTA_COPY, CTA_FACES, CTA_SETUP } from "../data/cta";
import { controlProps } from "../data/preview-props";

export function CtaSectionDemo({ props }: { props: Record<string, unknown> }) {
	const variant =
		controlProps<ComponentProps<typeof CtaSection>>(props).variant ?? "centered";
	const [open, setOpen] = useState(true);
	if (variant === "banner") {
		const copy = CTA_COPY.banner;
		return (
			<div className="grid w-full gap-3">
				<CtaSection variant="banner" open={open} onOpenChange={setOpen}>
					<CtaSectionContent>
						<CtaSectionTitle>{copy.title}</CtaSectionTitle>
						<CtaSectionDescription>{copy.description}</CtaSectionDescription>
					</CtaSectionContent>
					<CtaSectionActions>
						<CtaSectionAction href={copy.primaryAction.href}>
							{copy.primaryAction.label}
						</CtaSectionAction>
						<CtaSectionDismiss />
					</CtaSectionActions>
				</CtaSection>
				{open ? null : (
					<Button
						variant="outline"
						size="sm"
						className="justify-self-center"
						onClick={() => setOpen(true)}
					>
						Show the banner again
					</Button>
				)}
			</div>
		);
	}
	if (variant === "split") {
		const copy = CTA_COPY.split;
		return (
			<CtaSection variant="split">
				<CtaSectionContent>
					<CtaSectionTitle>{copy.title}</CtaSectionTitle>
					<CtaSectionDescription>{copy.description}</CtaSectionDescription>
					<CtaSectionPoints>
						{copy.points.map((point) => (
							<CtaSectionPoint key={point}>{point}</CtaSectionPoint>
						))}
					</CtaSectionPoints>
					<CtaSectionActions>
						<CtaSectionAction href={copy.primaryAction.href}>
							{copy.primaryAction.label}
						</CtaSectionAction>
						<CtaSectionAction variant="outline" href={copy.secondaryAction.href}>
							{copy.secondaryAction.label}
						</CtaSectionAction>
					</CtaSectionActions>
				</CtaSectionContent>
				<CtaSectionVisual>
					<Card className="w-full max-w-80">
						<CardHeader>
							<CardTitle>{CTA_SETUP.workspace}</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-3 text-sm">
							<Progress value={66} label="Setting up" showValue />
							{CTA_SETUP.steps.map((step) => (
								<p key={step} className="text-muted-foreground">
									{step}
								</p>
							))}
						</CardContent>
					</Card>
				</CtaSectionVisual>
			</CtaSection>
		);
	}
	const copy = CTA_COPY.centered;
	return (
		<CtaSection variant="centered">
			<CtaSectionContent>
				<CtaSectionTitle>{copy.title}</CtaSectionTitle>
				<CtaSectionDescription>{copy.description}</CtaSectionDescription>
				<CtaSectionActions>
					<CtaSectionAction href={copy.primaryAction.href}>
						{copy.primaryAction.label}
					</CtaSectionAction>
					<CtaSectionAction variant="outline" href={copy.secondaryAction.href}>
						{copy.secondaryAction.label}
					</CtaSectionAction>
				</CtaSectionActions>
				<CtaSectionNote>
					<AvatarGroup aria-hidden="true">
						{CTA_FACES.map((face) => (
							<Avatar key={face.src} size="sm" className="size-6.5">
								<AvatarImage src={face.src} alt="" />
								<AvatarFallback />
							</Avatar>
						))}
					</AvatarGroup>
					{copy.note}
				</CtaSectionNote>
			</CtaSectionContent>
		</CtaSection>
	);
}
