import { createContext, useState, useEffect, ReactNode } from 'react';
import { DashboardData } from '../types';
import api from '../api/axios';

interface DashboardContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке дашборда', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh: fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};
