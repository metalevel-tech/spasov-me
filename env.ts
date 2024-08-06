/**
 * The ENV_VARS are managed via Vercel
 * > https://github.com/colinhacks/zod/issues/63
 */
import { z } from "zod";

const zStringReq = (msg?: string) =>
	z
		.string()
		.trim()
		.min(1, { message: msg ?? "Required!" });

const envSchema = z.object({
	CLOUDFLARE_ACCOUNT_ID: zStringReq(),
	CLOUDFLARE_API_ACCESS_KEY_ID: zStringReq(),
	CLOUDFLARE_API_ACCESS_KEY_SECRET: zStringReq(),
	CLOUDFLARE_API_ENDPOINT: zStringReq(),
	CLOUDFLARE_API_S3API_EP: zStringReq(),
	CLOUDFLARE_API_TOKEN: zStringReq(),
	CLOUDFLARE_R2_BUCKET_NAME: zStringReq(),
	CLOUDFLARE_R2_BUCKET_REGION: zStringReq(),

	MINIO_API_ACCESS_KEY_ID: zStringReq(),
	MINIO_API_ACCESS_KEY_SECRET: zStringReq(),
	MINIO_API_ENDPOINT: zStringReq(),
	MINIO_BUCKET_REGION: zStringReq(),

	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN: zStringReq(),
	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_ICONS: zStringReq(),
	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_FILES: zStringReq(),
	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DIR_METADATA: zStringReq(),

	GITHUB_ALLOWED_USER_SECRET: zStringReq(),
	GITHUB_CLIENT_ID: zStringReq(),
	GITHUB_CLIENT_SECRET: zStringReq(),

	GOOGLE_RECAPTCHA_SCORE_LIMIT: zStringReq(),
	GOOGLE_RECAPTCHA_URL: zStringReq(),
	GOOGLE_RECAPTCHA_V3E_SECRET_KEY: zStringReq(),

	KV_REST_API_READ_ONLY_TOKEN: zStringReq(),
	KV_REST_API_TOKEN: zStringReq(),
	KV_REST_API_URL: zStringReq(),
	KV_URL: zStringReq(),

	MONGODB_DB_NAME: zStringReq(),
	MONGODB_FILES_BUCKET_NAME: zStringReq(),
	MONGODB_URI: zStringReq(),

	NEXTAUTH_SECRET: zStringReq(),
	NEXTAUTH_URL: zStringReq(),
	NEXTAUTH_URL_INTERNAL: zStringReq(),

	NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3E_SITE_KEY: zStringReq(),
	NEXT_PUBLIC_ME_EMAIL: zStringReq(),
	NEXT_PUBLIC_ME_FIRST_NAME: zStringReq(),
	NEXT_PUBLIC_ME_FULL_NAME: zStringReq(),
	NEXT_PUBLIC_PROJECT_REPOSITORY: zStringReq(),
	NEXT_PUBLIC_SUPPORT_EMAIL: zStringReq(),

	BLOB_READ_WRITE_TOKEN: zStringReq(),
	EDGE_CONFIG: zStringReq(),
	REACT_EDITOR: zStringReq(),
	RESEND_API_KEY: zStringReq(),
	VERCEL_ENV: zStringReq(),
	VERCEL_HOOK_REBUILD_MASTER: zStringReq(),
});

/**
 * const {
 * 	CLOUDFLARE_ACCOUNT_ID,
 * 	CLOUDFLARE_API_ACCESS_KEY_ID,
 * 	CLOUDFLARE_API_ACCESS_KEY_SECRET,
 * 	CLOUDFLARE_API_ENDPOINT,
 * 	CLOUDFLARE_API_S3API_EP,
 * 	CLOUDFLARE_API_TOKEN,
 * 	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN,
 * 	CLOUDFLARE_R2_BUCKET_NAME,
 * 	CLOUDFLARE_R2_BUCKET_REGION,

 * 	GITHUB_ALLOWED_USER_SECRET,
 * 	GITHUB_CLIENT_ID,
 * 	GITHUB_CLIENT_SECRET,

 * 	GOOGLE_RECAPTCHA_SCORE_LIMIT,
 * 	GOOGLE_RECAPTCHA_URL,
 * 	GOOGLE_RECAPTCHA_V3E_SECRET_KEY,

 * 	KV_REST_API_READ_ONLY_TOKEN,
 * 	KV_REST_API_TOKEN,
 * 	KV_REST_API_URL,
 * 	KV_URL,

 * 	MONGODB_DB_NAME,
 * 	MONGODB_FILES_BUCKET_NAME,
 * 	MONGODB_URI,

 * 	NEXTAUTH_SECRET,
 * 	NEXTAUTH_URL,
 * 	NEXTAUTH_URL_INTERNAL,

 * 	NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3E_SITE_KEY,
 * 	NEXT_PUBLIC_ME_EMAIL,
 * 	NEXT_PUBLIC_ME_FIRST_NAME,
 * 	NEXT_PUBLIC_ME_FULL_NAME,
 * 	NEXT_PUBLIC_PROJECT_REPOSITORY,
 * 	NEXT_PUBLIC_SUPPORT_EMAIL,

 * 	BLOB_READ_WRITE_TOKEN,
 * 	EDGE_CONFIG,
 * 	REACT_EDITOR,
 * 	RESEND_API_KEY,
 * 	VERCEL_ENV,
 * 	VERCEL_HOOK_REBUILD_MASTER,
 * } = process.env;

 * const parsedResults = envSchema.safeParse({
 * 	CLOUDFLARE_ACCOUNT_ID,
 * 	CLOUDFLARE_API_ACCESS_KEY_ID,
 * 	CLOUDFLARE_API_ACCESS_KEY_SECRET,
 * 	CLOUDFLARE_API_ENDPOINT,
 * 	CLOUDFLARE_API_S3API_EP,
 * 	CLOUDFLARE_API_TOKEN,
 * 	NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN,
 * 	CLOUDFLARE_R2_BUCKET_NAME,
 * 	CLOUDFLARE_R2_BUCKET_REGION,

 * 	GITHUB_ALLOWED_USER_SECRET,
 * 	GITHUB_CLIENT_ID,
 * 	GITHUB_CLIENT_SECRET,

 * 	GOOGLE_RECAPTCHA_SCORE_LIMIT,
 * 	GOOGLE_RECAPTCHA_URL,
 * 	GOOGLE_RECAPTCHA_V3E_SECRET_KEY,

 * 	KV_REST_API_READ_ONLY_TOKEN,
 * 	KV_REST_API_TOKEN,
 * 	KV_REST_API_URL,
 * 	KV_URL,

 * 	MONGODB_DB_NAME,
 * 	MONGODB_FILES_BUCKET_NAME,
 * 	MONGODB_URI,

 * 	NEXTAUTH_SECRET,
 * 	NEXTAUTH_URL,
 * 	NEXTAUTH_URL_INTERNAL,

 * 	NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3E_SITE_KEY,
 * 	NEXT_PUBLIC_ME_EMAIL,
 * 	NEXT_PUBLIC_ME_FIRST_NAME,
 * 	NEXT_PUBLIC_ME_FULL_NAME,
 * 	NEXT_PUBLIC_PROJECT_REPOSITORY,
 * 	NEXT_PUBLIC_SUPPORT_EMAIL,

 * 	BLOB_READ_WRITE_TOKEN,
 * 	EDGE_CONFIG,
 * 	REACT_EDITOR,
 * 	RESEND_API_KEY,
 * 	VERCEL_ENV,
 * 	VERCEL_HOOK_REBUILD_MASTER,
 * });

 * if (!parsedResults.success) {
 * 	console.error(parsedResults.error);
 * 	throw new Error("Invalid ENV_VARS");
 * }

 * export const env = parsedResults.data;
 */
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

// export const r2BucketName = env.CLOUDFLARE_R2_BUCKET_NAME;
// export const r2BucketDomain = env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_DOMAIN;
