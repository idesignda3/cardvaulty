import { prisma } from "@/lib/prisma";
import { redisGet, redisSet } from "@/lib/redis";

/**
 * Two-tier cache: Redis (optional, fast) → Postgres ApiCache (durable).
 * Never throws on cache miss/failure — returns null so callers can fetch upstream.
 */
export async function cacheGetJson<T>(key: string): Promise<T | null> {
  const fromRedis = await redisGet(key);
  if (fromRedis) {
    try {
      return JSON.parse(fromRedis) as T;
    } catch {
      /* fall through */
    }
  }

  try {
    const row = await prisma.apiCache.findUnique({ where: { key } });
    if (!row) return null;
    if (row.expiresAt.getTime() <= Date.now()) {
      await prisma.apiCache.delete({ where: { key } }).catch(() => null);
      return null;
    }
    const ttlSec = Math.max(
      1,
      Math.floor((row.expiresAt.getTime() - Date.now()) / 1000),
    );
    await redisSet(key, JSON.stringify(row.payload), ttlSec);
    return row.payload as T;
  } catch {
    return null;
  }
}

export async function cacheSetJson(
  key: string,
  payload: unknown,
  ttlSeconds: number,
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const body = JSON.stringify(payload);
  await redisSet(key, body, ttlSeconds);
  try {
    await prisma.apiCache.upsert({
      where: { key },
      create: { key, payload: payload as object, expiresAt },
      update: { payload: payload as object, expiresAt },
    });
  } catch {
    /* Postgres may be down during build — ignore */
  }
}
