"use client";

import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CtaSection,
	Progress,
} from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { CTA_COPY, CTA_FACES, CTA_SETUP } from "../data/cta";
import { controlProps } from "../data/preview-props";

export function CtaSectionDemo({ props }: { props: Record<string, unknown> }) {
	const variant =
		controlProps<ComponentProps<typeof CtaSection>>(props).variant ?? "centered";
	const [open, setOpen] = useState(true);
	if (variant === "banner")
		return (
			<div className="grid w-full gap-3">
				<CtaSection
					variant="banner"
					{...CTA_COPY.banner}
					dismissible
					open={open}
					onOpenChange={setOpen}
				/>
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
	if (variant === "split")
		return (
			<CtaSection
				variant="split"
				{...CTA_COPY.split}
				visual={
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
				}
			/>
		);
	return <CtaSection variant="centered" {...CTA_COPY.centered} avatars={CTA_FACES} />;
}
