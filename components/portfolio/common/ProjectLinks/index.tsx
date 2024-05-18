"use client";

import Gallery from "@/components/fragments/Gallery";
import TooltipWrapper from "@/components/fragments/TooltipWrapper";
import { ProjectData } from "@/interfaces/Project";
import { msgs } from "@/messages";

import { cn } from "@/lib/cn-utils";

import UpdateProject from "../../admin/Actions/Update";
import DisplayResourceUrlAsIcon from "../DisplayResourceUrlAsIcon";

interface Props {
	project: ProjectData;
}

const ProjectLinks: React.FC<Props> = ({ project }) => {
	const t = msgs("Projects_CardPublic");

	let gallery = project?.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	gallery =
		project?.html?.attachment && gallery
			? [project?.html?.attachment.metadata.html].concat(gallery)
			: gallery;

	const iconWrapper =
		"fill-foreground-tertiary hover:fill-ring-secondary flex items-center justify-center h-full";

	return (
		<div className="pt-1 m-0 flex gap-2 transition-all duration-300 items-center justify-start max-h-7">
			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon size={23} type="home" url={project.urlHome} />
			</div>
			<div className={iconWrapper}>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_gallery")}
				>
					<Gallery
						dialogTrigger_buttonIconProps={{
							className:
								"p-0 bg-transparent hover:bg-transparent m-0 h-full fill-inherit grayscale-0",
							widthOffset: 0,
							heightOffset: 0,
							width: 27,
							height: 26,
							iconEmbedSvgProps: {
								className_Path1: "fill-transparent",
								className_Path2: "fill-inherit",
							},
						}}
						entry={project}
						gallery={gallery}
					/>
				</TooltipWrapper>
			</div>
			<div className={iconWrapper}>
				<DisplayResourceUrlAsIcon size={28} type="repo" url={project.urlRepo} />
			</div>
			<div
				className={cn(
					iconWrapper,
					"overflow-hidden rounded-[3px] bg-foreground-tertiary hover:bg-ring-secondary -ml-1"
				)}
			>
				<TooltipWrapper
					className="w-full h-full flex items-center fill-inherit"
					tooltipText={t("tooltip_update")}
				>
					<UpdateProject
						className="h-6 w-6 flex items-center justify-center"
						dialogTrigger_buttonIconProps={{
							className:
								"p-0 bg-transparent hover:bg-transparent m-0 mt-0.5 fill-inherit grayscale-0",
							widthOffset: 0,
							heightOffset: 0,
							width: 15,
							height: 18,
							iconEmbedSvgProps: {
								className_Path1: "fill-card/60",
								className_Path2: "fill-card ",
								viewBoxHeight: 512,
								viewBoxWidth: 380,
							},
						}}
						project={project}
					/>
				</TooltipWrapper>
			</div>
		</div>
	);
};

export default ProjectLinks;
