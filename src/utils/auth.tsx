interface MessageResponse {
  success: boolean;
  message?: string;
}

export const login = async (email: string, password: string): Promise<MessageResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed: ' + response.statusText);
    }
    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    throw new Error('Login error: ' + (error instanceof Error ? error.message : 'An unexpected error occurred'));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Navigate to login page
    window.location.href = '/';
  }
};

export const refreshTokens = async (): Promise<MessageResponse> => {
  try {
    // Check if online before making the request
    if (!navigator.onLine) {
      return { success: false, message: 'No internet connection available' };
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return { success: response.ok, message: data.message };
  } catch (error) {
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('network')) {
      return { success: false, message: 'Network error: Please check your internet connection' };
    }
    return { success: false, message: 'An error occurred during token refresh' };
  }
}

export type Auth = {
  status: 'loggedOut' | 'loggedIn'
  login: (email: string, password: string) => Promise<MessageResponse>
  logout: () => Promise<void>
  refreshTokens: () => Promise<MessageResponse> 
}

export const auth: Auth = {
  status: 'loggedOut',
  login: async (email: string, password: string) => {
    const response = await login(email, password);
    auth.status = response.success ? 'loggedIn' : 'loggedOut';
    return response;
  },
  logout: async () => {
    await logout();
    auth.status = 'loggedOut';
  },
  refreshTokens,
}