
import { createContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/axios';
import { ProjectDetails } from '../types';

interface ProjectDetailsContextType {
  project: ProjectDetails | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const ProjectDetailsContext = createContext<ProjectDetailsContextType>({
  project: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export const ProjectDetailsProvider = ({ children, projectId }: { children: ReactNode; projectId: number }) => {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить проект');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return (
    <ProjectDetailsContext.Provider value={{ project, loading, error, refresh: fetchProject }}>
      {children}
    </ProjectDetailsContext.Provider>
  );
};