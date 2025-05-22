import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import styles from './TasksPage.module.scss';
import { useEffect, useState } from 'react';
import { usePageTitle } from '../../context/PageTitleContext';

type SortOption = 'project' | 'name' | 'urgency';

export const TasksPage = () => {
    const { setTitle, setSubtitle } = usePageTitle();
      
      useEffect(() => {
            setTitle(`Задачи`);
            setSubtitle(``);
        }, [setTitle, setSubtitle]);
        
  const { tasks, loading } = useTasks();
  const [sortBy, setSortBy] = useState<SortOption>('project');

  const sortedTasks = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'project':
        return a.project.name.localeCompare(b.project.name);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'urgency':
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      default:
        return 0;
    }
  });

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
            <option value="project">Наименованию проекта</option>
            <option value="name">Наименованию задачи</option>
            <option value="urgency">Срочности</option>
          </select>
        </div>
        <button className={styles.addButton}>+</button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};
