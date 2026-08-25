import { getRedisClient } from "@/lib/db/redis-client";

const DEFAULT_TTL_SECONDS = 20 * 60;

export async function readPublicCache<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedisClient();
    return redis ? await redis.get<T>(key) : null;
  } catch (error) {
    console.error("Public content cache read failed", { key, error });
    return null;
  }
}

export async function writePublicCache<T>(
  key: string,
  value: T,
  ttlSeconds = DEFAULT_TTL_SECONDS
): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (redis) await redis.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    console.error("Public content cache write failed", { key, error });
  }
}

export { DEFAULT_TTL_SECONDS };
