import React from "react";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileData } from "@/interfaces/File";
import { cn } from "@/lib/cn-utils";
import { Route } from "@/routes";
import EmbedMsoDoc from "./embed/EmbedMsoDoc";
import EmbedPdfDoc from "./embed/EmbedPdfDoc";
import EmbedTxtDoc from "./embed/EmbedTxtDoc";

interface Props {
	className?: string;
	className_TooltipTrigger?: string;
	file: FileData;
	sizes?: [string, string];
	description?: string;
	style?: React.CSSProperties;
}

const DisplayFileImageOrEmbed: React.FC<Props> = ({
	className,
	className_TooltipTrigger,
	file,
	sizes = ["160px", "320px"],
	description,
	style,
}) => {
	if (!file || !file.filename) {
		return null;
	}

	const TheImage = file.filename.match(/\.(pdf)$/) ? (
		<div
			style={{ width: "100%", height: "100%" }}
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
		>
			<EmbedPdfDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : file.filename.match(/\.(txt|csv)$/) ? (
		<div
			style={{ width: "100%", height: "100%" }}
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
		>
			<EmbedTxtDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : file.filename.match(/\.(pptx|xlsx|docx)$/) ? (
		<div
			style={{ width: "100%", height: "100%" }}
			className="rounded-lg overflow-hidden border-4 border-foreground-quaternary"
		>
			<EmbedMsoDoc
				sourceUrl={
					file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
				}
				style={{
					height: "calc(100% + 2px)",
					width: "calc(100% + 2px)",
					marginLeft: "-1px",
					marginTop: "-1px",
					borderRadius: "1px",
					overflow: "hidden",
				}}
			/>
		</div>
	) : (
		<Image
			priority
			alt={file.filename}
			className={cn("h-auto w-full", className)}
			height="0"
			sizes={sizes?.[1] || "320px"}
			src={
				file.metadata.html.fileUrl || file.metadata.html.fileUri || Route.assets.IMAGE_PLACEHOLDER
			}
			style={style}
			unoptimized={file.filename?.match(/\.svg$/) ? true : false}
			width="0"
		/>
	);

	if (description) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger className={className_TooltipTrigger}>{TheImage}</TooltipTrigger>
					<TooltipContent className="border-2 border-muted-secondary dark:border-primary">
						<p>{description}</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		);
	}

	return TheImage;
};

export default DisplayFileImageOrEmbed;
