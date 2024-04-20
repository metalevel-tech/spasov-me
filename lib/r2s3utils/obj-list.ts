import { ListObjectsV2Command, _Object } from "@aws-sdk/client-s3";

import { r2BucketName } from "@/env";

import { s3client } from "./index";
/**
 * Run from CLI:
 * > pnpm dotenv -e .env.local -- pnpm exec tsx -e 'require("./lib/r2s3utils/obj-list.ts").listObjects({log: true})'
 * > doppler run -- pnpm exec ts-node -e 'require("./src/utils/aws/obj-list.ts").listObjects({log: true})'
 *
 * References:
 * > https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/list-objects.js
 * > https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_ListObjects_section.html
 */

export const listObjects = async (
	{ bucket, prefix, log }: { bucket?: string; prefix?: string; log?: boolean } = { log: false }
) => {
	const command = new ListObjectsV2Command({
		Bucket: bucket || r2BucketName,
		Prefix: prefix || "",
		MaxKeys: 5000,
	});

	try {
		let isTruncated: boolean | undefined = true;

		let contents: _Object[] = [];

		while (isTruncated) {
			const { Contents, IsTruncated, NextContinuationToken } = await s3client.send(command);
			const contentsList = Contents || [];

			contents = [...contents, ...contentsList];
			isTruncated = IsTruncated;
			command.input.ContinuationToken = NextContinuationToken;
		}

		if (log) {
			// eslint-disable-next-line no-console
			console.log(`\nThe bucket "${r2BucketName}" contains the following objects:\n`);
			// eslint-disable-next-line no-console
			console.log(contents.map((c) => ` • ${c.Key}`).join("\n"));
		}

		return contents;
	} catch (err) {
		console.error(err);

		return [];
	}
};
