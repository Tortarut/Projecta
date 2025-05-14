import { useEffect } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useUser } from '../../hooks/useUser';
import { usePageTitle } from '../../context/PageTitleContext';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import styles from './Dashboard.module.scss';

export const Dashboard = () => {
  const { data, loading, error } = useDashboard();
  const { user, loading: userLoading } = useUser();
  const { setTitle, setSubtitle } = usePageTitle();

  useEffect(() => {
    if (user && data) {
      setTitle(`Привет, ${user.name}!`);
      setSubtitle(`Команда "${data.team.name}"`);
    }
  }, [user, data, setTitle, setSubtitle]);

  if (loading || userLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!data) return <div>Нет данных</div>;

  return (
    <div className={styles.dashboard}>
      <h2>Ближайшие задачи</h2>
      <div className={styles.cards}>
        {data.upcoming_tasks.slice(0, 3).map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <h2>Текущие проекты</h2>
      <div className={styles.cards}>
        {data.upcoming_projects.slice(0, 3).map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
