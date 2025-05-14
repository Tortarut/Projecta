// AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';

interface User {
  id: number;
  email: string;
  name: string;
  position: string;
  team: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Добавляем состояние загрузки
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true, // Начальное состояние - загрузка
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me/')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false)); // В любом случае завершаем загрузку
    } else {
      setIsLoading(false); // Если токена нет, тоже завершаем загрузку
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/token/', {
      email,
      password
    });
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    const userRes = await api.get('/users/me/');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};