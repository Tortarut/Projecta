import styles from './TaskCardAlt.module.scss';
import { Task } from '../../types';
import { Clock } from 'lucide-react';
import { formatDistanceStrict } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import api from '../../api/axios';

interface Props extends Task {
  refresh?: () => void;
}

export const TaskCardAlt = ({ id, name, deadline, status, refresh }: Props) => {
  const remaining = formatDistanceStrict(new Date(), new Date(deadline), {
    locale: ru,
  });

  const [hovered, setHovered] = useState(false);
  const isDone = status === 'Готово';

  const handleClick = async () => {
    if (isDone) return;
    try {
      await api.patch(`/tasks/${id}/`, { status: 'Готово' });
      if (refresh) await refresh();
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
      <p className={styles.name}>{name}</p>
      <div className={styles.bottom}>
        <span className={styles.deadline}>
          <Clock size={14} strokeWidth={2} />
          <span>Осталось {remaining}</span>
        </span>
        {isDone ? (
          <span className={styles.done}>Готово</span>
        ) : hovered ? (
          <span className={styles.completeButton}>Выполнить</span>
        ) : (
          <span className={styles.pending}>В процессе</span>
        )}
      </div>
    </div>
  );
};
