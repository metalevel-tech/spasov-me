"use client";

import React, { useState } from "react";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { useAppContext } from "@/contexts/AppContext";

import { PageDoc } from "@/interfaces/Page";
import { cn } from "@/lib/cn-utils";
import ButtonIcon from "@/components/fragments/ButtonIcon";

import { Route } from "@/routes";

import { msgs } from "@/messages";

import { Switch } from "@/components/ui/switch";

import Pages_Dialog_Edit from "./Pages_Dialog_Edit";
import Pages_Dialog_Add from "./Pages_Dialog_Add";
import Pages_Dialog_Delete from "./Pages_Dialog_Delete";
import { Pages_FormSchema } from "./pages-form";

import styles from "../_pages.module.scss";

export interface GenericActionProps {
	className?: string;
	session: Session | null;
	setPages: React.Dispatch<React.SetStateAction<PageDoc[]>>;
}

interface Props {
	className?: string;
}

const PagesFeedAndEditOptions: React.FC<Props> = ({ className }) => {
	const t = msgs("PagesFeed");
	const { pages, setPages } = useAppContext();
	const router = useRouter(); // We can't use <Link><ButtonIcon /></Link>, because Tge inner component have onClick()

	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [actionPageId, setActionPageId] = useState("");
	const [actionPage, setActionPage] = useState<Pages_FormSchema>();

	const { data: session } = useSession();

	const handleDelete = (e: React.SyntheticEvent, page: PageDoc) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?._id.toString(),
			visibility:
				typeof page.visibility === "string"
					? page.visibility === "true"
						? true
						: false
					: page.visibility,
		});

		setActionPageId(page._id);

		setIsDeleteDialogOpen(true);
	};

	const handleEdit = (e: React.SyntheticEvent, page: PageDoc) => {
		e.preventDefault();

		setActionPage({
			title: page.title,
			description: page.description,
			uri: page.uri,
			image: page.image?._id.toString(),
			visibility:
				typeof page.visibility === "string"
					? page.visibility === "true"
						? true
						: false
					: page.visibility,
		});

		setActionPageId(page._id);

		setIsEditDialogOpen(true);
	};

	return (
		<div className={cn(styles.pages, className)}>
			<Pages_Dialog_Add session={session} setPages={setPages} />

			<div className={cn(styles.feed, "mt-16")}>
				{pages?.map((page, index) => (
					// <Link key={index} href={`/${page.uri}`}>
					<div key={index} className={styles.card}>
						<div className={styles.cardEditActions}>
							<ButtonIcon
								className="pl-[2.6px] bg-transparent icon_accent_secondary"
								height={18}
								type="trash"
								width={18}
								onClick={(e) => handleDelete(e, page)}
							/>
							<ButtonIcon
								className="pl-[2.8px] bg-transparent icon_accent_secondary"
								height={18}
								type="up-right-from-square"
								width={18}
								onClick={() => {
									router.push(`/${page.uri}`);
								}}
							/>
							<Switch
								disabled
								checked={
									typeof page.visibility === "string"
										? page.visibility === "true"
											? true
											: false
										: page.visibility
								}
								className="mt-1 mr-1"
							/>
							<ButtonIcon
								className="pl-[4.5px] bg-transparent icon_accent_secondary"
								height={18}
								type="brush"
								width={18}
								onClick={(e) => handleEdit(e, page)}
							/>
						</div>
						{page.image && (
							<div className={styles.cardImageEditMode}>
								<Image
									priority
									alt={t("index_pageImage_alt", { title: page.title })}
									height={260}
									src={`${Route.api.FILES}/${page.image._id.toString()}/${page.image.filename}`}
									width={462}
								/>
							</div>
						)}
						<h1 className={cn(styles.title, "mt-4")}>{page.title}</h1>
						<span>{page.description}</span>
					</div>
					// </Link>
				))}
			</div>

			<Pages_Dialog_Edit
				isOpen={isEditDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsEditDialogOpen}
				setPages={setPages}
			/>

			<Pages_Dialog_Delete
				isOpen={isDeleteDialogOpen}
				pageData={actionPage}
				pageId={actionPageId}
				session={session}
				setIsOpen={setIsDeleteDialogOpen}
				setPages={setPages}
			/>
		</div>
	);
};

export default PagesFeedAndEditOptions;
