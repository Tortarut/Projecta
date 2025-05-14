import styles from './TaskCardAlt.module.scss';
import { Task } from '../../types';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export const TaskCardAlt = ({ name, deadline, status }: Task) => {
  const remaining = formatDistanceToNow(new Date(deadline), {
    addSuffix: false,
    locale: ru,
  });
  const isDone = status === 'done';

  return (
    <div className={styles.card}>
      <p className={styles.name}>{name}</p>
      <div className={styles.bottom}>
        <span className={styles.deadline}>
          <Clock size={14} strokeWidth={2} />
          <span>{remaining}</span>
        </span>
        <span className={isDone ? styles.done : styles.pending}>
          {isDone ? 'Готово' : 'В процессе'}
        </span>
      </div>
    </div>
  );
};
