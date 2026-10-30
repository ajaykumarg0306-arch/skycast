interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  constructor(private defaultTtlMs: number = 10 * 60 * 1000) {
    // Periodic garbage collection every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set<T>(key: string, value: T, ttlMs: number = this.defaultTtlMs): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

export const weatherCache = new MemoryCache(10 * 60 * 1000); // 10 minutes cache
export const geocodeCache = new MemoryCache(60 * 60 * 1000); // 1 hour cache
