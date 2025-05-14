import { useContext } from 'react';
import { ProjectDetailsContext } from '../context/ProjectDetailsContext';

export const useProject = () => {
  const context = useContext(ProjectDetailsContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};