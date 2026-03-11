// Global API client with 401 interceptor
import authService from './authService';

const createApiClient = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await originalFetch(input, init);
    
    if (response.status === 401) {
      authService.logout();
      return response;
    }
    
    return response;
  };
};

// Initialize on client side
if (typeof window !== 'undefined') {
  createApiClient();
}

export { createApiClient };