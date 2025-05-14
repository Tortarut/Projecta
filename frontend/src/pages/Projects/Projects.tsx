import { useProjectsContext } from '../../hooks/useProjects';
import { FullProjectCard } from '../../components/FullProjectCard/FullProjectCard';
import styles from './Projects.module.scss';
import { Project } from '../../types';
import { usePageTitle } from '../../context/PageTitleContext';
import { useEffect } from 'react';

export const Projects = () => {
  const { projects, loading, error } = useProjectsContext();
  const { setTitle, setSubtitle } = usePageTitle();
  
  useEffect(() => {
        setTitle(`Проекты`);
        setSubtitle(``);
    }, [setTitle, setSubtitle]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!projects || projects.length === 0) return <p>Нет проектов</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1></h1>
        <button className={styles.addButton}>+</button>
      </div>
      <div className={styles.grid}>
        {projects.map((project: Project) => (
          <FullProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};
