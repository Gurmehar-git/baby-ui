"use client";

import { AnnouncementBar, Button } from "@baby-ui/react";
import { type ComponentProps, useState } from "react";
import { announcementsAt } from "../data/announcements";
import { controlProps } from "../data/preview-props";

type Props = Record<string, unknown>;

export function AnnouncementBarDemo({ props }: { props: Props }) {
	const p = controlProps<ComponentProps<typeof AnnouncementBar>>(props);
	const [messages] = useState(() => announcementsAt(Date.now()));
	const [open, setOpen] = useState(true);
	return (
		<div className="grid w-full max-w-3xl gap-4">
			<div className="overflow-hidden rounded-xl border">
				<AnnouncementBar
					messages={messages}
					open={open}
					onOpenChange={setOpen}
					controls={p.controls}
					autoPlay={p.autoPlay}
					variant={p.variant}
				/>
				<div className="grid h-28 place-items-center text-muted-foreground text-sm">
					Page content
				</div>
			</div>
			{!open && (
				<Button
					variant="outline"
					size="sm"
					className="justify-self-start"
					onClick={() => setOpen(true)}
				>
					Show again
				</Button>
			)}
		</div>
	);
}
