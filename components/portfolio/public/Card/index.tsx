import React from "react";

import Image from "next/image";
import Link from "next/link";

import styles from "@/app/(styles)/card.module.scss";
import { Button } from "@/components/ui/button";
import { FileListItem } from "@/interfaces/File";
import { ProjectData } from "@/interfaces/Project";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import ProjectLinks from "../../common/ProjectLinks";

interface Props {
	className?: string;
	project: ProjectData;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	displayActions?: boolean;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
}

const ProjectPublic_Card: React.FC<Props> = ({ project, className }) => {
	const t = msgs("Projects_CardPublic");

	const descriptionArr = project.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	return (
		<div className={`${styles.card} scroll-m-8 ${className}`} id={`project_${project._id}`}>
			<div className="flex gap-2 items-center justify-start w-full">
				<div className="rounded-full p-1 overflow-clip bg-primary/80 min-w-[3rem]">
					<Image
						alt={project.title}
						className="size-10"
						height={44}
						src={
							project.html.icon?.metadata.html.fileUrl ||
							project.html.icon?.metadata.html.fileUri ||
							Route.assets.LOGO_SVG
						}
						style={{
							filter:
								!project.html.icon?.metadata.html.fileUrl &&
								!project.html.icon?.metadata.html.fileUri
									? "grayscale(1)"
									: "",
						}}
						unoptimized={project.html.icon?.filename.match(/\.svg$/) ? true : false}
						width={44}
					/>
				</div>
				<div
					dangerouslySetInnerHTML={{ __html: project.html.title }}
					className="text-lg font-semibold line-clamp-1 flex-shrink"
				/>
			</div>
			<div
				dangerouslySetInnerHTML={{ __html: descriptionArr[0] }}
				className="flex-grow line-clamp-2 pl-2"
			/>

			<div className="flex flex-row items-center justify-between gap-2 w-full">
				<ProjectLinks project={project} />
				<Link
					area-label="Link to the Project's page"
					href={`${Route.public.PORTFOLIO.uri}/${project.slug}`}
				>
					<Button
						className="transition-colors duration-300 hover:duration-150"
						size="sm"
						variant="defaultSecondary"
					>
						{t("button_call_to_action")}
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ProjectPublic_Card;
