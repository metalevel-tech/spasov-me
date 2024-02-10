import { ObjectId } from "mongodb";

import { FileData, FileDocument } from "./File";
import { TagData, TagDoc } from "./Tag";
import { UserObject } from "./User";
import { AboutEntryType, CityType, CountryType } from "./_common-data-types";

export interface AboutEntryDoc {
	_id: string;
	creator: UserObject;

	title: string;
	description: string;
	country: CountryType;
	city: CityType;
	entryType: AboutEntryType;
	dateFrom: Date | string;
	dateTo: Date | string | undefined;
	visibility: boolean | string;
	tags: ObjectId[];
	attachment?: ObjectId | undefined; // attachment?: FileDocument;
	gallery: ObjectId[] | undefined; // gallery: FileDocument[];
}

export interface AboutEntryDocPopulated
	extends Omit<AboutEntryDoc, "attachment" | "tags" | "gallery"> {
	tags: TagDoc[];
	attachment?: FileDocument | undefined;
	gallery: FileDocument[] | undefined;
}

export interface NewAboutEntryData
	extends Omit<AboutEntryDoc, "_id" | "attachment" | "creator" | "tags" | "gallery"> {
	creator: string;
	attachment?: string;
	tags: string[];
	gallery?: string[];
}

export interface AboutEntryHtmlProps {
	title: string;
	description: string;
	attachmentUri?: string;
}

export interface AboutEntryData
	extends Omit<
		AboutEntryDoc,
		"_id" | "attachment" | "creator" | "tags" | "dateTo" | "dateFrom" | "visibility" | "gallery"
	> {
	_id: string;
	html: AboutEntryHtmlProps;
	attachment: string | undefined;
	gallery?: FileData[];
	tags: TagData[];
	dateFrom: Date;
	dateTo: Date | undefined;
	visibility: boolean;
}
