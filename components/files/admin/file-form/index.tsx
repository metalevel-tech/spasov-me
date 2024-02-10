"use client";
import React, { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor, { commands } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useForm } from "react-hook-form";
import slugify from "slugify";

import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import { FileData } from "@/interfaces/File";
import { roundTo } from "@/lib/round";
import { msgs } from "@/messages";
import { Route } from "@/routes";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import { capitalize } from "@/lib/capitalize";

import { AttachedToDocument } from "@/interfaces/_common-data-types";

import AttachedToBadge from "../../../fragments/AttachedToBadge";
import styles from "./_files-form.module.scss";
import { File_FormSchema, File_FormSchemaGenerator } from "./schema";

interface Props {
	className?: string;
	onSubmit: (data: File_FormSchema) => void;
	submitting?: boolean;
	isContainerDialogOpen?: boolean;
	formData?: FileData;
}

const FileForm: React.FC<Props> = ({ className, onSubmit, submitting = false, formData }) => {
	const t = msgs("Files_Form");
	const tCard = msgs("Files_Display");
	const locale = "en";
	const displayImageRef = useRef<HTMLImageElement>(null);
	const collisionBoundaryRef = useRef<HTMLFormElement>(null);
	const [fileToUpload, setFileToUpload] = useState<File | null>(null);
	const { isAboveMb } = useBreakpoint("mb");
	const { isAboveSm } = useBreakpoint("sm");

	const FormSchema = File_FormSchemaGenerator(
		[
			t("schema_file"),
			t("fileInput_placeholder"),
			t("fileInput_placeholder"),
			t("fileInput_placeholder"),
		],
		!!formData
	);

	const { theme } = useTheme();

	const form = useForm<File_FormSchema>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			file: null,
			filename: "",
			description: "",
			attachedTo: [],
		},
		values: {
			file: null,
			filename: formData?.filename ?? "",
			description: formData?.metadata?.description ?? "",
			attachedTo: formData?.metadata?.attachedTo ?? [],
		},
	});

	const [attachedTo, setAttachedTo] = useState<AttachedToDocument[] | null>(null);

	useEffect(() => {
		setAttachedTo((form?.watch("attachedTo") as AttachedToDocument[]) ?? null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, form.watch("attachedTo")]);

	const removeAttachedToItemById = (id: string) => {
		form.setValue("attachedTo", attachedTo?.filter(({ _id }) => _id !== id) ?? []);
	};

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

			if (!filename.match(/\.(png|jpg|jpeg|svg|webp|pdf|pptx|xlsx|docx|gif|jfif)$/)) {
				form.setError("file", {
					type: "manual",
					message: t("fileInput_placeholder"),
				});

				return;
			} else {
				form.clearErrors("file");
			}

			if (displayImageRef?.current) {
				// First remove the "srcset" attribute, generated by the Next.js <Image> component
				displayImageRef.current?.setAttribute("srcset", "");

				// Then set new "src" attribute
				if (filename.match(/\.(png|jpg|jpeg|svg|webp|gif)$/)) {
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

	const handleSubmit = async (data: File_FormSchema) => {
		if (!fileToUpload && !formData) {
			form.setError("file", {
				type: "manual",
				message: t("schema_file"),
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
			<form
				ref={collisionBoundaryRef}
				className={`w-full space-y-4 relative ${className}`}
				onSubmit={form.handleSubmit(handleSubmit)}
			>
				{/* Grid */}
				<div className="flex flex-col-reverse mb:grid mb:grid-cols-9 gap-3">
					{/* Left grid */}
					<div className="mb:col-span-4 flex flex-col gap-3">
						{/* Image Preview */}
						<div className="w-full rounded-md overflow-clip border border-border/50">
							<AspectRatio ratio={isAboveMb ? 1 / 1 : isAboveSm ? 16 / 9 : 15 / 12}>
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
					</div>
					{/* Right grid */}
					<div className="mb:col-span-5 flex flex-col gap-3 h-full">
						{/* File input  */}
						<FormItem>
							{t("fileInput_label") && (
								<FormLabel
									className={form.formState.errors.file ? "text-destructive" : "text-foreground"}
									htmlFor="file-input"
								>
									{t("fileInput_label")}
								</FormLabel>
							)}

							<FormControl>
								<div className={styles.fileInputWrapper}>
									<Input
										id="file-input"
										{...form.register("file")}
										accept="image/*, .pdf, .pptx, .xlsx, .docx"
										className={styles.fileInput}
										placeholder={t("fileInput_placeholder")}
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
								t("fileInput_description") && (
									<FormDescription>{t("fileInput_description")}</FormDescription>
								)
							)}
						</FormItem>

						{/* Filename */}
						<FormField
							control={form.control}
							name="filename"
							render={({ field }) => (
								<FormItem className="space-y-0">
									{t("filename_label") && <FormLabel>{t("filename_label")}</FormLabel>}
									<FormControl>
										<Input className="text-lg" placeholder={t("filename_placeholder")} {...field} />
									</FormControl>

									{form.formState.errors.filename ? (
										<FormMessage />
									) : (
										t("filename_description") && (
											<FormDescription>{t("filename_description")}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>

						{/* Description */}
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem
									className="flex-grow h-auto mb:h-1"
									data-color-mode={theme === "dark" ? "dark" : "light" || "auto"}
								>
									{t("description_label") && <FormLabel>{t("description_label")}</FormLabel>}
									<FormControl>
										<MDEditor
											autoFocus
											enableScroll
											commands={[...commands.getCommands()]}
											height={form.formState.errors.description ? "calc(100% - 1.8em)" : "100%"}
											overflow={false}
											preview="edit"
											textareaProps={{
												spellCheck: true,
												placeholder: t("description_placeholder"),
												style: {
													overscrollBehavior: "none",
													display: "block",
													color: "inherit",
												},
											}}
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									{form.formState.errors.description ? (
										<FormMessage className="z-10 relative" />
									) : (
										t("description_description") && (
											<FormDescription>{t("description_description")}</FormDescription>
										)
									)}
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="float-end flex flex-wrap gap-2 !mt-4">
					{attachedTo &&
						attachedTo.length > 0 &&
						attachedTo.map((item, index) => (
							<AttachedToBadge
								key={index}
								badgeLabel={item.title}
								collisionBoundaryRef={collisionBoundaryRef}
								removeItemById={() => removeAttachedToItemById(item._id)}
								ttContentLn1={`${capitalize(item.modelType)}: ${item.title}`}
								ttContentLn2={tCard("index_id", { index, id: item._id })}
							/>
						))}
				</div>

				{/* Submit button */}
				<Button disabled={submitting} type="submit">
					{submitting ? t("btn_submitting") : t("btn_submit")}
				</Button>
			</form>
		</Form>
	);
};

export default FileForm;
