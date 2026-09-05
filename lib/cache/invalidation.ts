import { getRedisClient } from "@/lib/db/redis-client";

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (!keys.length) return;

  try {
    const redis = await getRedisClient();
    if (redis) await redis.del(...keys);
  } catch (error) {
    console.error("Public content cache invalidation failed", { keys, error });
  }
}
