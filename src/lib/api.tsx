import React, { createContext, useContext, useState, useEffect } from 'react';

// Central API fetch helper
let accessTokenMemory: string | null = localStorage.getItem('accessToken');
let refreshTokenMemory: string | null = localStorage.getItem('refreshToken');

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  setTokens(access: string, refresh: string) {
    accessTokenMemory = access;
    refreshTokenMemory = refresh;
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },

  clearTokens() {
    accessTokenMemory = null;
    refreshTokenMemory = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getTokens() {
    return { accessToken: accessTokenMemory, refreshToken: refreshTokenMemory };
  },

  async fetch(url: string, options: RequestInit = {}): Promise<any> {
    const headers = new Headers(options.headers || {});
    
    if (accessTokenMemory) {
      headers.set('Authorization', `Bearer ${accessTokenMemory}`);
    }
    
    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const targetUrl = url.startsWith('/api') ? `${API_BASE_URL}${url}` : url;
    const response = await fetch(targetUrl, { ...options, headers });

    if (response.status === 401) {
      // Try to refresh
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        // Retry original request
        headers.set('Authorization', `Bearer ${accessTokenMemory}`);
        const retryResponse = await fetch(targetUrl, { ...options, headers });
        return this.handleResponse(retryResponse);
      } else {
        this.clearTokens();
        // Custom window event to let App component handle redirect to login
        window.dispatchEvent(new Event('auth-expired'));
        throw new Error('Session expired');
      }
    }

    return this.handleResponse(response);
  },

  async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return response.blob();
    }
    if (contentType && contentType.includes('text/csv')) {
      return response.text();
    }
    
    let data: any = null;
    let text = '';
    
    try {
      text = await response.text();
      if (text.trim()) {
        data = JSON.parse(text);
      }
    } catch (e) {
      // JSON parsing failed (e.g. response was HTML or plain text)
    }

    if (!response.ok) {
      const errorMessage = (data && data.message) || (text && text.length < 100 ? text : null) || `Request failed with status ${response.status}`;
      console.error(`API Error: ${response.status} on ${response.url} - ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    return data;
  },

  async refreshTokens(): Promise<boolean> {
    if (!refreshTokenMemory) return false;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshTokenMemory }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.success && data.accessToken) {
        accessTokenMemory = data.accessToken;
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  get(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: 'GET' });
  },

  post(url: string, body?: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put(url: string, body?: any, options: RequestInit = {}) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete(url: string, options: RequestInit = {}) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  },
};

// React Auth Context
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    const tokens = api.getTokens();
    if (!tokens.accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/api/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        api.clearTokens();
        setUser(null);
      }
    } catch (err) {
      api.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    // Listen to session expiration events
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);

    return () => {
      window.removeEventListener('auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post('/api/auth/login', { email, password });
    if (data.success && data.accessToken && data.refreshToken) {
      api.setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      api.clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
