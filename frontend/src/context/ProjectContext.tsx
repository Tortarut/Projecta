import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/axios';
import { Project } from '../types';

interface ProjectsContextType {
  projects: Project[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const ProjectsContext = createContext<ProjectsContextType>({
  projects: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/team-projects/`);
      setProjects(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке проектов:', err);
      setError('Не удалось загрузить проекты');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider value={{ projects, loading, error, refresh: fetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  );
};
