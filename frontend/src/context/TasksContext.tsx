import { createContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import api from '../api/axios';

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const TasksContext = createContext<TasksContextType>({
  tasks: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/user-tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке задач', err);
      setError('Не удалось загрузить задачи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, loading, error, refresh: fetchTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
