/**
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/CopyObjectCommand/
 * @see https://stackoverflow.com/questions/72959475/how-can-i-modify-metadata-for-an-existing-cloudflare-r2-object
 */
import { CopyObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";

import { r2BucketName } from "@/env";
import { FileMetadata } from "@/interfaces/File";

import { config } from "./index";

export const updateObject = async ({
	filename,
	metadata,
	bucket,
}: {
	filename: string;
	metadata: FileMetadata;
	bucket?: string;
}) => {
	const s3client = new S3(config) || new S3Client(config);

	try {
		const metadataRecord: Record<string, string> = {};

		Object.entries(metadata).forEach(([key, value]) => {
			metadataRecord[key] = JSON.stringify(value);
		});

		const command = new CopyObjectCommand({
			CopySource: `/${bucket || r2BucketName}/${filename}`,
			Bucket: bucket || r2BucketName,
			Key: filename,
			ContentType: metadata.contentType,
			Metadata: metadataRecord,
			MetadataDirective: "REPLACE",
		});

		const responseObject = await s3client.send(command);

		return responseObject["$metadata"].httpStatusCode === 200;
	} catch (error) {
		console.error(error);

		return null;
	}
};
