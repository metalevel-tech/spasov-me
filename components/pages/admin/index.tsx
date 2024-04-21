import React from "react";

import { getFileList } from "@/components/files-mongodb/_files.actions"; // TODO: files-cloudflare tidy up

import { getPageCards } from "../_pages.actions";
import styles from "../_pages.module.scss";
import Section from "./Section";

interface Props {
	className?: string;
}

const PagesAdmin: React.FC<Props> = async ({ className }) => {
	const pages = await getPageCards({ public: false });
	const fileList = await getFileList({ images: true });

	return (
		<div className={`${styles.pages} ${className}`}>
			<Section files={fileList} pages={pages} type="common" />
		</div>
	);
};

export default PagesAdmin;
