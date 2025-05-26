import styles from './TaskCard.module.scss';
import { formatDistanceStrict } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Task } from '../../types';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import api from '../../api/axios';
import { useTasks } from '../../hooks/useTasks';

interface Props {
  task: Task;
}

export const TaskCard = ({ task }: Props) => {
  const [hovered, setHovered] = useState(false);
  const { refresh } = useTasks();

  const remaining = formatDistanceStrict(new Date(), new Date(task.deadline), {
    locale: ru,
  });

  const isDone = task.status === 'Готово';

  const handleClick = async () => {
    if (isDone) return;

    try {
      await api.patch(`/tasks/${task.id}/`, { status: 'Готово' });
      await refresh();
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
    }
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
    >
      <h3>{task.name}</h3>
      <p className={styles.projectName}>Проект “{task.project.name}”</p>
      <div className={styles.footer}>
        <span className={styles.deadline}>
          <Clock size={16} style={{ marginRight: '4px' }} />
          Осталось: {remaining}
        </span>
        {isDone ? (
          <button className={`${styles.statusButton} ${styles.done}`}>
            Готово
          </button>
        ) : hovered ? (
          <button className={styles.completeButton}>Выполнить</button>
        ) : (
          <button className={`${styles.statusButton} ${styles.inProgress}`}>
            В процессе
          </button>
        )}
      </div>
    </div>
  );
};
