import { logout } from './auth';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

const isNetworkError = (error: any): boolean => {
  return !window.navigator.onLine || error instanceof TypeError;
};

const refreshTokens = async (): Promise<{ success: boolean; isNetworkError: boolean }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    // If we get a response (even if it's an error), it's not a network error
    return { 
      success: response.ok,
      isNetworkError: false 
    };
  } catch (error) {
    // Check if it's a network error
    return { 
      success: false,
      isNetworkError: isNetworkError(error)
    };
  }
};

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const { skipAuth = false, ...fetchOptions } = options;

  const finalOptions: RequestInit = {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      ...fetchOptions.headers,
      'Content-Type': 'application/json',
    },
  };

  try {
    let response = await fetch(url, finalOptions);

    if (response.status === 401 && !skipAuth) {
      const { success, isNetworkError } = await refreshTokens();

      if (success) {
        // Retry the original request after successful refresh
        response = await fetch(url, finalOptions);
      } else if (!isNetworkError) {
        // Only logout if it's not a network error
        await logout();
        throw new Error('Authentication failed');
      } else {
        // If it's a network error, throw a specific error
        throw new Error('Network error during token refresh');
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Authentication failed') {
        throw error;
      } else if (error.message === 'Network error during token refresh') {
        throw error;
      }
    }
    throw new Error('Network request failed');
  }
};

// Helper methods for common HTTP methods
export const http = {
  get: (url: string, options?: FetchOptions) => 
    fetchWithAuth(url, { ...options, method: 'GET' }),
  
  post: (url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (url: string, options?: FetchOptions) =>
    fetchWithAuth(url, { ...options, method: 'DELETE' }),
  
  patch: (url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};