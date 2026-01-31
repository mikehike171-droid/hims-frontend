// Global API cache to prevent duplicate calls
class ApiCache {
  private cache = new Map<string, any>()
  private pendingRequests = new Map<string, Promise<any>>()

  async get<T>(key: string, fetcher: () => Promise<T>, ttl: number = 30000): Promise<T> {
    // Check if we have a cached result
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key)
    if (pending) {
      return pending
    }

    // Make the request
    const promise = fetcher().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() })
      this.pendingRequests.delete(key)
      return data
    }).catch(error => {
      this.pendingRequests.delete(key)
      throw error
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key)
      this.pendingRequests.delete(key)
    } else {
      this.cache.clear()
      this.pendingRequests.clear()
    }
  }
}

export const apiCache = new ApiCache()