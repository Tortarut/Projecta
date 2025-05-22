import { useProjectsContext } from '../../hooks/useProjects';
import { FullProjectCard } from '../../components/FullProjectCard/FullProjectCard';
import styles from './Projects.module.scss';
import { Project } from '../../types';
import { usePageTitle } from '../../context/PageTitleContext';
import { useEffect, useState } from 'react';

type SortOption = 'name' | 'urgency' | 'progress' | 'tasksCount';

export const Projects = () => {
  const { projects, loading, error } = useProjectsContext();
  const { setTitle, setSubtitle } = usePageTitle();
  const [sortBy, setSortBy] = useState<SortOption>('name');
  
  useEffect(() => {
    setTitle(`Проекты`);
    setSubtitle(``);
  }, [setTitle, setSubtitle]);

  const sortedProjects = [...(projects || [])].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'urgency':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case 'progress':
        return a.completion_percent - b.completion_percent;
      case 'tasksCount':
        return a.user_tasks_remaining - b.user_tasks_remaining;
      default:
        return 0;
    }
  });

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!projects || projects.length === 0) return <p>Нет проектов</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.sortBlock}>
          <span className={styles.sortLabel}>Сортировать по:</span>
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="name">Наименованию</option>
            <option value="urgency">Срочности</option>
            <option value="progress">Прогрессу</option>
            <option value="tasksCount">Количеству задач</option>
          </select>
        </div>
        <button className={styles.addButton}>+</button>
      </div>
      <div className={styles.grid}>
        {sortedProjects.map((project: Project) => (
          <FullProjectCard key={project.id} {...project} />
        ))}
      </div>
    </div>
  );
};