import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import DisplayFileImage from "@/components/fragments/DisplayFileImage";

import { FileData } from "@/interfaces/File";

import DisplaySingleFile from "@/components/fragments/DisplayAttachment";
import ToggleCollapsible from "@/components/fragments/toggle-collapsible";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { roundTo } from "@/lib/round";
import { msgs } from "@/messages";

import { Badge } from "@/components/ui/badge";

import { capitalize } from "@/lib/capitalize";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import DeleteFile from "../file-actions/DeleteFile";
import UpdateFile from "../file-actions/UpdateFile";
import styles from "./_file-card.module.scss";

interface Props {
	className?: string;
	file: FileData;
}

const FileCard: React.FC<Props> = ({ className, file }) => {
	const tCommon = msgs("FilesAdmin");
	const t = msgs("FilesAdmin_DisplayFileCard");

	const displayActions = true;

	const toggle_target_id = `file_${file?._id.toString()}`;

	const descriptionArr = file.metadata.html.description
		.split(splitDescriptionKeyword)
		.map((str) => {
			return str.replace(commentsMatcher, "");
		});

	return (
		<div className={`${styles.cardWrapper} file-card ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.imageContainer}>
					<DisplayFileImage className={`${styles.imageThumb} card-item-thumb`} file={file} />
					<DisplayFileImage className={`${styles.imageLarge} card-item-collapsible`} file={file} />
				</div>
				<div className={styles.header}>
					<div className={`${styles.buttons} ${displayActions ? "w-36" : "w-8"}`}>
						<div className={styles.buttonsContainer}>
							{displayActions && (
								<>
									<DeleteFile file_id={file._id} filename={file.filename} />
									<DisplaySingleFile uri={file.metadata.html.fileUri} />
									<UpdateFile file={file} />
								</>
							)}
							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnAll"), tCommon("btnLess")]}
								type={"card"}
							/>
						</div>
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: file.metadata.html.title }}
						className={styles.title}
					/>
				</div>
				<div className={styles.info}>
					<div className={styles.size}>
						<span className={styles.lightPrimaryText}>
							{roundTo(Number(file.metadata.size) / 1024, 0).toLocaleString("en-US")}
						</span>
						<span className={styles.lightSecondaryText}>{t("kilobyte")}</span>
					</div>

					<div className={styles.dateModified}>
						<span className={styles.lightPrimaryText}>
							{format(file.metadata.lastModified, "MMM. d, yyyy", { locale: en })}
						</span>
					</div>

					<div className={styles.contentType}>
						<span className={styles.lightPrimaryText}>{file.metadata.contentType}</span>
					</div>
				</div>

				<div className={`${styles.contentWrapper} card-item-collapsible`}>
					<div className={styles.content}>
						<div className={`${styles.description} md-processed-to-html`}>
							{descriptionArr.map((description, index) => {
								return <div dangerouslySetInnerHTML={{ __html: description }} key={index} />;
							})}
						</div>
						{file.metadata.attachedTo && file.metadata.attachedTo.length > 0 && (
							<div className={`${styles.attachedTo}`}>
								{file.metadata.attachedTo.map((item, index) => {
									const labelMaxLength = 20;
									const regExp = new RegExp(`^(.{${labelMaxLength}}).*$`);
									const badgeText =
										item.title.length > labelMaxLength
											? item.title.replace(regExp, "$1...")
											: item.title;

									return (
										<TooltipProvider key={item._id}>
											<Tooltip>
												<TooltipTrigger>
													<Badge
														className="h-fit text-sm font-normal tracking-wider py-1 text-foreground"
														variant="secondary"
													>
														<span className="inline-block mr-1">{badgeText}</span>
														{/* <SelectedItemRemoveBtn item={item} /> */}
													</Badge>
												</TooltipTrigger>
												<TooltipContent className="border-2 border-muted-secondary dark:border-primary max-w-xs">
													<p className="font-semibold text-base">{`${capitalize(item.type)}: ${item.title}`}</p>
													<p className="text-xs">{t("index_id", { index, id: item._id })}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileCard;
