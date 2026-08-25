import { Redis } from "@upstash/redis";
import IORedis from "ioredis";

import { getEnvironment } from "@/lib/env";

export type CacheClient = {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: { ex?: number }): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
};

let redisClientPromise: Promise<CacheClient | null> | undefined;

function createLocalRedisClient(url: string): CacheClient {
  const client = new IORedis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  const connect = async () => {
    if (client.status === "wait") await client.connect();
  };
  return {
    async get<T>(key: string) {
      await connect();
      const value = await client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    },
    async set<T>(key: string, value: T, options?: { ex?: number }) {
      await connect();
      return options?.ex
        ? client.set(key, JSON.stringify(value), "EX", options.ex)
        : client.set(key, JSON.stringify(value));
    },
    async del(...keys: string[]) {
      await connect();
      return client.del(...keys);
    },
  };
}

async function createRedisClient(): Promise<CacheClient | null> {
  const environment = getEnvironment();

  if (environment.UPSTASH_REDIS_REST_URL && environment.UPSTASH_REDIS_REST_TOKEN) {
    const upstash = new Redis({
      url: environment.UPSTASH_REDIS_REST_URL,
      token: environment.UPSTASH_REDIS_REST_TOKEN,
    });

    try {
      await upstash.ping();
      return upstash;
    } catch (error) {
      console.error("Upstash Redis health check failed; using local Redis fallback.", {
        error,
      });
    }
  }

  return environment.REDIS_URL ? createLocalRedisClient(environment.REDIS_URL) : null;
}

export function getRedisClient(): Promise<CacheClient | null> {
  redisClientPromise ??= createRedisClient();
  return redisClientPromise;
}
