import React from "react";

// eslint-disable-next-line import/no-duplicates
import { format } from "date-fns";
// eslint-disable-next-line import/no-duplicates
import { enUS as en } from "date-fns/locale";

import styles from "@/app/(styles)/card-info.module.scss";
import DisplayFileImage from "@/components/fragments/DisplayFileImage";
import DisplayIcon from "@/components/fragments/DisplayIcon";
import FileAddressHandle from "@/components/fragments/FileAddressHandle";
import Gallery from "@/components/fragments/Gallery";
import ToggleCollapsible from "@/components/fragments/ToggleCollapsible";
import { AboutEntryData } from "@/interfaces/AboutEntry";
import { FileData, FileListItem } from "@/interfaces/File";
import { TagData } from "@/interfaces/Tag";
import { commentsMatcher, splitDescriptionKeyword } from "@/lib/process-markdown";
import { sanitizeHtmlTagIdOrClassName } from "@/lib/sanitizeHtmlTagIdOrClassName";
import { msgs } from "@/messages";
import iconsMap, { IconsMapItem } from "@/public/assets/icons";

import VisibilitySwitchDisplay from "@/components/fragments/VisibilitySwitchDisplay";

import DeleteAboutEntry from "../admin/Actions/Delete";
import UpdateAboutEntry from "../admin/Actions/Update";

interface Props {
	entry: AboutEntryData;
	className?: string;
	files?: FileListItem[] | null | undefined;
	tags?: TagData[] | null | undefined;
	displayTagsInline?: boolean;
	displayGalleryInline?: boolean;
}

const AboutEntryCard: React.FC<Props> = ({
	entry,
	className,
	files,
	tags,
	displayTagsInline = true,
	displayGalleryInline = false,
}) => {
	const tTime = msgs("AboutEntries_Form");
	const tCommon = msgs("AboutEntries");

	const { dateFrom, dateTo } = entry;
	const dtFrom = new Date(dateFrom);
	const dtTo = dateTo ? new Date(dateTo) : undefined;
	const toggle_target_id = sanitizeHtmlTagIdOrClassName(`entry_${entry?._id.toString()}`);
	const descriptionArr = entry.html.description.split(splitDescriptionKeyword).map((str) => {
		return str.replace(commentsMatcher, "");
	});

	const attachmentAddress =
		entry.html.attachment?.metadata.html?.fileUri ||
		entry.html.attachment?.metadata.html?.fileUrl ||
		"";

	const getGallery = entry.gallery
		?.map((file) => file.metadata.html)
		?.sort((a, b) => a.filename.localeCompare(b.filename));

	const gallery = getGallery ?? [];

	// Here want different functionality as from the projects...
	// gallery = entry.html.attachment?.metadata.html
	// 	? [...gallery, entry.html.attachment?.metadata.html]
	// 	: gallery;

	const haveGallery = gallery && gallery.length > 0;

	return (
		<div className={`card-border-wrapper ${className}`} id={toggle_target_id}>
			<div className={styles.card}>
				<div className={styles.info}>
					<div className={styles.date}>
						<span>
							{/* <span className={styles.lightSecondaryText}>
							{format(dtFrom, "MM/", { locale: en })}
						</span> */}
							<span className={styles.lightPrimaryText}>
								{format(dtFrom, "yyyy", { locale: en })}
							</span>
						</span>
						<span className={styles.lightPrimaryText}>{" - "}</span>
						{dtTo ? (
							<span>
								{/* <span className={styles.lightSecondaryText}>
								{format(dtTo, "MM/", { locale: en })}
							</span> */}
								<span className={styles.lightPrimaryText}>
									{format(dtTo, "yyyy", { locale: en })}
								</span>
							</span>
						) : (
							<span className={styles.lightPrimaryText}>{tTime("dateTo_now_current")}</span>
						)}
					</div>
					<div className={styles.divider}>❘</div>
					<div className={`${styles.lightPrimaryText} ${styles.location}`}>
						{(tTime("city_list") as unknown as Record<string, string>)[entry.city]},{" "}
						{(tTime("country_list") as unknown as Record<string, string>)[entry.country]}
					</div>
				</div>
				<div className={styles.header}>
					<div className={styles.buttons}>
						<div className={styles.buttonsContainer}>
							<DeleteAboutEntry entry={entry} />
							<VisibilitySwitchDisplay disabled checked={entry.visibility} className="mt-0.5" />
							<FileAddressHandle address={attachmentAddress} />
							<Gallery entry={entry} gallery={gallery} />
							<UpdateAboutEntry entry={entry} files={files} tags={tags} />

							<ToggleCollapsible
								tooltip
								className="icon_accent_primary"
								target_id={toggle_target_id}
								text={[tCommon("btnMore"), tCommon("btnLess")]}
								type={descriptionArr[1] ? "card" : "card-item-single"}
							/>
						</div>
					</div>
					<div dangerouslySetInnerHTML={{ __html: entry.html.title }} className={styles.title} />
				</div>
				<div className={`${styles.description} md-processed-to-html`}>
					<div className="prose max-w-none">
						{descriptionArr.map((description, index, arr) => (
							<div
								dangerouslySetInnerHTML={{ __html: description }}
								key={index}
								className={
									index === 0
										? arr.length > 1
											? "card-item-static"
											: "card-item-single"
										: "card-item-collapsible"
								}
							/>
						))}
					</div>

					{displayTagsInline && (
						<div className="card-item-collapsible">
							<div className="about-entry-tags">
								{entry.tags
									?.sort((a, b) =>
										a.orderKey ? a.orderKey.localeCompare(b.orderKey) : a.name.localeCompare(b.name)
									)
									.map((tag) => (
										<DisplayIcon
											key={tag._id}
											description={tag.html.description}
											icon={iconsMap[tag.icon as IconsMapItem]}
										/>
									))}
							</div>
						</div>
					)}

					{displayGalleryInline && haveGallery && (
						<div className="card-item-collapsible">
							<div className="flex gap-2 flex-wrap p-0 mt-4">
								{gallery.map((image, index) => (
									<DisplayFileImage
										key={index}
										className={`w-8 h-8 rounded-sm`}
										description={image.filename}
										file={
											{
												filename: image.filename,
												metadata: {
													html: {
														fileUri: image?.fileUri || image?.fileUrl,
													},
												},
											} as FileData
										}
										sizes={["32px", "32px"]}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AboutEntryCard;
