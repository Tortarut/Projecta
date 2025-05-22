import { createContext, useState, useEffect, ReactNode } from 'react';
import { Task, Project } from '../types';
import api from '../api/axios';

interface CalendarContextType {
  tasks: Task[];
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/all-tasks-projects/');
      setTasks(res.data.upcoming_tasks);
      setProjects(res.data.upcoming_projects);
    } catch (err) {
      console.error('Ошибка при загрузке календаря', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  return (
    <CalendarContext.Provider value={{ tasks, projects, loading, error, refresh: fetchCalendar }}>
      {children}
    </CalendarContext.Provider>
  );
};
