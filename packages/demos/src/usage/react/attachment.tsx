import {
	Attachment,
	AttachmentContent,
	AttachmentMeta,
	AttachmentName,
	AttachmentPreview,
	AttachmentRemove,
	AttachmentRetry,
	Attachments,
} from "@baby-ui/react";

export function Example() {
	return (
		<Attachments>
			<Attachment name="design-review.pdf" status="uploading" progress={62}>
				<AttachmentPreview />
				<AttachmentContent>
					<AttachmentName />
					<AttachmentMeta>2.4 MB</AttachmentMeta>
				</AttachmentContent>
				<AttachmentRetry onClick={() => console.log("retry")} />
				<AttachmentRemove onClick={() => console.log("removed")} />
			</Attachment>
		</Attachments>
	);
}
