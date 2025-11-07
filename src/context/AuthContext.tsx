'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        const currentTime = Date.now() / 1000;

        if (user.exp > currentTime) {
          setToken(storedToken);
          setUser(user);
        } else {
          // Token expired
          logout();
        }
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        logout();
      }
    } else if (storedToken && !storedUser) {
      // Token exists but user data is missing, clear and logout
      logout();
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const decodedUser = jwtDecode<User>(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(decodedUser));
      setToken(newToken);
      setUser(decodedUser);
    } catch (error) {
      console.error('Failed to decode token or login', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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