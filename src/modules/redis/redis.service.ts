import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    // Create Redis client
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${Number(process.env.REDIS_PORT) || 6379}`,
      password: process.env.REDIS_PASSWORD || undefined,
    });

    // Handle errors
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    // Connect
    await this.client.connect();
    console.log('Redis connected successfully');
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis disconnected');
  }

  // Get value by key
  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  // Set value with optional expiration (in seconds)
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  // Delete key
  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  // Check if key exists
  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  // Get all keys matching pattern
  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  // Set JSON value (stringify automatically)
  async setJSON(key: string, value: any, ttl?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttl);
  }

  // Get JSON value (parse automatically)
  async getJSON<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    return data ? JSON.parse(data) : null;
  }

  // Delete multiple keys
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  // Increment value
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  // Decrement value
  async decr(key: string): Promise<number> {
    return await this.client.decr(key);
  }

  // Set expiration time
  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  // Get time to live
  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }
}
