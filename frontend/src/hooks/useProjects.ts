import { useContext } from 'react';
import { ProjectsContext } from '../context/ProjectContext';

export const useProjectsContext = () => useContext(ProjectsContext);
