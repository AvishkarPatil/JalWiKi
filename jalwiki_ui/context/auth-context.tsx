"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  // You might want to add other fields here that are part of the core user object
  // e.g., email, profile_picture_url, if they are frequently needed and updated
}

interface LoginCredentials { email: string; password: string; }
interface RegisterData extends LoginCredentials { username: string; first_name: string; last_name: string; }

interface LoginApiResponse {
  status: boolean;
  message: string;
  username?: string;
  user_id?: number;
  tokens?: {
    access: string;
  };
}

interface RegisterApiResponse {
    status: boolean;
    message: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
}

// 1. UPDATE AuthContextType
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // <-- ADD THIS LINE
}

// Initialize context with null, but useAuth will ensure it's not null when consumed
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null); // Renamed to setUserState to avoid confusion
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const clearAuthData = (reason: string = "Unknown") => {
    console.log(`AUTH_CONTEXT: Clearing auth data. Reason: ${reason}`);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
    }
    setUserState(null); // Use the renamed state setter
  };

  useEffect(() => {
    let isMounted = true;
    console.log("AUTH_CONTEXT: Provider mounted. Starting initial LOCAL auth check...");

    if (isMounted) setLoading(true);

    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (token && userId && username) {
      console.log(`AUTH_CONTEXT: Found token/userId/username in localStorage. Setting user optimistically: { id: ${userId}, username: ${username} }`);
      if (isMounted) {
        setUserState({ id: userId, username: username }); // Use the renamed state setter
      }
    } else {
      console.log("AUTH_CONTEXT: Missing token/userId/username in localStorage for initial check.");
      if (isMounted) {
        clearAuthData("Missing token/userId/username in localStorage");
      }
    }

    if (isMounted) {
      console.log("AUTH_CONTEXT: Initial local auth check finished.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
      console.log("AUTH_CONTEXT: Provider unmounted.");
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    console.log("AUTH_CONTEXT: Attempting login...");
    setLoading(true);
    try {
      const response = await api.post<LoginApiResponse>('/users/login/', credentials);
      console.log("AUTH_CONTEXT: Login API Response:", response.data);

      if (response.data.status && response.data.tokens?.access && response.data.user_id && response.data.username) {
        console.log("AUTH_CONTEXT: Login successful. Storing data and setting user state.");
        localStorage.setItem('accessToken', response.data.tokens.access);
        localStorage.setItem('userId', String(response.data.user_id));
        localStorage.setItem('username', response.data.username);

        setUserState({ // Use the renamed state setter
          id: String(response.data.user_id),
          username: response.data.username,
        });

        console.log("AUTH_CONTEXT: Login finished successfully.");
        setLoading(false);
        return { success: true };
      } else {
        console.error("AUTH_CONTEXT: Login API reported failure or missing data:", response.data.message);
        clearAuthData("Login API failure or missing data");
        setLoading(false);
        return { success: false, message: response.data.message || 'Login failed - incomplete data received.' };
      }
    } catch (error: any) {
      console.error('AUTH_CONTEXT: Login network/request error:', error);
      clearAuthData("Login network error");
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during login.'
      };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    console.log("AUTH_CONTEXT: Attempting registration...");
    setLoading(true);
    try {
      const response = await api.post<RegisterApiResponse>('/users/register/', userData);
      console.log("AUTH_CONTEXT: Register API Response:", response.data);

      if (response.data.status) {
        console.log("AUTH_CONTEXT: Registration successful. Proceeding to login...");
        // After successful registration, automatically log the user in
        return await login({ email: userData.email, password: userData.password });
      } else {
        console.error("AUTH_CONTEXT: Register API reported failure:", response.data.message);
        setLoading(false);
        return { success: false, message: response.data.message || 'Registration failed.' };
      }
    } catch (error: any) {
      console.error('AUTH_CONTEXT: Registration network/request error:', error);
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'An error occurred during registration.'
      };
    }
  };

  const logout = () => {
    console.log("AUTH_CONTEXT: Logging out...");
    clearAuthData("User initiated logout");
    setLoading(false); // Ensure loading is false after logout
    router.push('/auth'); // Redirect to login page
  };

  // 2. UPDATE the value provided by the context
  const contextValue: AuthContextType = {
    user, // This is the state variable 'user' from useState
    loading,
    login,
    register,
    logout,
    setUser: setUserState, // <-- PROVIDE THE STATE SETTER FUNCTION HERE
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // This error should ideally not happen if AuthProvider wraps the app correctly
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}