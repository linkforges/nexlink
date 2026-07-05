import { Redis } from "@upstash/redis";

type RedisClient = {
  get<T = unknown>(key: string): Promise<T | null>;
  setex(key: string, ttl: number, value: string): Promise<void>;
  del(key: string): Promise<void>;
  sismember(key: string, member: string): Promise<number>;
  sadd(key: string, member: string): Promise<number>;
  eval(script: string, keys: string[], args: string[]): Promise<any>;
};

const createRedisClient = (): RedisClient | null => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token }) as unknown as RedisClient;
};

const fallbackRedis: RedisClient = {
  async get() {
    return null;
  },
  async setex() {},
  async del() {},
  async sismember() {
    return 0;
  },
  async sadd() {
    return 0;
  },
  async eval() {
    return 0;
  },
};

export const redis: RedisClient = createRedisClient() ?? fallbackRedis;