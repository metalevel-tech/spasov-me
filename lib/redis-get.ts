"server-only";

/**
 * This is workaround solution for the SSR build error:
 *
 * 'no-store fetch https://primary-sloth-36695.upstash.io /portfolio/builder-io-app-integration', digest: 'DYNAMIC_SERVER_USAGE'
 *
 * References:
 * - https://github.com/vercel/next.js/issues/46737#issuecomment-1788975799
 * - https://github.com/vercel/next.js/issues/43879
 *
 * The normal way to fetch the data from Redis/Upstash is:
 *		const redis = new Redis({
 *			url: process.env.UPSTASH_REDIS_REST_URL,
 *			token: process.env.UPSTASH_REDIS_REST_TOKEN,
 *		});
 *
 *	 	const response = await redis.get(key);
 */

export async function redisGetSSR<T>(key: string): Promise<T> {
	const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
		headers: {
			Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
		},
	});
	const data = await response.json();
	return JSON.parse(data.result) as T;
}
