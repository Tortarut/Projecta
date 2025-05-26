import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import styles from './TasksPage.module.scss';
import { useEffect, useMemo, useState } from 'react';
import { usePageTitle } from '../../context/PageTitleContext';
import { CreateTaskModal } from '../../components/CreateTaskModal/CreateTaskModal';

type SortOption = 'project' | 'name' | 'urgency';

export const TasksPage = () => {
  const { setTitle, setSubtitle } = usePageTitle();

  useEffect(() => {
    setTitle(`Задачи`);
    setSubtitle(``);
  }, [setTitle, setSubtitle]);

  const { tasks, loading, refresh } = useTasks();
  const [sortBy, setSortBy] = useState<SortOption>('project');
  const [isModalOpen, setModalOpen] = useState(false);

    const normalizedTasks = useMemo(() => {
    return tasks.map(task => ({
      ...task,
      deadline: new Date(task.deadline).getTime(),
    }));
  }, [tasks]);

    const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'project':
          return a.project.name.localeCompare(b.project.name);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'urgency': {
          const dateA = new Date(a.deadline);
          const dateB = new Date(b.deadline);
          const timeA = isNaN(dateA.getTime()) ? Infinity : dateA.getTime();
          const timeB = isNaN(dateB.getTime()) ? Infinity : dateB.getTime();
          return timeA - timeB;
        }
        default:
          return 0;
      }
    });
  }, [tasks, sortBy]);

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
        <button className={styles.addButton} onClick={() => setModalOpen(true)}>+</button>
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

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  );
};
