"use client";

import React, { useState } from "react";

import { usePathname } from "next/navigation";

import { BsSendCheck } from "react-icons/bs";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { cn } from "@/lib/cn-utils";

import { msgs } from "@/messages";

import ButtonIcon from "@/components/fragments/ButtonIcon";
import { toast } from "@/components/ui/use-toast";

import { generateFormDataFromObject } from "@/lib/generateFormDataFromObject";

import { Route } from "@/routes";

import TagForm from "./tag-form";

import { updateEntry } from "../_tags.actions";

import { GenericActionProps } from ".";

interface Props extends GenericActionProps {
	entry: Entry_FormSchema & { _id: string };
}

const EntryUpdate: React.FC<Props> = ({ className, tagType: entryType, entry, files }) => {
	const t = msgs("AboutCV_UpdateEntry");
	const entryTypeLabel = (
		msgs("AboutCV_Form")("aboutEntry_type_list") as unknown as Record<string, string>
	)[entryType];

	const [submitting, setSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const handleUpdateEntry = async (data: Entry_FormSchema) => {
		setSubmitting(true);
		try {
			/**
			 * In case we were used <form action={addPage}> this conversion will not be needed,
			 * Unfortunately, at the current moment nor "react-hook-form" nor "shadcn/ui" support
			 * form.action()... @see https://stackoverflow.com/a/40552372/6543935
			 */

			const response = await updateEntry(generateFormDataFromObject(data), entry._id, [
				pathname,
				Route.public.ABOUT.uri,
			]);

			if (response) {
				toast({
					description: (
						<div className="flex flex-col items-center gap-2 justify-center w-full">
							<div className="flex items-center gap-2 justify-between">
								<span className="text-base">{t("toast_submitted")}</span>
								<span className="text-3xl">
									<BsSendCheck />
								</span>
							</div>
						</div>
					),
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
			setIsOpen(false);
		}
	};

	const showDescription = t("dialog_description") && t("dialog_description") !== "null";

	return (
		<div className={cn(className)}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger disabled={submitting}>
					<ButtonIcon
						className="pl-[3px] bg-transparent icon_accent_secondary"
						height={18}
						// type="trash"
						type="brush"
						width={18}
						onClick={() => setIsOpen(true)}
					/>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[92%] lg:max-w-[82%] xl:max-w-5xl">
					<DialogHeader className="-mt-2">
						<DialogTitle>{t("dialog_title", { entryType: entryTypeLabel })}</DialogTitle>
						{showDescription && (
							<DialogDescription
								dangerouslySetInnerHTML={{
									__html: t("dialog_description", { id: entry._id }),
								}}
							/>
						)}
					</DialogHeader>

					<TagForm
						className={showDescription ? "mt-4" : "mt-0"}
						entryType="employment"
						files={files}
						formData={entry}
						submitting={submitting}
						onSubmit={handleUpdateEntry}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default EntryUpdate;
