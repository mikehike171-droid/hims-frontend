// Global API request cache to prevent duplicate calls
interface CacheEntry {
  promise: Promise<any>;
  timestamp: number;
  data?: any;
}

class ApiCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly DEDUP_DURATION = 1000; // 1 second for deduplication

  // Generate cache key from URL and params
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body || '';
    return `${method}:${url}:${body}`;
  }

  async fetch(url: string, options?: RequestInit): Promise<any> {
    const cacheKey = this.getCacheKey(url, options);
    const now = Date.now();
    const cached = this.cache.get(cacheKey);

    // Return existing promise if request is very recent (deduplication)
    if (cached && (now - cached.timestamp) < this.DEDUP_DURATION) {
      console.log(`🔄 Returning cached promise for: ${url}`);
      return cached.promise;
    }

    // Return cached data if still valid
    if (cached?.data && (now - cached.timestamp) < this.CACHE_DURATION) {
      console.log(`💾 Returning cached data for: ${url}`);
      return Promise.resolve(cached.data);
    }

    // Make new request
    console.log(`🌐 Making new API request to: ${url}`);
    const promise = fetch(url, options).then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Update cache with data
      this.cache.set(cacheKey, {
        promise,
        timestamp: now,
        data
      });
      
      return data;
    }).catch((error) => {
      // Remove failed request from cache
      this.cache.delete(cacheKey);
      throw error;
    });

    // Store promise immediately for deduplication
    this.cache.set(cacheKey, {
      promise,
      timestamp: now
    });

    return promise;
  }

  // Clear specific cache entry
  clearCache(url: string, options?: RequestInit): void {
    const cacheKey = this.getCacheKey(url, options);
    this.cache.delete(cacheKey);
    console.log(`🗑️ Cleared cache for: ${url}`);
  }

  // Clear all cache
  clearAllCache(): void {
    this.cache.clear();
    console.log('🗑️ Cleared all API cache');
  }

  // Get cache stats for debugging
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global instance
export const apiCache = new ApiCache();

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).apiCache = apiCache;
}