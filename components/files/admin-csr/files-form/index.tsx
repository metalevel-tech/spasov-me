"use client";

import React, { useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import slugify from "slugify";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { roundTo } from "@/lib/round";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { FileDocument } from "@/interfaces/File";

import { AspectRatio } from "@/components/ui/aspect-ratio";

import styles from "../../_files.module.scss";
import { Files_FormSchema, FormSchemaGenerator } from "./schema";

interface Props {
	className?: string;
	onSubmit: (data: Files_FormSchema) => void;
	submitting?: boolean;
	isContainerDialogOpen?: boolean;
	formData?: FileDocument;
}

const Files_Form: React.FC<Props> = ({ className, onSubmit, submitting = false, formData }) => {
	const t = msgs("FilesAdmin_Form_OLD");
	const locale = "en";

	const displayImageRef = useRef<HTMLImageElement>(null);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);

	const FormSchema = FormSchemaGenerator(
		[
			t("formSchema_file"),
			t("formSchema_name"),
			t("form_fileInputDescription"),
			t("formSchema_description"),
		],
		!!formData
	);

	const form = useForm<Files_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			file: null,
			filename: "",
			description: "",
		},
		values: {
			file: null,
			filename: formData?.filename ?? "",
			description: formData?.metadata?.description ?? "",
		},
	});

	const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.item(0) ?? null;

		if (file) {
			const filename = slugify(
				file.name.replace(/[^\.a-zA-Z0-9_-]/g, "-").replace(/^[^a-zA-Z]/g, ""),
				{
					lower: false,
					remove: /[*+~()'"!:@]/g,
					locale: "en",
				}
			);

			if (!filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif)$/)) {
				form.setError("file", {
					type: "manual",
					message: t("form_fileInputDescription"),
				});

				return;
			} else {
				form.clearErrors("file");
			}

			if (displayImageRef?.current) {
				// First remove the "srcset" attribute, generated by the Next.js <Image> component
				displayImageRef.current?.setAttribute("srcset", "");

				// Then set new "src" attribute
				if (filename.match(/\.(png|jpg|jpeg|svg||gif)$/)) {
					displayImageRef.current?.setAttribute("src", URL.createObjectURL(file));
				} else if (filename.match(/\.(pdf|pptx|xlsx|docx)$/)) {
					displayImageRef.current?.setAttribute(
						"src",
						`${Route.assets.MIME_TYPE}/${filename.split(".").pop()}.png`
					);
				}
			}

			const modifiedDate = new Date(file.lastModified).toLocaleString(locale);
			const fileSizeKb = roundTo(file.size / 1000, 1);

			if (!formData) {
				form.setValue("filename", filename);
				form.setValue("description", `${modifiedDate} ~${fileSizeKb}Kb`);
			} else if (formData.filename.split(".").at(-1) !== filename.split(".").at(-1)) {
				const newFileName = `${formData.filename.split(".").slice(0, -1).join(".")}.${filename
					.split(".")
					.at(-1)}`;

				form.setValue("filename", newFileName);
			}

			setFileToUpload(file);
		}
	};

	const handleSubmit = async (data: Files_FormSchema) => {
		if (!fileToUpload && !formData) {
			form.setError("file", {
				type: "manual",
				message: t("formSchema_file"),
			});

			return;
		}

		data.file = fileToUpload;

		onSubmit(data);
	};

	const fileUri = formData
		? formData.filename.match(/\.(pdf|pptx|xlsx|docx)$/)
			? `${Route.assets.MIME_TYPE}/${formData.filename.split(".").pop()}.png`
			: `${Route.api.FILES}/${formData?._id.toString()}/${formData?.filename}?v=${new Date(
					formData.uploadDate
				).getTime()}`
		: Route.assets.IMAGE_PLACEHOLDER;

	return (
		<Form {...form}>
			<form className={`${styles.form} ${className}`} onSubmit={form.handleSubmit(handleSubmit)}>
				<FormItem>
					<FormLabel
						className={form.formState.errors.file ? "text-destructive" : "text-foreground"}
						htmlFor="file-input"
					>
						{t("form_fileInput")}
					</FormLabel>

					<FormControl>
						<div className={styles.fileInputWrapper}>
							<Input
								id="file-input"
								{...form.register("file")}
								accept="image/*, .pdf, .pptx, .xlsx, .docx"
								className={styles.fileInput}
								type="file"
								onChange={handleInputFileChange}
							/>
						</div>
					</FormControl>

					{form.formState.errors.file ? (
						<p className="text-sm font-medium text-destructive">
							{String(form.formState.errors.file.message)}
						</p>
					) : (
						<FormDescription>{t("form_fileInputDescription")}</FormDescription>
					)}
				</FormItem>

				<FormField
					control={form.control}
					name="filename"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("form_fileName")}</FormLabel>
							<FormControl>
								<Input placeholder={t("form_fileNamePlaceholder")} {...field} />
							</FormControl>

							{form.formState.errors.filename ? (
								<FormMessage />
							) : (
								<FormDescription>{t("form_fileNameDescription")}</FormDescription>
							)}
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem className="">
							<FormLabel>{t("form_fileDescription")}</FormLabel>
							<FormControl>
								<Input placeholder={t("form_fileDescriptionPlaceholder")} {...field} />
							</FormControl>

							{form.formState.errors.description ? (
								<FormMessage />
							) : (
								<FormDescription>{t("form_fileDescriptionDescription")}</FormDescription>
							)}
						</FormItem>
					)}
				/>

				<Button type="submit">
					{submitting ? t("form_btn_submitting") : t("form_btn_submit")}
				</Button>

				<div className="w-full rounded-md overflow-hidden">
					<AspectRatio ratio={16 / 9}>
						<Image
							ref={displayImageRef}
							alt="Display image before upload"
							className="object-cover object-center w-full h-full rounded-md"
							height="0"
							sizes="208px"
							src={fileUri}
							width="0"
						/>
					</AspectRatio>
				</div>
			</form>
		</Form>
	);
};

export default Files_Form;
