import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis: Redis | null | undefined };

/**
 * Optional Redis client. Returns null if REDIS_URL is unset or connection fails.
 * Callers must tolerate null and fall back to Postgres cache.
 */
export function getRedis(): Redis | null {
  if (globalForRedis.redis !== undefined) return globalForRedis.redis;

  const url = process.env.REDIS_URL?.trim();
  if (!url) {
    globalForRedis.redis = null;
    return null;
  }

  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: true,
      connectTimeout: 1500,
    });
    client.on("error", () => {
      /* swallow — callers fall back to Postgres */
    });
    globalForRedis.redis = client;
    return client;
  } catch {
    globalForRedis.redis = null;
    return null;
  }
}

export async function redisGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    if (redis.status !== "ready") await redis.connect().catch(() => null);
    if (redis.status !== "ready") return null;
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function redisSet(
  key: string,
  value: string,
  ttlSeconds: number,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    if (redis.status !== "ready") await redis.connect().catch(() => null);
    if (redis.status !== "ready") return;
    await redis.set(key, value, "EX", ttlSeconds);
  } catch {
    /* ignore */
  }
}
