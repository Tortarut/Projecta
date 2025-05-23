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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    setUser(null);
    setIsLoading(false);
    return;
  }

  try {
    const userRes = await api.get('/users/me/');
    setUser(userRes.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Просто сбрасываем user, без удаления токенов или редиректа
      setUser(null);
    } else {
      console.error('Ошибка при проверке авторизации', error);
    }
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    checkAuth();

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const url = error.config?.url || '';
        const isLoginRequest = url.includes('/token/');
        const isCheckAuthRequest = url.includes('/users/me/');

        if (error.response?.status === 401 && !isLoginRequest && !isCheckAuthRequest) {
          logout();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const res = await api.post('/token/', { email, password });
    localStorage.setItem('token', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    await checkAuth(); // загружаем данные пользователя
    return true;
  } catch (error: any) {

    // Без вызова logout() — не сбрасываем состояние и токены
    // Проверяем, это ошибка авторизации (401), или что-то другое
    if (error.response?.status === 401) {
      // Возвращаем false как признак неправильных данных
      return false;
    }

    // Прочие ошибки (например, сеть, сервер)
    throw new Error('Ошибка при входе. Попробуйте позже.');
  }
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
