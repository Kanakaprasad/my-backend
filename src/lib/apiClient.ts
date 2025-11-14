
import axios, { AxiosResponse } from "axios";
import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redis = new Redis(REDIS_URL);

/**
 * Simple retry wrapper with backoff
 */
async function fetchWithRetry(url: string, retries = 3, backoffMs = 300): Promise<AxiosResponse<any>> {
  let attempt = 0;
  while (true) {
    try {
      return await axios.get(url, { timeout: 10_000 });
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = backoffMs * attempt;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

/**
 * Get from external API with Redis caching
 */
export async function getFromExternalAPI(url: string): Promise<any> {
  const cacheKey = `ext:${url}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // continue if parse fails
      }
    }
  } catch (e) {
    // Redis may be down — log and continue to fetch
    console.warn("Redis GET failed:", (e as Error).message || e);
  }

  const response = await fetchWithRetry(url, 3, 300);
  const data = response.data;

  // attempt to cache (best-effort)
  try {
    await redis.set(cacheKey, JSON.stringify(data), "EX", 60); // TTL 60s
  } catch (e) {
    console.warn("Redis SET failed:", (e as Error).message || e);
  }

  return data;
}
